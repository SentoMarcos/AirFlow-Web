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
    const contrasenaMezclada = contrasenaBase.sort(() => Math.random() - 0.5).join("");

    return contrasenaMezclada;
}

function formatearTarjeta(input) {
    // Elimina cualquier carácter no numérico
    let valor = input.value.replace(/\D/g, "");

    // Divide el valor en grupos de 4 dígitos y une con guiones
    valor = valor.match(/.{1,4}/g)?.join("-") || "";

    // Actualiza el valor del campo
    input.value = valor;
}

window.addEventListener("DOMContentLoaded", () => {
    const producto = localStorage.getItem("productoNombre") || "Producto A Comprar";
    const rebaja = localStorage.getItem("productoRebaja") || "00.00€";
    const precio = localStorage.getItem("productoPrecio") || "0.00€";

    document.getElementById("productoTitulo").textContent = producto;
    document.getElementById("productoRebaja").textContent = rebaja;
    document.getElementById("productoPrecio").textContent = precio;
});


document.getElementById("pasarelaForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Limpiar el mensaje de error
    const errorText = document.getElementById("errorText");
    errorText.textContent = "";

    const exito = document.getElementById("exito");
    exito.textContent = "";

    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value.trim();
    const postal = document.getElementById("postal").value;
    const tarjeta = document.getElementById("tarjeta").value;
    const fechaCaducidad = document.getElementById("fecha-caducidad").value.trim();
    const CVV = document.getElementById("CVV").value;
    const contrasenya = generarContrasenya();

    const checkboxPersonales = document.getElementById("datos-personales");
    const checkboxPago = document.getElementById("datos-pago");
    const checkboxEnvio = document.getElementById("datos-envio");

    console.log(contrasenya); // Muestra la contraseña generada aleatoriamente (para pruebas).

    // Validar campos obligatorios
    if (!nombre || !apellidos || !email || !telefono || !direccion || !postal || !tarjeta || !fechaCaducidad || !CVV) {
        errorText.textContent = "Por favor, completa todos los campos obligatorios.";
        return; // Detener la ejecución si falta algún campo
    }

    // Validar campos correctos
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorText.textContent = "El email no es válido.";
        return;
    }
    if (!/^\d{9}$/.test(telefono)) {
        errorText.textContent = "El teléfono debe tener 9 dígitos.";
        return;
    }
    if (!/^\d{5}$/.test(postal)) {
        errorText.textContent = "El código postal debe tener 5 dígitos.";
        return;
    }
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(tarjeta)) {
        errorText.textContent = "El número de tarjeta debe tener el formato 1234-1234-1234-1234.";
        return;
    }
    if (!/^\d{3}$/.test(CVV)) {
        errorText.textContent = "El CVV debe tener 3 dígitos.";
        return;
    }

    // Simular envío del formulario
    console.log("Formulario enviado con éxito:");
    console.log({ nombre, apellidos, email, telefono, direccion, postal, tarjeta, fechaCaducidad, CVV });

    const datos = {};

    // Guardamos los datos solo si el checkbox está seleccionado
    if (checkboxPersonales.checked) {
        datos.personales = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value
        };
    }

    if (checkboxEnvio.checked) {
        datos.envio = {
            direccion: document.getElementById("direccion").value,
            postal: document.getElementById("postal").value,
            notas: document.getElementById("notas-entrega").value
        };
    }

    if (checkboxPago.checked) {
        datos.pago = {
            tarjeta: document.getElementById("tarjeta").value,
            caducidad: document.getElementById("fecha-caducidad").value,
            CVV: document.getElementById("CVV").value
        };
    }

    // Si hay datos para guardar, lo hacemos
    if (Object.keys(datos).length > 0) {
        localStorage.setItem("formularioDatos", JSON.stringify(datos));
        console.log("Datos guardados correctamente.");
    }

    const registroData = {
        nombre,
        apellidos,
        email,
        telefono,
        contrasenya,
    };

    try {
        // 1. Realiza el registro del usuario
        const registroResponse = await fetch('http://127.0.0.1:3000/usuarios/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registroData),
        });

        const registroResult = await registroResponse.json();

        if (registroResponse.ok) {
            console.log("Usuario registrado con éxito");

            // 2. Envía el correo al usuario
            const correoResponse = await fetch('http://127.0.0.1:3000/email/enviarCorreo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    contrasenya,
                }),
            });

            exito.textContent = "El usuario se ha registrado con éxito";

            if (correoResponse.ok) {
                alert("Correo enviado correctamente");
            } /*else {
                const correoResult = await correoResponse.json();
                errorText.textContent = correoResult.error || "Error enviando el correo.";
            }*/
        } else {
            errorText.textContent = registroResult.error || "Error en el registro del usuario.";
        }
    } catch (error) {
        console.error("Error:", error);
        errorText.textContent = "Ocurrió un error durante el proceso.";
    }
});
