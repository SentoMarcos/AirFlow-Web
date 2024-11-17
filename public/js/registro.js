/**
 * @file registro.js
 * @description Este archivo contiene el código JavaScript necesario para registrar un usuario.
 * @requires fetch
 */

/**
 * @function registroForm
 * @description Función para registrar un usuario.
 * @param {Event} event
 * @returns {Promise<void>}
 * @var {string} nombre
 * @var {string} apellidos
 * @var {string} email
 * @var {string} telefono
 * @var {string} contrasenya
 * @var {Object} registroData
 * @async
 */

/* 
    Event:event => registroForm() => Promise<void>
*/

document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const contrasenya = document.getElementById("contrasenya").value;

    // Validate password
    if (!validatePassword(contrasenya)) {
        document.getElementById("error-message").textContent =
            "La contraseña debe tener entre 6 y 16 caracteres, incluir al menos un número y un carácter especial.";
        return;
    }

    const registroData = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contrasenya: contrasenya
    };

    fetch('http://127.0.0.1:3000/usuarios/registro', {
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
            // Aquí puedes añadir cualquier acción que desees realizar después de un registro exitoso,
            // como mostrar un mensaje, limpiar el formulario, etc.
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("error-message").textContent = "Ocurrió un error al registrar el usuario.";
    });
});
/**
 * @function validatePassword
 * @description Validates the password according to specified criteria.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if valid, false otherwise.
 */

/*
    texto:password => validatePassword() => boolean
*/
function validatePassword(password) {
    const minNumberofChars = 6;
    const maxNumberofChars = 16;
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*_.])[a-zA-Z0-9!@#$%^&*_.]{6,16}$/;

    if (password.length < minNumberofChars || password.length > maxNumberofChars) {
        return false;
    }
    if (!regularExpression.test(password)) {
        return false;
    }
    return true;
}
