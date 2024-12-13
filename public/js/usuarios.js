//Función que obtiene los usuarios
//-------------------------------------------------
async function obtenerUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios'); // Cambia la ruta según tu configuración de rutas
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
        }
        const users = await response.json();

        // Filtrar solo los campos necesarios
        const filteredUsers = users.map(user => ({
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            telefono: user.telefono
        }));

        mostrarUsuarios(filteredUsers); // Pasar los usuarios filtrados a la función de mostrar

        // Escuchar la búsqueda por email
        const emailSearchInput = document.getElementById('email-search');
        emailSearchInput.addEventListener('input', () => {
            const searchQuery = emailSearchInput.value.toLowerCase();
            const filteredByEmail = filteredUsers.filter(user =>
                user.email.toLowerCase().includes(searchQuery)
            );
            mostrarUsuarios(filteredByEmail);
        });

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

//Función que muestra los usuarios en una tabla
//-----------------------------------------------------
let sortDirection = 'asc'; // Variable para mantener la dirección de la ordenación

function mostrarUsuarios(users) {
    const table = document.createElement('table');
    table.border = '1';

    // Crear la fila de encabezado
    const headerRow = table.insertRow();
    const headers = ['ID', 'Nombre', 'Apellidos', 'Email', 'Teléfono'];
    headers.forEach((headerText, index) => {
        const headerCell = document.createElement('th');
        const icon = document.createElement('i');
        icon.className = 'bi bi-chevron-expand';
        headerCell.textContent = headerText;
        headerCell.addEventListener('click', () => sortTable(index, users)); // Escuchar el clic en el encabezado
        headerCell.style.cursor = 'pointer';
        headerCell.appendChild(icon);
        headerRow.appendChild(headerCell);
    });

    // Crear las filas de datos
    users.forEach(user => {
        const row = table.insertRow();

        // Mostrar solo los campos deseados
        const cells = [
            user.id,          // ID
            user.nombre,      // Nombre
            user.apellidos,   // Apellidos
            user.email,       // Email
            user.telefono     // Teléfono
        ];

        cells.forEach(cellText => {
            const cell = row.insertCell();
            cell.textContent = cellText;
        });
    });

    // Insertar la tabla en el DOM
    const container = document.getElementById('users-container');
    container.innerHTML = ''; // Limpiar cualquier contenido previo
    container.appendChild(table);
}

// Función para ordenar la tabla
function sortTable(index, users) {
    let sortedUsers;

    // Determinar el campo por el cual ordenar
    switch (index) {
        case 0: // ID
            sortedUsers = [...users].sort((a, b) => a.id - b.id);
            break;
        case 1: // Nombre
            sortedUsers = [...users].sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 2: // Apellidos
            sortedUsers = [...users].sort((a, b) => a.apellidos.localeCompare(b.apellidos));
            break;
        case 3: // Email
            sortedUsers = [...users].sort((a, b) => a.email.localeCompare(b.email));
            break;
        case 4: // Teléfono
            sortedUsers = [...users].sort((a, b) => a.telefono.localeCompare(b.telefono));
            break;
        default:
            sortedUsers = users;
    }

    // Si la dirección es descendente, invertir el orden
    if (sortDirection === 'desc') {
        sortedUsers.reverse();
    }

    // Cambiar la dirección para la próxima vez
    sortDirection = (sortDirection === 'asc') ? 'desc' : 'asc';

    // Volver a mostrar la tabla con los usuarios ordenados
    mostrarUsuarios(sortedUsers);
}

// Cargar usuarios cuando la página esté completamente cargada
obtenerUsuarios();
