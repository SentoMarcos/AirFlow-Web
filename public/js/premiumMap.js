// Variables globales para los marcadores y la capa de ruta
let startMarker = null;
let endMarker = null;
let routingControl = null;

    // Vincular el evento "keypress" para ambos inputs
    document.getElementById('punto-inicial').addEventListener('keypress', handleInputSearch);
    document.getElementById('punto-final').addEventListener('keypress', handleInputSearch);

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

    // Función para trazar una ruta entre dos puntos
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
        const routingContainer = document.querySelector('.leaflet-bottom.leaflet-routing-container');
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

    boton.style.display = 'none';
    grafica.style.display = 'flex';
    cancelarBtn.style.display = 'block';

    cancelarBtn.onclick = function () {
        grafica.style.display = 'none';
        cancelarBtn.style.display = 'none';
        boton.style.display = 'block';
    };
}
