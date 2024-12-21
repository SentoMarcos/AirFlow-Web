//Función que obtiene los sensores
//-------------------------------------------------
//------obtenerSensores()--------------------------
// Función que obtiene los sensores
//-------------------------------------------------
async function obtenerSensores() {
    try {
        const response = await fetch('http://localhost:3000/sensores'); // Cambia la ruta según tu configuración de rutas
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
        }
        const sensores = await response.json();

        // Filtrar solo los campos necesarios
        const filteredSensores = sensores.map(sensor => ({
            idSensor: sensor.id_sensor,
            estado: sensor.estado,
            numeroReferencia: sensor.num_referencia,
            uuid: sensor.uuid,
            nombre: sensor.nombre,
            conexion: sensor.conexion,
            bateria: sensor.bateria
        }));

        mostrarMisSensores(filteredSensores); // Pasar los sensores filtrados a la función de mostrar

        // Escuchar la búsqueda por UUID
        const uuidSearchInput = document.getElementById('sensor-search');
        uuidSearchInput.addEventListener('input', () => {
            const searchQuery = uuidSearchInput.value.toLowerCase();
            const filteredByUuid = filteredSensores.filter(sensor =>
                sensor.uuid.toLowerCase().includes(searchQuery)
            );
            mostrarMisSensores(filteredByUuid);
        });

    } catch (error) {
        console.error('Error al obtener los sensores:', error);
    }
}

// Función que muestra los sensores en una tabla
//-----------------------------------------------------
let sortDirection1 = 'asc'; // Variable para mantener la dirección de la ordenación

function mostrarMisSensores(sensores) {
    const table = document.createElement('table');
    table.border = '1';

    // Crear la fila de encabezado
    const headerRow = table.insertRow();
    const headers = ['ID Sensor', 'Estado', 'Número de Referencia', 'UUID', 'Nombre', 'Conexión', 'Batería'];
    headers.forEach((headerText, index) => {
        const headerCell = document.createElement('th');
        const icon = document.createElement('i');
        icon.className = 'bi bi-chevron-expand';
        headerCell.textContent = headerText;
        headerCell.addEventListener('click', () => sortSensoresTable(index, sensores)); // Escuchar el clic en el encabezado
        headerCell.style.cursor = 'pointer';
        headerCell.appendChild(icon);
        headerRow.appendChild(headerCell);
    });

    // Crear las filas de datos
    sensores.forEach(sensor => {
        const row = table.insertRow();

        // Mostrar solo los campos deseados
        const cells = [
            sensor.idSensor,        // ID Sensor
            sensor.estado,          // Estado
            sensor.numeroReferencia, // Número de Referencia
            sensor.uuid,            // UUID
            sensor.nombre,          // Nombre
            sensor.conexion,        // Conexión
            sensor.bateria          // Batería
        ];

        cells.forEach(cellText => {
            const cell = row.insertCell();
            cell.textContent = cellText;
        });
    });

    // Insertar la tabla en el DOM
    const container = document.getElementById('sensores-container');
    container.innerHTML = ''; // Limpiar cualquier contenido previo
    container.appendChild(table);
}
// Función para ordenar la tabla
function sortSensoresTable(index, sensores) {
    let sortedSensores;

    // Determinar el campo por el cual ordenar
    switch (index) {
        case 0: // ID Sensor
            sortedSensores = [...sensores].sort((a, b) => a.idSensor - b.idSensor);
            break;
        case 1: // Estado
            sortedSensores = [...sensores].sort((a, b) => a.estado.localeCompare(b.estado));
            break;
        case 2: // Número de Referencia
            sortedSensores = [...sensores].sort((a, b) => a.numeroReferencia.localeCompare(b.numeroReferencia));
            break;
        case 3: // UUID
            sortedSensores = [...sensores].sort((a, b) => a.uuid.localeCompare(b.uuid));
            break;
        case 4: // Nombre
            sortedSensores = [...sensores].sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 5: // Conexión
            sortedSensores = [...sensores].sort((a, b) => a.conexion.localeCompare(b.conexion));
            break;
        case 6: // Batería
            sortedSensores = [...sensores].sort((a, b) => a.bateria - b.bateria);
            break;
        default:
            sortedSensores = sensores;
    }

    // Si la dirección es descendente, invertir el orden
    if (sortDirection1 === 'desc') {
        sortedSensores.reverse();
    }

    // Cambiar la dirección para la próxima vez
    sortDirection1 = (sortDirection1 === 'asc') ? 'desc' : 'asc';

    // Volver a mostrar la tabla con los sensores ordenados
    mostrarMisSensores(sortedSensores);
}
// Cargar sensores cuando la página esté completamente cargada
obtenerSensores();