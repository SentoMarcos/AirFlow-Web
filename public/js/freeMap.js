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
import * as turf from 'https://cdn.skypack.dev/@turf/turf';
console.log(turf);
fetch('/mapa/mapa-config')
    .then(response => response.json())
    .then(config => {
            map = L.map('mapa', {
            zoomControl: config.zoomControl,
        }).setView(config.center, config.zoom);

        L.tileLayer(config.tileLayer.url, {
            maxZoom: config.maxZoom,
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

        // Crear el control de capas para añadir al mapa
        const controlCapas = L.control.layers(
            {
                "Mapa de Calor (Todos los Gases)": capasGases.interpolatedLayerGroup,
                "Mapa CO2": capasGases.co2LayerGroup,
                "Mapa NO2": capasGases.no2LayerGroup,
                "Mapa O3": capasGases.o3LayerGroup
            },
            null, 
            { position: 'bottomleft' }
        ).addTo(map);

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
        // MAPA DE CALOR
        // ---------------------------------------------------------
        async function initMapa() {
            try {
                // Mostrar indicador de carga
                mostrarCargando();

                await initCapas();

                // Comprobar si los datos de gases están disponibles para agregarlos al mapa
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

                // Ocultar indicador de carga
                ocultarCargando();
            } catch (error) {
                console.error("Error en initMapa:", error);
                ocultarCargando(); // Asegurar que el indicador desaparezca en caso de error
            }
        }

        // ---------------------------------------------------------
        //  FILTRAR DATOS POR PROXIMIDAD
        // ---------------------------------------------------------
        function filtrarDatosPorProximidad(datos, distanciaMaximaKm) {
            const filtrarPorDistancia = (lat1, lon1, lat2, lon2) => {
                const R = 6371; // Radio de la Tierra en km
                const dLat = ((lat2 - lat1) * Math.PI) / 180;
                const dLon = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c; // Distancia en km
            };

            const filtrados = [];

            datos.forEach((punto) => {
                const [lat, lon, valor] = punto;

                // Verifica si el punto ya tiene vecinos cercanos en la lista filtrada
                const cercano = filtrados.find(([fLat, fLon, fValor]) => {
                    const distancia = filtrarPorDistancia(lat, lon, fLat, fLon);
                    return distancia <= distanciaMaximaKm && fValor >= valor;
                });

                if (!cercano) {
                    // Si no hay vecino cercano, añade este punto
                    filtrados.push(punto);

                    // Elimina puntos cercanos de menor valor en la lista filtrada
                    for (let i = filtrados.length - 1; i >= 0; i--) {
                        const [fLat, fLon, fValor] = filtrados[i];
                        const distancia = filtrarPorDistancia(lat, lon, fLat, fLon);
                        if (distancia <= distanciaMaximaKm && fValor < valor) {
                            filtrados.splice(i, 1); // Elimina el punto de menor valor
                        }
                    }
                }
            });
            return filtrados;
        }

        // ---------------------------------------------------------
        // MAPA DE CALOR POR IDW
        // ---------------------------------------------------------
        function agregarMapaDeCalorPorValores(datos, layerGroup) {
            if (!datos || datos.length === 0) {
                console.warn("No hay datos para el mapa interpolado.");
                return;
            }

            // Obtener los valores reales
            const valores = datos.map((punto) => punto[2]);
            const minValor = Math.min(...valores);
            const maxValor = Math.max(...valores);

            // Crear capa IDW
            const idwLayer = L.idwLayer(
                datos.map((punto) => [
                    punto[0], // Latitud
                    punto[1], // Longitud
                    punto[2], // Valor real, sin normalización
                ]),
                {
                    opacity: 0.5, // Hacer el mapa más visible
                    cellSize: 7, // Resolución del mapa de calor
                    exp: 2, // Controlar la dispersión del impacto de los datos
                    min: minValor, // Valor mínimo de los datos
                    max: maxValor, // Valor máximo de los datos

                    // Función para asignar colores basados en valores reales
                    color: (val) => {
                        return getColor(val);
                    },
                }
            );

            // Añadir la capa IDW al grupo especificado
            idwLayer.addTo(layerGroup);
        }

        // ---------------------------------------------------------
        // DATOS AEMET
        // ---------------------------------------------------------
        async function initCapas() {
            // Carga y asigna datos a las capas
            //await obtenerCalidadAire(39.5, -1.0);
            await cargarDatosGVA();
            await cargarDatosAemet();
            //agregarMapaDeCalorPorCirculos([[39.5, -1.0, 0.8], [39.6, -1.1, 0.6]]); // Ejemplo de datos

            // Agrega las capas al mapa (pueden estar activas por defecto o no)
            capas.estacionesAEMET.addTo(map);
            capas.estacionesGVA.addTo(map);
            capas.mapaCalor.addTo(map);
        }
        async function cargarDatosAemet() {
            const AemetKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb3JlYm9sbG8wMkBnbWFpbC5jb20iLCJqdGkiOiJhMDNkNGY3MS1hMWI4LTQ4OWEtODM3YS1kNzFkMmNmMTU5OTIiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTczNjI3NjU2OCwidXNlcklkIjoiYTAzZDRmNzEtYTFiOC00ODlhLTgzN2EtZDcxZDJjZjE1OTkyIiwicm9sZSI6IiJ9.CWvCCuTHlttrTzPeXflUIIr3QdaKhlBE6SC1C2nYwJA'; // Reemplaza con tu clave de API de Aemet
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

        // ---------------------------------------------------------
        // DATOS GVA
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