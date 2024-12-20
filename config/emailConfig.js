const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Cambia esto según tu proveedor
    auth: {
        user: 'airflowtest1234@gmail.com', // Correo que envia
        pass: 'vwus uhmp qajx jjaq', // Usar una contraseña de app o autenticación
    },
});

module.exports = transporter;
