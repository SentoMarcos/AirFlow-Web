document.getElementById("registroForm").addEventListener("submit", function(event){
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const contrasenya = document.getElementById("contrasenya").value;

    const registroData = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contrasenya: contrasenya
    };

    fetch('/usuarios/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registroData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("error-message").textContent = data.error;
            } else {
                console.log("Usuario registrado con éxito");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("error-message").textContent = "Ocurrió un error al registrar el usuario.";
        });
});
