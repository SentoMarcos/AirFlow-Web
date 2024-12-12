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
// ---------------------------------------------------------
// Inicializa el mapa con una ubicación inicial genérica
var map = L.map('mapa', {
    zoomControl: false // Deshabilita el control de zoom predeterminado
}).setView([51.505, -0.09], 13); // Valencia como ubicación inicial

// Agrega el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
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

// ---------------------------------------------------------
// BUSCADOR
// ---------------------------------------------------------
// Función para realizar la geocodificación usando Nominatim
async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
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
            NO2: ${components.no2} µg/m³<br>
        `;

        // Añadir un marcador en el mapa
        L.marker([lat, lon]).addTo(map).bindPopup(popupContent).openPopup();
    } catch (error) {
        console.error("Error al obtener datos de calidad del aire:", error);
    }
}

// ---------------------------------------------------------
// MAPA DE CALOR
// ---------------------------------------------------------
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
async function initMapa() {
    const { mediciones, datosHeatmap } = await obtenerMediciones(); // Espera a obtener las mediciones

    if (datosHeatmap.length > 0) {
        mostrarMarcadores(mediciones); // Solo agrega el mapa si hay datos
        agregarMapaDeCalor(datosHeatmap); // Solo agrega el mapa si hay datos
    } else {
        console.warn("No hay datos para mostrar en el mapa de calor.");
    }
}
let currentZoom = map.getZoom();  // Guardar el zoom inicial
let markers = [];  // Array para almacenar los marcadores

function mostrarMarcadores(mediciones) {
    // Limpiar todos los marcadores anteriores del mapa
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer); // Eliminar todos los marcadores
        }
    });

    // Crear un array para almacenar las coordenadas de las mediciones
    const waypoints = [];

    // Añadir los marcadores para las mediciones
    mediciones.forEach(function(medicion) {
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
            marcador.on('popupopen', function(e) {
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

function agregarMapaDeCalor(datosHeatmap) {
    // Agregar el mapa de calor usando los datos transformados
    L.heatLayer(datosHeatmap, {
        radius: 25,      // Radio de cada punto
        blur: 40,        // Suavizado entre puntos
        maxZoom: 10,      // Máximo nivel de zoom para mostrar calor
        zIndex: 1000,    // Asegura que el mapa de calor esté por encima
        max: 1.0,
        gradient: {
            0.2: 'blue',    // Intensidad baja
            0.4: 'cyan',    // Intensidad moderada-baja
            0.6: 'lime',    // Intensidad moderada-alta
            0.8: 'yellow',  // Intensidad alta
            1: 'red'        // Intensidad muy alta
        }
    }).addTo(map);
}

// Llamada a la función de inicialización
initMapa();
