async function obtenerMisSensores(id) {
    try {
        const response = await fetch('http://localhost:3000/usuarios/mis-sensores'); // Cambia la ruta según tu configuración de rutas
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const sensores = await response.json();
        mostrarMisSensores(sensores);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}
function mostrarMisSensores(sensores) {
    console.log(sensores);
}

// Cargar usuarios cuando la página esté completamente cargada
document.addEventListener('DOMContentLoaded', obtenerUsuarios);