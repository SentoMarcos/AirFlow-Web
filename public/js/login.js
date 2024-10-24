document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault(); // No se lanza vacío
    
    //Obtener Inputs
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Validacion básica de campos
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
    fetch('/usuarios/login', {
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
                // Redirigir o realizar alguna acción en caso de éxito
                // window.location.href = '/dashboard'; // Ejemplo de redirección
                console.log(data);
                console.log("Usuario autenticado con éxito");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("error-message").textContent = "Ocurrió un error al iniciar sesión.";
        });
});