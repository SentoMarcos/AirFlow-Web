/**
 * @file form.js
 * @description Este archivo contiene el código JavaScript necesario para registrar un usuario.
 * @requires fetch
 */

/**
 * @function generarContrasenya
 * @description Genera una contraseña aleatoria que cumple con la siguiente expresión regular:
 * /^(?=.*[0-9])(?=.*[!@#$%^&_.])[a-zA-Z0-9!@#$%^&_.]{6,16}$/.
 * La contraseña generada tiene entre 6 y 16 caracteres, incluye al menos un número y un carácter especial.
 * @returns {string} Contraseña generada aleatoriamente.
 * @var {number} longitudMinima - Longitud mínima permitida para la contraseña (6 caracteres).
 * @var {number} longitudMaxima - Longitud máxima permitida para la contraseña (16 caracteres).
 * @var {string} caracteres - Conjunto de caracteres permitidos para la contraseña.
 * @var {string} numeros - Conjunto de caracteres numéricos para garantizar al menos un número.
 * @var {string} especiales - Conjunto de caracteres especiales para garantizar al menos uno.
 * @var {Array<string>} contrasenaBase - Arreglo inicial con un número y un carácter especial asegurados.
 * @example
 * const password = generarContrasena();
 * console.log(password); // Salida: "A3!x2Yp#"
 */

/*
    Function: generarContrasena() => string
*/
function generarContrasenya() {
    const longitudMinima = 6;
    const longitudMaxima = 16;
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
    const contrasenaMezclada = contrasenaBase.sort(() => Math.random() - 0.5).join("");

    return contrasenaMezclada;
}

/**
 * @function registroForm
 * @description Función para registrar un usuario.
 * @param {Event} event
 * @returns {Promise<void>}
 * @var {string} nombre
 * @var {string} apellidos
 * @var {string} email
 * @var {string} telefono
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
    const contrasenya = generarContrasenya();
    console.log(contrasenya); //Muestra contrasenya generada aleatroriamente (esta se debe enviar al correo del usuario)

    // Validar campos correctos
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("errorForm").textContent = "El email no es válido.";
        return;
    }
    if (!/^\d{9}$/.test(telefono)) {
        document.getElementById("errorForm").textContent = "El teléfono debe tener 9 dígitos.";
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
            document.getElementById("errorForm").textContent = data.error;
        } else {
            console.log("Usuario registrado con éxito");
            //window.location.href = 'formValido.html'; // Redirigir a formValido.html
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("errorForm").textContent = "Ocurrió un error al registrar el usuario.";
    });
});