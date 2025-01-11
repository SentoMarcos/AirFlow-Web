/**
 * Genera una contraseña aleatoria.
 * @returns {string} Contraseña generada.
 */
function generarContrasenya() {
    const longitudMinima = 7;
    const longitudMaxima = 15;
    const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&_.";
    const numeros = "0123456789";
    const especiales = "!@#$%^&_.";

    // Garantizar al menos un número y un carácter especial
    const contrasenaBase = [
        numeros[Math.floor(Math.random() * numeros.length)],
        especiales[Math.floor(Math.random() * especiales.length)],
    ];

    // Completar con caracteres aleatorios
    const longitudAleatoria = Math.floor(Math.random() * (longitudMaxima - longitudMinima + 1)) + longitudMinima;
    while (contrasenaBase.length < longitudAleatoria) {
        contrasenaBase.push(caracteres[Math.floor(Math.random() * caracteres.length)]);
    }

    // Mezclar la contraseña
    return contrasenaBase.sort(() => Math.random() - 0.5).join("");
}

// Manejo del evento del formulario
document.getElementById("recuperarForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const errorRecuperar = document.getElementById("errorRecuperar");
    const nuevaContrasenya = generarContrasenya();

    errorRecuperar.textContent = ''; // Limpiar errores previos

    try {
        // 1. Actualizar la contraseña del usuario en el servidor
        const actualizarResponse = await fetch('http://127.0.0.1:3000/usuarios/recuperar-contrasenya', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                nuevaContrasenya,
            }),
        });

        const actualizarResult = await actualizarResponse.json();

        if (actualizarResponse.ok) {
            console.log("Contraseña actualizada con éxito");

            // 2. Enviar el correo con la nueva contraseña
            const correoResponse = await fetch('http://127.0.0.1:3000/email/enviarCorreo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    contrasenya: nuevaContrasenya,
                }),
            });

            if (correoResponse.ok) {
                alert("Se ha enviado un correo con tu nueva contraseña.");
            } else {
                const correoResult = await correoResponse.json();
                errorRecuperar.textContent = correoResult.error || "Error enviando el correo.";
            }
        } else {
            errorRecuperar.textContent = actualizarResult.error || "No se pudo actualizar la contraseña.";
        }
    } catch (error) {
        console.error("Error:", error);
        errorRecuperar.textContent = "Ocurrió un error durante el proceso.";
    }
});
