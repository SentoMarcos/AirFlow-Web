/**
 * @file login.js
 * @description Este archivo contiene el código JavaScript necesario para iniciar sesión en la aplicación.
 * @requires fetch
 */

/**
 * @function loginForm
 * @description Función para iniciar sesión.
 * @param {Event} event
 * @returns {Promise<void>}
 * @var {string} username
 * @var {string} password
 * @var {Object} loginData
 * @async
 */

// Event:event => loginForm() => Promise<void>
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // No se lanza vacío
    
    // Obtener Inputs
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación básica de campos
    if (username === "" || password === "") {
        document.getElementById("errorLogin").textContent = "Por favor, rellene todos los campos";
        alert("Por favor, rellene todos los campos");
        return;
    }

    // Crear el cuerpo de la solicitud
    const loginData = {
        email: username,
        contrasenya: password
    };

    // Enviar la solicitud POST al servidor
    fetch('http://127.0.0.1:3000/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error); });
        }
        return response.json();
    })
    .then(async data => {
        if (data.error) {
            document.getElementById("errorLogin").textContent = data.error;
        } else {
            // Guardar los datos del usuario en localStorage
            localStorage.setItem("idUsuario", data.id);
            localStorage.setItem("nombreUsuario", data.nombre);
            localStorage.setItem("apellidosUsuario", data.apellidos);
            localStorage.setItem("emailUsuario", data.email);
            localStorage.setItem("telefonoUsuario", data.telefono);
            const user = data.id;
            try {
                // Realizar la solicitud fetch para obtener los roles del usuario
                const response = await fetch('http://127.0.0.1:3000/usuarios/roles', {
                    method: 'POST', // Cambiar a POST
                    headers: {
                        'Content-Type': 'application/json' // Especificar el tipo de contenido
                    },
                    body: JSON.stringify({id_usuario: user}) // Enviar el ID del usuario en el cuerpo
                });
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                const roles = await response.json();
                console.log(roles);
                if (roles[0]===1){
                    // Redirigir a sensores.html
                    window.location.href = 'sensores.html'; // Redirección a la página de perfil
                }
                else if (roles[0]===2){
                    // Redirigir a airflow-index.html
                    window.location.href = 'airflow-index.html'; // Redirección a la página de perfil
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
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("errorLogin").textContent = error.message;
    });
});
