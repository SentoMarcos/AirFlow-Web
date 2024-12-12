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
}).setView([40.43, -3.65], 12); // Madrid como ubicación inicial

// Agrega el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Añade el control de zoom en la esquina inferior izquierda
L.control.zoom({
    position: 'bottomright' // Cambia la posición del control de zoom
}).addTo(map);

// Usa la geolocalización del navegador para obtener tu ubicación
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map);
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
    gradient: {
            0.2: 'blue',    // Intensidad baja
            0.4: 'cyan',    // Intensidad moderada-baja
            0.6: 'lime',    // Intensidad moderada-alta
            0.8: 'yellow',  // Intensidad alta
            1: 'red'        // Intensidad muy alta
    } // Colores personalizados para el mapa de calor
}).addTo(map);

// ---------------------------------------------------------
// CALIDAD DE AIRE
// ---------------------------------------------------------
const apiKey = "bc28af6f5f9fbf476f6ee1d5836b002a";
const airPollutionEndpoint = "https://api.openweathermap.org/data/2.5/air_pollution";

async function getAirPollutionData(lat, lon) {
    const url = `${airPollutionEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();

        const { list } = data;
        const { main, components } = list[0];
        const popupContent = `
            <b>Calidad del Aire</b><br>
            AQI (Índice de Calidad del Aire): ${main.aqi}<br>
            PM2.5: ${components.pm2_5} µg/m³<br>
            PM10: ${components.pm10} µg/m³<br>
            O3: ${components.o3} µg/m³<br>
            NO2: ${components.no2} µg/m³<br>
        `;

        L.marker([lat, lon]).addTo(map).bindPopup(popupContent).openPopup();
    } catch (error) {
        console.error("Error al obtener datos de calidad del aire:", error);
    }
}

// ---------------------------------------------------------
// REGISTRADO
// ---------------------------------------------------------
