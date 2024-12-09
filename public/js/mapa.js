/**
 * @file mapa.js
 * @description Este archivo contiene el código JavaScript necesario para iniciar los mapas.
 * @requires fetch
 */

// ---------------------------------------------------------
// NO REGISTRADO
// ---------------------------------------------------------

// Añade el control de zoom en la esquina inferior izquierda
    L.control.zoom({
        position: 'bottomright' // Cambia la posición del control de zoom
        }).addTo(map);
// Usa la geolocalización del navegador para obtener tu ubicación
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Obtiene las coordenadas del usuario
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
// Asegura que el mapa se ajusta correctamente en pantalla completa
    setTimeout(() => {
        map.invalidateSize();
    }, 300);

// Clave de API de OpenWeatherMap
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
// REGISTRADO
// ---------------------------------------------------------
