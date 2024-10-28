document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // No se lanza vacío
    
    // Obtener Inputs
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación básica de campos
    if (username === "" || password === "") {
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
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("error-message").textContent = data.error;
        } else {
            // Guardar los datos del usuario en localStorage
            localStorage.setItem("idUsuario", data.id);
            localStorage.setItem("nombreUsuario", data.nombre);
            localStorage.setItem("apellidosUsuario", data.apellidos);
            localStorage.setItem("emailUsuario", data.email);
            localStorage.setItem("telefonoUsuario", data.telefono);

            // Redirigir a perfil.html
            window.location.href = 'perfil.html'; // Redirección a la página de perfil
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("error-message").textContent = "Ocurrió un error al iniciar sesión.";
    });
});
