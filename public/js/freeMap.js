/**
 * @file mapa.js
 * @description Este archivo contiene el código JavaScript necesario para iniciar los mapas y mostrar datos de calidad de aire y un mapa de calor.
 * @requires fetch
 */

// ---------------------------------------------------------
// PARA USUARIOS NO REGISTRADOS
// ---------------------------------------------------------
// ---------------------------------------------------------
// INICIALIZACIÓN DEL MAPA
// --------------------------------------------------------

let map; // Variable global para el mapa
let capas;
let capasGases;
fetch('/mapa/mapa-config')
    .then(response => response.json())
    .then(config => {
            map = L.map('mapa', {
            zoomControl: config.zoomControl
        }).setView(config.center, config.zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Usa la geolocalización del navegador para obtener tu ubicación
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    // Centra el mapa en las coordenadas del usuario
                    map.setView([lat, lng], 13);

                    // Agrega un marcador con el icono personalizado en la ubicación del usuario
                    L.marker([lat, lng], { icon: customIcon }).addTo(map);
                },
                function (error) {
                    console.error('Error al obtener la ubicación: ', error);
                }
            );
        } else {
            console.error('Geolocalización no es compatible con este navegador.');
        }

        setTimeout(() => {
            map.invalidateSize();
        }, 300);

        // Inicializa grupos de capas
        capas = {
            calidadAire: L.layerGroup(),
            estacionesGVA: L.layerGroup(),
            estacionesAEMET: L.layerGroup(),
            mapaCalor: L.layerGroup(),
        };

        capasGases = {
            // Crear los grupos de capas
            interpolatedLayerGroup : L.layerGroup(),
            co2LayerGroup : L.layerGroup(), // Capa para CO2
            no2LayerGroup : L.layerGroup(), // Capa para NO2
            o3LayerGroup : L.layerGroup(),  // Capa para O3
        }
        // Añade las capas al control de capas
        /*var controlCapas = L.control.layers(null, {
            "Calidad del Aire": capas.calidadAire,
            "Estaciones GVA": capas.estacionesGVA,
            "Estaciones AEMET": capas.estacionesAEMET,
            "Mapa de Calor": capas.mapaCalor,
        }).addTo(map);*/



        // ---------------------------------------------------------
        // BOTONES DE ZOOM
        // ---------------------------------------------------------
        // Define el icono personalizado
        var customIcon = L.icon({
            iconUrl: 'img/ubicacion-marker.png', // Reemplaza con la URL de tu icono
            iconSize: [32, 48], // Tamaño del icono en píxeles
            iconAnchor: [16, 32], // Punto de anclaje del icono (centro en la parte inferior)
        });

        // Añade el control de zoom en un div personalizado
        var zoomControl = L.control.zoom({
            position: 'bottomright' // Esto no será visible, pero es necesario
        });

        // Sobrescribe el método `onAdd` para redirigir el control al contenedor personalizado
        zoomControl.onAdd = function (map) {
            var div = document.getElementById('botones-mapa');
            div.insertAdjacentHTML('afterbegin', `
        <div id="zoom-botones">
        <a class="leaflet-control-zoom-in" href="#" title="Zoom in">+</a>
        <a class="leaflet-control-zoom-out" href="#" title="Zoom out">−</a>
        </div>
    `);
            return div;
        };

        // Añade el control al mapa
        zoomControl.addTo(map);

        // Captura los eventos de los botones de zoom
        document.querySelector('#botones-mapa .leaflet-control-zoom-in').addEventListener('click', function (e) {
            e.preventDefault();
            map.zoomIn();
        });
        document.querySelector('#botones-mapa .leaflet-control-zoom-out').addEventListener('click', function (e) {
            e.preventDefault();
            map.zoomOut();
        });
        // Añade el evento de clic al botón para centrar en la ubicación del usuario
        function centrarEnMiUbicacion() {
            // Eliminar el marcador anterior si existe
            map.eachLayer(function (layer) {
                if (layer.options && layer.options.id === 'mi-ubicacion') {
                    map.removeLayer(layer);
                }
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        map.setView([lat, lng], 13);

                        // Crear un nuevo marcador con un ID personalizado
                        var marker = L.marker([lat, lng], {
                            icon: customIcon,
                            id: 'mi-ubicacion' // Asigna un ID al marcador
                        }).addTo(map);

                        // Puedes acceder al marcador por su ID más tarde
                        console.log(marker.options.id); // Esto imprimirá 'mi-ubicacion'
                    },
                    function (error) {
                        console.error('Error al obtener la ubicación: ', error);
                    }
                );
            } else {
                console.error('Geolocalización no es compatible con este navegador.');
            }
        }

        document.querySelector('#centrar-ubicacion').addEventListener('click', function (e) {
            e.preventDefault();
            centrarEnMiUbicacion();
        });

        // ---------------------------------------------------------
        // BUSCADOR
        // ---------------------------------------------------------
        // Función para realizar la geocodificación usando Nominatim
        async function geocodeAddress(query) {
            const apiKey = "1d8fc7e2f6014747b68feb71101c982a";
            const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${apiKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Geocoding error: ${response.status}`);
                }
                const data = await response.json();
                return data[0]; // Retorna el primer resultado
            } catch (error) {
                console.error('Error al buscar la dirección:', error);
                return null;
            }
        }

        // ---------------------------------------------------------
        // CALIDAD DE AIRE
        // ---------------------------------------------------------
        const apiKey = "bc28af6f5f9fbf476f6ee1d5836b002a";
        const airPollutionEndpoint = "https://api.openweathermap.org/data/2.5/air_pollution";

        
        // Función para obtener datos de contaminación y añadirlos al mapa
        async function getAirPollutionData(lat, lon) {
            const url = `${airPollutionEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();

                // Extraer datos de calidad del aire
                const { list } = data;
                const { main, components } = list[0];

                // Crear un popup con información
                const popupContent = `
                <b>Calidad del Aire</b><br>
                AQI (Índice de Calidad del Aire): ${main.aqi}<br>
                PM2.5: ${components.pm2_5} µg/m³<br>
                PM10: ${components.pm10} µg/m³<br>
                O3: ${components.o3} µg/m³<br>
                NO2: ${components.no2} µg/m³<br>`;

                // Añadir un marcador en el mapa
                L.marker([lat, lon]).addTo(map).bindPopup(popupContent).openPopup();
            } catch (error) {
                console.error("Error al obtener datos de calidad del aire:", error);
            }
        }
        

        // ---------------------------------------------------------
        // MAPA DE CALOR
        // ---------------------------------------------------------
            /*
                // Datos de ejemplo para el mapa de calor
                function asignarEstado(media) {
                    // Define los intervalos para los estados
                    if (!media) return 'vacio';
                    if (media <= 50) return 'excelente';
                    if (media <= 100) return 'bueno';
                    if (media <= 150) return 'moderado';
                    if (media <= 200) return 'malo';
                    return 'peligroso'; // Si es mayor a 100
                }
            */
        async function initMapa() {
            try {
                const { mediciones, datosPorGas } = await obtenerMediciones(); // Espera a obtener las mediciones

                // Crear los grupos de capas
                /*let interpolatedLayerGroup = L.layerGroup();
                let co2LayerGroup = L.layerGroup(); // Capa para CO2
                let no2LayerGroup = L.layerGroup(); // Capa para NO2
                let o3LayerGroup = L.layerGroup();  // Capa para O3*/
                await initCapas();
                if (datosPorGas.general.length > 0) {
                    // Agregar los datos al mapa de calor
                    agregarMapaDeCalorPorValores(datosPorGas.general, capasGases.interpolatedLayerGroup);
                    agregarMapaDeCalorPorValores(datosPorGas.CO2, capasGases.co2LayerGroup);
                    agregarMapaDeCalorPorValores(datosPorGas.NO2, capasGases.no2LayerGroup);
                    agregarMapaDeCalorPorValores(datosPorGas.O3, capasGases.o3LayerGroup);
                } else {
                    console.warn("No hay datos para mostrar en el mapa de calor.");
                }

                // Crear el control de capas para añadir al mapa
                const controlCapas = L.control.layers(
                    {
                        "Mapa de Calor (Todos los Gases)": capasGases.interpolatedLayerGroup,
                        "Mapa CO2": capasGases.co2LayerGroup,
                        "Mapa NO2": capasGases.no2LayerGroup,
                        "Mapa O3": capasGases.o3LayerGroup
                    }
                ).addTo(map);

                // Capa visible por defecto
                capasGases.interpolatedLayerGroup.addTo(map);

            } catch (error) {
                console.error("Error en initMapa:", error);
            }
        }

        // ---------------------------------------------------------
        // MAPA DE CALOR POR VALORES
        // ---------------------------------------------------------
        function agregarMapaDeCalorPorValores(datos, layerGroup) {
            if (!datos || datos.length === 0) {
                console.warn("No hay datos para el mapa interpolado.");
                return;
            }

            console.log("Datos para mapa interpolado:", datos); // Asegúrate de que los datos sean correctos

            // Determinar los valores mínimos y máximos de "valor" para normalizar
            const valores = datos.map((punto) => punto[2]); // Tercer valor del array es "valor"
            const minValor = Math.min(...valores);
            const maxValor = Math.max(...valores);

            // Normalizar un valor en el rango [minValor, maxValor] a [0, 1]
            const normalizarValor = (valor) => (valor - minValor) / (maxValor - minValor);
            
            datos.forEach(([latitud, longitud, valor]) => {
                const intensidad = normalizarValor(valor); // Normalizar el campo "valor"

                // Crear varios círculos con radios crecientes y opacidades decrecientes
                const steps = 5; // Número de pasos en la interpolación
                for (let i = 0; i < steps; i++) {
                    const radius = 100 + i * 100; // Incremento en el radio
                    const opacity = 0.8 - i * 0.15; // Decrece la opacidad
                    const color = obtenerColorPorIntensidad(intensidad);

                    const circle = L.circle([latitud, longitud], {
                        radius: radius,
                        color: color,
                        fillColor: color,
                        fillOpacity: opacity,
                        weight: 0,
                    });

                    // Añadir cada círculo al grupo de capas
                    circle.addTo(layerGroup);
                }
            });
        }

        // Función para obtener el color basado en la intensidad
        function obtenerColorPorIntensidad(intensidad) {
            // Define el gradiente de colores
            const colores = {
                0: '#63B8D9',  // Azul pastel
                0.2: '#8FE1B0',  // Verde pastel
                0.4: '#F0F67B',  // Amarillo pastel
                0.6: '#F69C4E',  // Naranja pastel
                0.8: '#F78A7D',  // Rojo pastel
            };

            // Encuentra el color más cercano a la intensidad
            let colorActual = 'blue';
            for (const key in colores) {
                if (intensidad >= parseFloat(key)) {
                    colorActual = colores[key];
                }
            }
            return colorActual;
        }

        // ---------------------------------------------------------
        //
        // ---------------------------------------------------------
        async function cargarDatosGVA() {
            const url = 'https://valencia.opendatasoft.com/api/records/1.0/search/?dataset=estacions-contaminacio-atmosferiques-estaciones-contaminacion-atmosfericas&rows=20';

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error al obtener datos de GVA: ${response.status}`);
                }
                const datos = await response.json();

                console.log("Datos de GVA:", datos);

                // Asegúrate de que el mapa esté inicializado antes de agregar el marcador
                if (typeof map !== 'undefined' && map) {
                    datos.records.forEach(record => {
                        const lat = record.fields.geo_point_2d[0];
                        const lon = record.fields.geo_point_2d[1];
                        const estacion = record.fields.nombre_estacion;

                        const marker = L.marker([lat, lon], {
                            id: `estacion-${record.recordid}`, // ID único para cada estación
                            icon: L.divIcon({
                                className: 'gva', // Clase personalizada
                                iconSize: [30, 30],
                                iconAnchor: [15, 30],
                                popupAnchor: [0, -30],
                                html: `<div class="custom-marker-icon"></div>`, // Personaliza el marcador
                            })
                        })
                            .bindPopup(`Estación: ${record.fields.nombre} <br> Tipo de emisiones: ${record.fields.tipoemisio} <br> Calidad del aire: ${record.fields.calidad_am}`)
                            //.openPopup(); // Opcional: abrir el popup al añadir el marcador
                            capas.estacionesGVA.addLayer(marker); // Añade el marcador a la capa


                        console.log(`Marcador añadido para la estación: ${estacion}`);
                    });
                } else {
                    console.error("El mapa no está inicializado.");
                }
            } catch (error) {
                console.error("Error al cargar datos de GVA:", error);
            }
        }
        // ---------------------------------------------------------
        // MARCADORES DE MEDICIONES
        // ---------------------------------------------------------
        /*
                let currentZoom = map.getZoom();  // Guardar el zoom inicial
        let markers = [];  // Array para almacenar los marcadores
        
            function mostrarMarcadores(mediciones) {
                // Limpiar todos los marcadores anteriores del mapa
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer); // Eliminar todos los marcadores
                    }
                });

                // Crear un array para almacenar las coordenadas de las mediciones
                const waypoints = [];

                // Añadir los marcadores para las mediciones
                mediciones.forEach(function (medicion) {
                    const { latitud, longitud, tipo_gas, fecha, valor } = medicion;

                    // Asegúrate de que las coordenadas son válidas
                    if (latitud && longitud) {
                        const latLng = [latitud, longitud];
                        const estado = asignarEstado(valor);

                        // Crear un ícono personalizado con clase basada en el estado
                        const customIcon = L.divIcon({
                            className: `custom-marker ${estado}`, // Clases personalizadas
                            iconSize: [30, 30], // Tamaño del ícono
                            iconAnchor: [15, 30], // Punto de anclaje del ícono
                            popupAnchor: [0, -30], // Posición del popup respecto al ícono
                        });

                        // Crear un marcador con el ícono personalizado
                        const marcador = L.marker(latLng, {
                            icon: customIcon,
                            latLng: latLng,  // Guardamos las coordenadas
                        });

                        // Añadir información al marcador (popup) con la clase de estado
                        marcador.bindPopup(`
                    <b>Tipo de Gas:</b> ${tipo_gas}<br>
                    <b>Fecha:</b> ${fecha}<br>
                    <b>Valor:</b> ${valor}<br>
                    <b>Estado:</b> <span class="${estado}">${estado}</span>
                `);

                        // Añadir el marcador al array de marcadores
                        markers.push(marcador);

                        // Añadir la clase de estado al contenedor del popup al abrirlo
                        marcador.on('popupopen', function (e) {
                            const popupContentWrapper = e.popup._container.querySelector('.leaflet-popup-content-wrapper');
                            if (popupContentWrapper) {
                                popupContentWrapper.classList.add(estado);
                            }
                        });

                        // Añadir el punto a la lista de waypoints (coordenadas para la ruta)
                        waypoints.push(latLng);
                    }
                });

                // Función para actualizar la visibilidad de los marcadores según el nivel de zoom
                function actualizarMarcadores() {
                    const zoom = map.getZoom();  // Obtener el zoom actual
                    const center = map.getCenter();  // Obtener el centro del mapa
                    const radio = 5000 / zoom;  // Radio de visibilidad (ajustar según necesidad)

                    // Iterar sobre los marcadores y mostrar/ocultar según la distancia del centro
                    markers.forEach(marcador => {
                        const distance = center.distanceTo(marcador.getLatLng());  // Calcular la distancia desde el centro

                        // Si la distancia es menor que el radio, mostramos el marcador, si no lo ocultamos
                        if (distance < radio) {
                            marcador.addTo(map);  // Mostrar marcador
                        } else {
                            map.removeLayer(marcador);  // Ocultar marcador
                        }
                    });
                }

                // Inicializar los marcadores en el mapa
                markers.forEach(marcador => {
                    marcador.addTo(map);
                });

                // Actualizar los marcadores cada vez que el zoom cambie
                map.on('zoomend', actualizarMarcadores);

                // Llamar a la función una vez al cargar para asegurar que el estado de los marcadores es correcto
                actualizarMarcadores();
            }
        */
        // ---------------------------------------------------------
        // DATOS AEMET
        // ---------------------------------------------------------
        async function initCapas() {
            // Carga y asigna datos a las capas
            //await obtenerCalidadAire(39.5, -1.0);
            await cargarDatosGVA();
            await cargarDatosAemet();
            //agregarMapaDeCalorPorValores([[39.5, -1.0, 0.8], [39.6, -1.1, 0.6]]); // Ejemplo de datos

            // Agrega las capas al mapa (pueden estar activas por defecto o no)
            capas.estacionesAEMET.addTo(map);
            capas.estacionesGVA.addTo(map);
            capas.mapaCalor.addTo(map);
        }
        async function cargarDatosAemet() {
            const AemetKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb3JlYm9sbG8wMkBnbWFpbC5jb20iLCJqdGkiOiJhYzc1ODlkNC1iNWVkLTQ5M2YtYTQ4ZS1mOGMxZjJmYWVjYzYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTczNDA0NTI1NywidXNlcklkIjoiYWM3NTg5ZDQtYjVlZC00OTNmLWE0OGUtZjhjMWYyZmFlY2M2Iiwicm9sZSI6IiJ9.ftBm8v1OGZII0zK23XNTgdjUlNA1s8exVusZcG5dfaw'; // Reemplaza con tu clave de API de Aemet
            const url = `https://opendata.aemet.es/opendata/api/red/especial/contaminacionfondo/estacion/12?api_key=${AemetKey}`;
            const lat = 39.083910491542845;
            const lon = -1.1011464074163988;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error al obtener datos de AEMET: ${response.status}`);
                }
                const data = await response.json();
                console.log("Datos de AEMET:", data);

                // Asegúrate de que el mapa esté inicializado antes de agregar el marcador
                if (typeof map !== 'undefined' && map) {
                    const marker = L.marker([lat, lon], {
                        id: 'aemet-station',       // Añade un ID personalizado al marcador
                        icon: L.divIcon({          // Utiliza un icono personalizado con clase
                            className: 'aemet', // Añade tu clase personalizada
                            iconSize: [30, 30], // Tamaño del ícono
                            iconAnchor: [15, 30], // Punto de anclaje del ícono
                            popupAnchor: [0, -30], // Posición del popup respecto al ícono
                            html: '<div class="custom-marker-icon"></div>', // Personaliza el contenido del marcador
                        })
                    })
                        .bindPopup('Ubicación de la estación AEMET')
                        capas.estacionesAEMET.addLayer(marker); // Añade el marcador a la capa
                     //.openPopup(); // Muestra el popup cuando se crea el marcador

                    console.log("Marcador añadido con clase 'custom-marker'");
                } else {
                    console.error("El mapa no está inicializado.");
                }
            } catch (error) {
                console.error("Error al cargar datos de AEMET:", error);
            }
        }
        // Llamada a las funciones de inicialización
        //cargarDatosAemet();
        initMapa().then(r => cargarDatosAemet().then(cargarDatosGVA()));
    })
    .catch(error => console.error("Error al cargar la configuración del mapa:", error));