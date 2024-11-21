async function obtenerSensores() {
    try {
        const response = await fetch('http://localhost:3000/sensores'); // Cambia la ruta según tu configuración de rutas
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const sensores = await response.json();
        mostrarMisSensores(sensores);
    } catch (error) {
        console.error('Error al obtener los sensores:', error);
    }
}
function mostrarMisSensores(sensores) {
    const table = document.createElement('table');
    table.border = '1';

    // Crear la fila de encabezado
    const headerRow = table.insertRow();
    const headers = ['ID Sensor', 'Estado', 'Número de Referencia', 'UUID', 'Nombre', 'Conexión', 'Batería'];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    // Crear las filas de datos
    sensores.forEach(sensor => {
        const row = table.insertRow();
        Object.values(sensor).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });
    });

    // Insertar la tabla en el DOM
    const container = document.getElementById('sensores-container');
    container.innerHTML = ''; // Limpiar cualquier contenido previo
    container.appendChild(table);
}

// Cargar sensores cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', obtenerSensores);