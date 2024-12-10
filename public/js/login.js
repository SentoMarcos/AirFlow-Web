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
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        document.getElementById("errorLogin").textContent = "Por favor, rellene todos los campos";
        alert("Por favor, rellene todos los campos");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error en la red: ${response.status} ${response.statusText} - ${errorData.message}`);
        }

        const data = await response.json();

        if (data.error) {
            document.getElementById("errorLogin").textContent = data.error;
        } else {
            localStorage.setItem("idUsuario", data.id);
            localStorage.setItem("nombreUsuario", data.nombre);
            localStorage.setItem("apellidosUsuario", data.apellidos);
            localStorage.setItem("emailUsuario", data.email);
            localStorage.setItem("telefonoUsuario", data.telefono);
            const user = data.id;

            const rolesResponse = await fetch('http://127.0.0.1:3000/usuarios/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_usuario: user })
            });

            if (!rolesResponse.ok) {
                const rolesErrorData = await rolesResponse.json();
                throw new Error(`Error en la red: ${rolesResponse.status} ${rolesResponse.statusText} - ${rolesErrorData.message}`);
            }

            const roles = await rolesResponse.json();
            console.log(roles);

            if (roles[0] === 1) {
                window.location.href = 'sensores.html';
            } else if (roles[0] === 2) {
                window.location.href = 'airflow-index.html';
            }

            document.body.classList.remove("loading");

            if (window.init) await window.init();
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("errorLogin").textContent = `Error: ${error.message}`;
        //location.href = '../login.html';
    }
});