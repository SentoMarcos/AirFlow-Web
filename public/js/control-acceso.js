// Control de acceso por rol a páginas
//-----------------------------------------------------
//---id_usuario:N--->control-acceso()------------------
(async (script) => {
    const user = localStorage.getItem('idUsuario');

    if (!user) {
        location.href = '../login.html';
        return;
    }

    try {
        // Realizar la solicitud fetch para obtener los roles del usuario
        const response = await fetch('http://127.0.0.1:3000/usuarios/roles', {
            method: 'POST', // Cambiar a POST
            headers: {
                'Content-Type': 'application/json' // Especificar el tipo de contenido
            },
            body: JSON.stringify({ id_usuario: user }) // Enviar el ID del usuario en el cuerpo
        });
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const roles = await response.json();
        console.log(roles);
        if (script.dataset && script.dataset.rolesRestringidos) {
            const rolesRestringidos = script.dataset.rolesRestringidos.split(',').map(Number);
            if (roles.some(rol => rolesRestringidos.includes(rol))) {
                //alert('Permisos insuficientes para acceder a la página');
                location.href = '../login.html';
                return;
            }
        }

        // Actualizar el nombre del usuario si es necesario
        // document.getElementById('user-name').innerText = data.Usuario;
        document.body.classList.remove("loading");

        // Comprobar si existe una función init y si es así, ejecutarla
        if (window.init) await window.init();
    } catch (error) {
        console.error('Error al obtener los roles del usuario:', error);
        location.href = '../login.html'; // Redirigir en caso de error
    }
})(document.currentScript);
// Control de acceso por rol a páginas
//-----------------------------------------------------
//---------------------logOut()------------------------
function logOut(){
    localStorage.clear();  //borra el almacenamiento local
    location.href = '../login.html';  //redirige a login
}
