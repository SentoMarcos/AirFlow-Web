async function obtenerUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios'); // Cambia la ruta según tu configuración de rutas
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const usuarios = await response.json();
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const tablaUsuarios = document.getElementById('usuarios-table').getElementsByTagName('tbody')[0];
    tablaUsuarios.innerHTML = ''; // Limpiar tabla antes de agregar nuevos usuarios

    usuarios.forEach(usuario => {
        const fila = tablaUsuarios.insertRow();
        fila.insertCell(0).textContent = usuario.id;
        fila.insertCell(1).textContent = usuario.nombre;
        fila.insertCell(2).textContent = usuario.apellidos || 'N/A'; // Muestra 'N/A' si no hay apellidos
        fila.insertCell(3).textContent = usuario.email;
        fila.insertCell(4).textContent = usuario.telefono;
    });
}

// Cargar usuarios cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', obtenerUsuarios);