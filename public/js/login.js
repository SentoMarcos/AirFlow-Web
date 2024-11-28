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
        .then(data => {
            if (data.error) {
                document.getElementById("errorLogin").textContent = data.error;
            } else {
                // Guardar los datos del usuario en localStorage
                localStorage.setItem("idUsuario", data.id);
                localStorage.setItem("nombreUsuario", data.nombre);
                localStorage.setItem("apellidosUsuario", data.apellidos);
                localStorage.setItem("emailUsuario", data.email);
                localStorage.setItem("telefonoUsuario", data.telefono);

                // Redirigir a airflow-index.html
                window.location.href = 'airflow-index.html'; // Redirección a la página de perfil
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("errorLogin").textContent = error.message;
        });
    });
