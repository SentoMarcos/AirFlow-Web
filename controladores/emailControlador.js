const nodemailer = require('nodemailer');

exports.enviarCorreo = async (req, res) => {
    try {
        const { email, contrasenya } = req.body;

        // Validación de parámetros
        if (!email || !contrasenya) {
            return res.status(400).json({ error: 'El correo o la contraseña no están proporcionados' });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail', // O el proveedor que estés utilizando
            auth: {
                user: 'airflowtest1234@gmail.com', // Tu correo de Gmail
                pass: 'vwus uhmp qajx jjaq', // Tu contraseña de aplicación
            },
        });

        const mailOptions = {
            from: 'airflowtest1234@gmail.com',
            to: email,
            subject: 'Registro Exitoso',
            text: `Tu contraseña es: ${contrasenya}`,
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);

        res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ error: 'Error enviando el correo' });
    }
};





