import { expect } from 'chai';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import 'jsdom-global/register';

describe('Formulario de Registro', () => {
    let document;

    beforeEach(() => {
        const dom = new JSDOM(`
      <form id="registroForm">
        <input id="nombre" value="Juan">
        <input id="apellidos" value="Pérez">
        <input id="email" value="juan.perez@example.com">
        <input id="telefono" value="123456789">
        <div id="errorForm"></div>
        <button type="submit">Registrar</button>
      </form>
    `);
        document = dom.window.document;
        global.document = document;
    });

    it('debería generar una contraseña válida', () => {
        const contrasenya = generarContrasenya();
        expect(contrasenya).to.match(/^(?=.*[0-9])(?=.*[!@#$%^&_.])[a-zA-Z0-9!@#$%^&_.]{6,16}$/);
    });

    it('debería mostrar un error si el email no es válido', () => {
        document.getElementById('email').value = 'email_invalido';
        document.getElementById('registroForm').dispatchEvent(new Event('submit'));
        expect(document.getElementById('errorForm').textContent).to.equal('El email no es válido.');
    });

    it('debería mostrar un error si el teléfono no tiene 9 dígitos', () => {
        document.getElementById('telefono').value = '12345';
        document.getElementById('registroForm').dispatchEvent(new Event('submit'));
        expect(document.getElementById('errorForm').textContent).to.equal('El teléfono debe tener 9 dígitos.');
    });

    it('debería registrar un usuario correctamente', (done) => {
        global.fetch = (url, options) => {
            return Promise.resolve({
                json: () => Promise.resolve({ success: true })
            });
        };

        document.getElementById('registroForm').dispatchEvent(new Event('submit'));

        setTimeout(() => {
            expect(document.getElementById('errorForm').textContent).to.equal('');
            done();
        }, 100);
    });
});