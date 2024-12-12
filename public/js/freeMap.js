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

// Función para manejar la entrada de texto y mover el marcador
async function handleInputSearch(event) {
    if (event.key === 'Enter') { // Ejecutar cuando se presione Enter
        const input = event.target;
        const query = input.value;

        // Realiza la búsqueda de la dirección
        const location = await geocodeAddress(query);
        if (location) {
            const latlng = {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon),
            };

            if (input.id === 'punto-inicial') {
                setMarker(latlng, 'start');
            } else if (input.id === 'punto-final') {
                setMarker(latlng, 'end');
            }

            // Centrar el mapa en la ubicación
            map.setView(latlng, 15);

            // Si ambos puntos están definidos, trazar la ruta
            if (startMarker && endMarker) {
                traceRoute();
            }
        } else {
            alert('Dirección no encontrada. Intente con otra.');
        }
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
// Datos de ejemplo para el mapa de calor (Latitud, Longitud, Peso opcional)
var heatData = [
    [39.4702, -0.3750, 0.8], // Coordenadas de Valencia con un peso
    [39.4528, -0.3526, 0.5],
    [39.4708, -0.3774, 1.0]
];

// Agregar el mapa de calor
L.heatLayer(heatData, {
    radius: 25,      // Radio de cada punto
    blur: 35,        // Suavizado entre puntos
    maxZoom: 8,     // Máximo nivel de zoom para mostrar calor
    zIndex: 1000, // Asegura que el mapa de calor esté por encima
    gradient: {
        0.2: 'blue',    // Intensidad baja
        0.4: 'cyan',    // Intensidad moderada-baja
        0.6: 'lime',    // Intensidad moderada-alta
        0.8: 'yellow',  // Intensidad alta
        1: 'red'        // Intensidad muy alta
    } // Colores personalizados para el mapa de calor
}).addTo(map);
