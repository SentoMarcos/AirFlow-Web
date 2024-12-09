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
            html: `
                <p>Estimado(a) Usuario,</p>
                <p>¡Gracias por registrarte en nuestra plataforma! Nos complace informarte que tu cuenta ha sido creada exitosamente.</p>
                <p>A continuación, te proporcionamos tu contraseña temporal. Por favor, asegúrate de cambiarla después de iniciar sesión por primera vez:</p>
                <p><strong>Contraseña: ${contrasenya}</strong></p>
                <p>Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte.</p>
                <br>
                <p>Atentamente,</p>
                <p><strong>El Equipo de Soporte</strong></p>
                <p><a href="mailto:airflowtest1234@gmail.com">airflowtest1234@gmail.com</a></p>`,
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





