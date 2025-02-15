// Crear un nuevo script de manera dinámica
/*const script = document.createElement('script');
script.src = 'freeMap.js';  // Establecer la ruta del archivo JS
document.head.appendChild(script);  // Agregarlo al documento*/


// Variables globales para los marcadores y la capa de ruta
let startMarker = null;
let endMarker = null;
let routingControl = null;
const inicial = document.getElementById('punto-inicial');
const final = document.getElementById('punto-final');
const capasMapa = document.getElementById('capas-mapa');

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
if(inicial && final){
// Vincular eventos de autocompletar a los inputs
document.getElementById('punto-inicial').addEventListener('input', handleAutocomplete);
document.getElementById('punto-final').addEventListener('input', handleAutocomplete);
}

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

function togglePanelPersonalizar() {
    const panel = document.getElementById('panel-contenedor');
    // Cambia entre mostrar y ocultar el panel
    if (panel.style.bottom === '-41.2vh') {
        panel.style.bottom = '10px'; // Mostrar el panel
    } else {
        panel.style.bottom = '-41.2vh'; // Ocultar el panel
    }

    const estacionescheck = document.getElementById('check-estaciones');
    estacionescheck.addEventListener('change', () => {
        const aemet = document.getElementsByClassName('aemet');
        const gva = document.getElementsByClassName('gva');

        // Función para mostrar/ocultar estaciones
        const toggleVisibility = (elements, show) => {
            for (const el of elements) {
                el.style.display = show ? 'block' : 'none';
            }
        };

        toggleVisibility(aemet, estacionescheck.checked);
        toggleVisibility(gva, estacionescheck.checked);
    });
}


async function obtenerMedicionesPorIntervalo() {
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaFinInput = document.getElementById('fecha-fin');

    // Verificar que las fechas no estén vacías
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    if (!fechaInicio || !fechaFin) {
        alert("Por favor selecciona ambas fechas.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/mediciones/mediciones-por-intervalo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fechaInicio,
                fechaFin
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error desconocido al obtener mediciones.");
        }

        const mediciones = await response.json();


        console.log("Mediciones obtenidas:", mediciones);

        // Aquí puedes usar los datos obtenidos para renderizarlos en el mapa
        actualizarMapaConMediciones(mediciones);

    } catch (error) {
        console.error("Error al obtener mediciones:", error);
        alert(`Error: ${error.message}`);
    }
}

function actualizarMapaConMediciones(mediciones) {
    if (typeof map === 'undefined' || !map) {
        console.error("El mapa no está inicializado.");
        return;
    }

    // Array para almacenar los datos para el mapa de calor
    const datosHeatmap = [];

    mediciones.forEach(medicion => {
        // Crear marcador en el mapa
        const marker = L.marker([medicion.latitud, medicion.longitud], {
            id: `medicion-${medicion.id}`,
            icon: L.divIcon({
                className: 'medicion',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
                html: `<div class="custom-marker-icon"></div>`
            })
        })
            .addTo(map)
            .bindPopup(`
            <strong>Sensor:</strong> ${medicion.id_sensor}<br>
            <strong>Gas:</strong> ${medicion.tipo_gas}<br>
            <strong>Valor:</strong> ${medicion.valor}<br>
            <strong>Fecha:</strong> ${medicion.fecha}
        `);

        // Agregar datos al array de mapa de calor
        datosHeatmap.push([medicion.latitud, medicion.longitud, medicion.valor]);
    });

    // Llamar a la función para agregar el mapa de calor con los datos de mediciones
    agregarMapaDeCalor(datosHeatmap, capasGases.interpolatedLayerGroup);
}
function agregarMapaDeCalor(datos, layerGroup) {
    if (!datos || datos.length === 0) {
        console.warn("No hay datos para el mapa interpolado.");
        return;
    }
    // Limpia la capa existente antes de añadir nuevos datos
    // Verifica si ya existe una capa IDW dentro del grupo
    const existingIDWLayer = Array.from(layerGroup.getLayers()).find(layer => layer instanceof L.IdwLayer);

    // Si existe, elimínalo del grupo
    if (existingIDWLayer) {
        layerGroup.removeLayer(existingIDWLayer);
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


function obtenerColorPorIntensidad(intensidad) {
    // Define el gradiente de colores
    const colores = {
        0: '#63B8D9',  // Azul más intenso
        0.2: '#8FE1B0',  // Verde más intenso
        0.4: '#F0F67B',  // Amarillo más intenso
        0.6: '#F69C4E',  // Naranja más intenso
        0.8: '#F78A7D',  // Rojo pastel más intenso
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



//-----------------------------------------------------
//-----------------------Capas-------------------------
//-----------------------------------------------------
// Crear las capas base con proveedores de mapas
// Crear las capas base
const capasEstilo = {
    "Callejero": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),

    "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/en-us/arcgis/products/arcgis-online/overview">Esri</a> contributors'
    }),

    "Claro": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
    }),

    "Topográfico": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),

    "Minimalista": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
    })
};

// Función para cambiar la capa base sin eliminar marcadores ni mapa de calor
if(capasMapa) {
    capasMapa.addEventListener('change', function (event) {
        // Obtener la capa base seleccionada
        const selectedLayer = event.target.value;

        // Eliminar solo las capas base
        Object.values(capasEstilo).forEach((capa) => map.hasLayer(capa) && map.removeLayer(capa));

        // Agregar la nueva capa base
        capasEstilo[selectedLayer].addTo(map);
    });
}




