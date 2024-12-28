// Variables globales para los marcadores y la capa de ruta
let startMarker = null;
let endMarker = null;
let routingControl = null;

// Inicializa el mapa con una ubicación inicial genérica
var map = L.map('mapa', {
    zoomControl: false // Deshabilita el control de zoom predeterminado
}).setView([51.505, -0.09], 13);

// Agrega el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define el icono personalizado
var customIcon = L.icon({
    iconUrl: 'img/ubicacion-marker.png', // Reemplaza con la URL de tu icono
    iconSize: [32, 48], // Tamaño del icono en píxeles
    iconAnchor: [16, 32], // Punto de anclaje del icono (centro en la parte inferior)
});

// Añade el control de zoom en un div personalizado
var zoomControl = L.control.zoom({
    position: 'bottomright' // Esto no será visible, pero es necesario
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


// Usa la geolocalización del navegador para obtener tu ubicación
    /*if (navigator.geolocation) {
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
}*/

    // Asegura que el mapa se ajusta correctamente en pantalla completa
    setTimeout(() => {
    map.invalidateSize();
}, 300);

    // Función para realizar la geocodificación usando Nominatim

    // Función para manejar la entrada de texto y mover el marcador

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

// Añade el evento de clic al botón para centrar en la ubicación del usuario
/*function centrarEnMiUbicacion() {
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
}*/

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
