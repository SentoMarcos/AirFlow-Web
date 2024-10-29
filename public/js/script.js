/**
 * @file script.js
 * @description Este archivo contiene el código JavaScript necesario para obtener y mostrar los usuarios en la tabla.
 * @requires fetch
 */

/**
 * @function obtenerUsuarios
 * @description Función para obtener los usuarios desde la API y mostrarlos en la tabla.
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * @function mostrarUsuarios
 * @description Función para mostrar los usuarios en la tabla.
 * @param usuarios
 */
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