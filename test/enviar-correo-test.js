const assert = require('assert');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const { enviarCorreo } = require('../controladores/emailControlador'); // Ajusta la ruta según sea necesario

describe('enviarCorreo', () => {
    let req, res, transporterStub, sendMailStub;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                contrasenya: 'temporal123'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        transporterStub = {
            sendMail: sinon.stub().resolves({ response: '250 OK' })
        };
        sendMailStub = sinon.stub(nodemailer, 'createTransport').returns(transporterStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debería enviar un correo correctamente', async () => {
        await enviarCorreo(req, res);

        assert(res.status.calledWith(200));
        assert(res.json.calledWith({ message: 'Correo enviado correctamente' }));
        assert(sendMailStub.calledOnce);
        assert(transporterStub.sendMail.calledOnce);
    });

    it('debería devolver un error si faltan parámetros', async () => {
        req.body.email = '';

        await enviarCorreo(req, res);

        assert(res.status.calledWith(400));
        assert(res.json.calledWith({ error: 'El correo o la contraseña no están proporcionados' }));
    });

    it('debería manejar errores al enviar el correo', async () => {
        transporterStub.sendMail.rejects(new Error('Error al enviar'));

        await enviarCorreo(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ error: 'Error enviando el correo' }));
    });
});