/**
 * Genera una contraseña aleatoria que incluye al menos un número y un carácter especial.
 * @returns {string} Contraseña aleatoria generada.
 */
function generarContrasenya() {
    const longitudMinima = 8;
    const longitudMaxima = 16;
    const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&_.";

    const numeros = "0123456789";
    const especiales = "!@#$%^&_.";

    // Garantizar al menos un número y un carácter especial
    const contrasenaBase = [
        numeros[Math.floor(Math.random() * numeros.length)],
        especiales[Math.floor(Math.random() * especiales.length)]
    ];

    // Completar con caracteres aleatorios
    const longitudAleatoria = Math.floor(Math.random() * (longitudMaxima - longitudMinima + 1)) + longitudMinima;
    while (contrasenaBase.length < longitudAleatoria) {
        contrasenaBase.push(caracteres[Math.floor(Math.random() * caracteres.length)]);
    }

    // Mezclar la contraseña
    return contrasenaBase.sort(() => Math.random() - 0.5).join("");
}

module.exports = generarContrasenya;
