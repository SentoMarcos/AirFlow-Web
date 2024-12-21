// Variables globales para los marcadores y la capa de ruta
let startMarker = null;
let endMarker = null;
let routingControl = null;

    // Vincular el evento "keypress" para ambos inputs
    /*document.getElementById('punto-inicial').addEventListener('keypress', handleInputSearch);
    document.getElementById('punto-final').addEventListener('keypress', handleInputSearch);*/

    // Función para establecer marcadores en el mapa
    function setMarker(latlng, type) {
        if (type === 'start') {
            if (startMarker) map.removeLayer(startMarker);
            startMarker = L.marker(latlng).addTo(map);
            document.getElementById('punto-inicial').value = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        } else if (type === 'end') {
            if (endMarker) map.removeLayer(endMarker);
            endMarker = L.marker(latlng).addTo(map);
            document.getElementById('punto-final').value = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
            traceRouteIndications();
        }
    }
// Función para manejar la entrada de texto y mover el marcador
/*async function handleInputSearch(event) {
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
}*/
    // Función para trazar una ruta entre dos puntos

// Evento para manejar sugerencias
async function handleAutocomplete(event) {
    const input = event.target;
    const query = input.value.trim();
    const suggestionsList = document.getElementById(
        input.id === 'punto-inicial' ? 'sugerencias-inicial' : 'sugerencias-final'
    );

    // Limpiar sugerencias previas
    suggestionsList.innerHTML = '';

    if (query.length > 2) { // Buscar solo si hay más de 2 caracteres
        const apiKey = "1d8fc7e2f6014747b68feb71101c982a";
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const results = await response.json();

            // La propiedad 'features' contiene las ubicaciones sugeridas
            results.features.forEach(location => {
                const { formatted, lat, lon } = location.properties; // Usar propiedades relevantes
                const listItem = document.createElement('li');
                listItem.textContent = formatted;
                listItem.addEventListener('click', () => {
                    // Actualizar el valor del input y definir el marcador
                    input.value = formatted;
                    const latlng = {
                        lat: parseFloat(lat),
                        lng: parseFloat(lon),
                    };
                    setMarker(latlng, input.id === 'punto-inicial' ? 'start' : 'end');
                    suggestionsList.innerHTML = ''; // Limpiar sugerencias
                    map.setView(latlng, 15); // Centrar mapa en ubicación
                });
                suggestionsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al buscar la dirección:', error);
        }
    }
}

// Vincular eventos de autocompletar a los inputs
document.getElementById('punto-inicial').addEventListener('input', handleAutocomplete);
document.getElementById('punto-final').addEventListener('input', handleAutocomplete);

    function traceRouteIndications() {
        // Si ya hay una ruta trazada, eliminarla
        if (routingControl) {
            map.removeControl(routingControl);
        }

        // Crear un nuevo control de enrutamiento
        routingControl = L.Routing.control({
            waypoints: [
                startMarker.getLatLng(), // Coordenadas del punto inicial
                endMarker.getLatLng()   // Coordenadas del punto final
            ],
            routeWhileDragging: true, // Permite modificar la ruta arrastrando
            geocoder: L.Control.Geocoder.nominatim() // Geocodificador de Nominatim
        }).addTo(map);
    }
    // Selecciona el botón de alternar y el contenedor de rutas
    const toggleButton = document.querySelector('.toggle-routing');

    // Agregar evento de clic para alternar el contenedor de rutas
    toggleButton.addEventListener('click', () => {
        const routingContainer = document.querySelector('.leaflet-routing-container');
        routingContainer.classList.toggle('open');

        // Cambiar el texto del botón según el estado
        if (routingContainer.classList.contains('open')) {
            toggleButton.textContent = 'Ocultar Ruta';
        } else {
            toggleButton.textContent = 'Mostrar Ruta';
        }
    });

// Configura Leaflet Routing Machine para agregar la clase necesaria
// Función para trazar una ruta entre dos puntos
function traceRoute() {
    // Si ya hay una ruta trazada, eliminarla
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Crear un nuevo control de enrutamiento
    routingControl = L.Routing.control({
        waypoints: [
            startMarker.getLatLng(), // Coordenadas del punto inicial
            endMarker.getLatLng()    // Coordenadas del punto final
        ],
        routeWhileDragging: true, // Permite modificar la ruta arrastrando
        geocoder: L.Control.Geocoder.nominatim() // Geocodificador de Nominatim
    }).addTo(map);

    // Agregar una clase al contenedor de rutas para personalizar su posición
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
        routingContainer.classList.add('leaflet-bottom');
    }
}        

function verMedidasEnUbicacion(){
    const boton = document.getElementById('consultar-medición');
    const grafica = document.getElementById('gráfica');
    const cancelarBtn = document.getElementById('cancelar-consulta');
    const input = document.getElementById('buscador-airflow');
    input.focus();

    boton.style.display = 'none';
    grafica.style.display = 'flex';
    cancelarBtn.style.display = 'block';

    cancelarBtn.onclick = function () {
        grafica.style.display = 'none';
        cancelarBtn.style.display = 'none';
        boton.style.display = 'block';
    };
}
