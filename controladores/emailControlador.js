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
            from: 'noreply@retrofit.com',
            to: email,
            subject: '¡Bienvenido a RetroFit!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <table style="width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="background-color: #52CCD7FF; padding: 15px; text-align: center; color: #fff; font-size: 24px; font-weight: bold; border-radius: 10px 10px 0 0;">
        <img src="https://drive.google.com/uc?id=1jo-bgg_vCYvRRXYg60yltveJHlf2ljPM" alt="Logo" style="height: 50px; vertical-align: middle; margin-right: 10px;">
        Bienvenido a RetroFit
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 18px; font-weight: bold; color: #555;">Estimado(a) Usuario,</p>
        <p>¡Gracias por registrarte en nuestra plataforma! Nos complace informarte que tu cuenta ha sido creada exitosamente.</p>
        <p>A continuación, te proporcionamos tu contraseña temporal. Por favor, asegúrate de cambiarla después de iniciar sesión por primera vez:</p>
        <p style="font-size: 16px; background-color: #f9f9f9; padding: 10px; border: 1px solid #52CCD7FF; border-radius: 5px; text-align: center;">
          <strong>Contraseña: ${contrasenya}</strong>
        </p>
        <p>Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #555; font-size: 14px;">
        <p>Atentamente,</p>
        <p style="font-size: 16px; font-weight: bold;">El Equipo de Soporte</p>
        <p>
          <a href="mailto:retrofit@gmail.com" style="color: #9F52D7; text-decoration: none;">airflowtest1234@gmail.com</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #999;">
        <p>© 2024 RetroFit. Todos los derechos reservados.</p>
        <p>
          <a href="../public/index.html" style="color: #9F52D7; text-decoration: none;">Visítanos</a>
          |
          <a href="../public/terminos.html" style="color: #9F52D7; text-decoration: none;">Términos y Condiciones</a>
        </p>
      </td>
    </tr>
  </table>
</div>`,
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





