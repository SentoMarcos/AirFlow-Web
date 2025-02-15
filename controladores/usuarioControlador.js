const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const UsuarioSensor = require("../modelos/usuario-sensor");
const Sensor = require("../modelos/Sensor");
const UsuarioRol = require("../modelos/usuario-rol");
const Rol = require("../modelos/Roles");

/**
 * @module UsuarioController
 */

/**
 * @function getAllUsuarios
 * @description Obtener todos los usuarios.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

// {Object}: req, {Object}: res => getAllUsuarios() => void

    exports.getAllUsuarios = async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).json({ error: 'Error al obtener los usuarios.' });
        }
    };

/**
 * @function createUsuario
 * @description Crear un nuevo usuario.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

// {Object}: req, {Object}: res => createUsuario() => void

    exports.createUsuario = async (req, res) => {
        const { nombre, apellidos, email, telefono, contrasenya } = req.body;

        // Validación de campos obligatorios
        if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
        if (!email) return res.status(400).json({ error: 'El email es obligatorio' });
        if (!telefono) return res.status(400).json({ error: 'El teléfono es obligatorio' });

        try {

            // Verificar si el email ya existe
            const usuarioExistente = await Usuario.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).json({ error: 'El correo ya está registrado' });
            }

            // Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(contrasenya, 10);

            // Crear el usuario
            const nuevoUsuario = await Usuario.create({
                nombre,
                apellidos,
                email,
                telefono,
                contrasenya: hashedPassword,
            });

            // Asignar el rol 2 al usuario en la tabla Usuario-Rol
            await UsuarioRol.create({
                id_usuario: nuevoUsuario.id, // ID del usuario recién creado
                id_rol: 2,                  // Rol 2 (por ejemplo: "Usuario")
            });

            // Respuesta exitosa (sin incluir la contraseña)
            res.status(201).json({
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                apellidos: nuevoUsuario.apellidos,
                email: nuevoUsuario.email,
                telefono: nuevoUsuario.telefono,
            });
        } catch (error) {
            console.error("Error al crear el usuario:", error.message || error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: 'Error de validación: verifica los datos ingresados' });
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'El correo ya está registrado' });
            } else {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    };

/**
 * @function loginUsuario
 * @description Autenticar un usuario.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

// {Object}: req, {Object}: res => loginUsuario() => void

exports.loginUsuario = async (req, res) => {
    const { email, contrasenya } = req.body;

    // Validar que los parámetros requeridos estén presentes
    if (!email || !contrasenya) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios' });
    }

    try {
        // Buscar al usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contrasenya, usuario.contrasenya);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Excluir información sensible
        const { contrasenya: _, ...usuarioSeguro } = usuario.toJSON();

        // Responder con los datos del usuario autenticado
        return res.status(200).json(usuarioSeguro);
    } catch (error) {
        console.error('Error al autenticar usuario:', error);

        // Manejo genérico de errores
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/**
 * @function editUsuario
 * @description Editar un usuario sin cambiar la contraseña.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

//  {Object}: req, {Object}: res => editUsuario() => void

    exports.editUsuario = async (req, res) => {
        const { id, nombre, apellidos, email, telefono } = req.body;
        if (id && nombre && email && telefono) {
            try {
                const usuario = await Usuario.findOne({ where: { id: id } });
                if (usuario) {
                    await Usuario.update({ nombre, apellidos, email, telefono }, { where: { id: id } });
                    res.status(200).json({ message: 'Usuario actualizado correctamente' });
                } else {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                }
            } catch (error) {
                console.error("Error al actualizar el usuario:", error);
                res.status(500).json({ error: 'Error al actualizar el usuario.' });
            }
        } else {
            res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }
    };

/**
 * @function editContrasenya
 * @description Editar la contraseña del usuario.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

// {Object}: req, {Object}: res => editContrasenya() => void

    exports.editContrasenya = async (req, res) => {
        const { id, password, newPassword } = req.body;
        console.log("Datos recibidos:", req.body);
        //Comprobar parámetros obligatorios
        if (!id || !password || !newPassword) {
            console.error("Faltan parámetros obligatorios");
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        try {
            // Buscar el usuario por ID
            const user = await Usuario.findOne({ where: { id: id } });
            if (!user) {
                console.error("Usuario no encontrado");
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Verificar la contraseña actual
            const isMatch = await bcrypt.compare(password, user.contrasenya);
            console.log("¿Contraseñas coinciden?", isMatch);

            if (!isMatch) {
                console.error("Contraseña incorrecta");
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Encriptar y actualizar la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 es el número de salt rounds
            await Usuario.update({ contrasenya: hashedPassword }, { where: { id: id } });

            console.log("Contraseña actualizada correctamente");
            res.status(200).json({ message: 'Contraseña actualizada correctamente' });

        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }
    };

    /**
 * @function recuperarContrasenya
 * @description Generar y actualizar una nueva contraseña para el usuario y enviarla por correo.
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

// {Object}: req, {Object}: res => recuperarContrasenya() => void

exports.recuperarContrasenya = async (req, res) => {
    const { email, nuevaContrasenya } = req.body;
    console.log("Datos recibidos:", req.body);

    // Comprobar parámetros obligatorios
    if (!email || !nuevaContrasenya) {
        console.error("Faltan parámetros obligatorios");
        return res.status(400).json({ error: 'Email y nueva contraseña son obligatorios.' });
    }

    try {
        // Buscar el usuario por correo electrónico
        const usuario = await Usuario.findOne({ where: { email: email } });
        if (!usuario) {
            console.error("Usuario no encontrado");
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasenya, 10); // 10 es el número de salt rounds
        console.log("Nueva contraseña encriptada:", hashedPassword);

        // Actualizar la contraseña en la base de datos
        await Usuario.update({ contrasenya: hashedPassword }, { where: { email: email } });

        console.log("Contraseña actualizada correctamente");
        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });

    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


/**
 * @function getMisSensores
 * @description Obtener los sensores de un usuario específico
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

//  {Object}: req, {Object}: res => getMisSensores() => void 

// controladores/usuarioControlador.js
exports.getMisSensores = async (req, res) => {
    try {
        const { id_usuario } = req.query; // Obtener el ID del usuario de los parámetros de la solicitud

        // Buscar los sensores asociados al usuario
        const sensores = await UsuarioSensor.findAll({
            where: { id_usuario },
            include: [{
                model: Sensor,
                attributes: ['id_sensor','estado', 'num_referencia', 'uuid', 'nombre', 'conexion', 'bateria'] // Asegurarse de incluir todos los campos necesarios
            }]
        });


        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores del usuario:", error);
        res.status(500).json({ error: 'Error al obtener los sensores del usuario.' });
    }
};

/**
* @function getMisRoles
* @description Obtener los roles de un usuario específico
* @async
* @param {Object} req - Objeto de solicitud de Express.
* @param {Object} res - Objeto de respuesta de Express.
*/

//  {Object}: req, {Object}: res => getMisRoles() => void 

    exports.getMisRoles = async (req, res) => {
        try {
            const { id_usuario } = req.body; // Obtener el ID del usuario desde el cuerpo de la solicitud
            console.log('Cuerpo de la solicitud:', req.body);

            if (!id_usuario) {
                return res.status(400).json({ error: 'ID de usuario no proporcionado' });
            }

            const usuarioRoles = await UsuarioRol.findAll({
                where: { id_usuario },
                include: [Rol] // Incluir el modelo Rol para obtener los detalles de los roles
            });
            console.log(usuarioRoles)
            const roles = usuarioRoles.map(ur => ur.id_rol); // Obtener los IDs de los roles
            res.status(200).json(roles);
        } catch (error) {
            console.error('Error al obtener los roles del usuario:', error);
            res.status(500).json({ error: 'Error al obtener los roles del usuario.' });
        }
    };

/**
* @function regirtrarSensor
* @description Registrar un sensor a un usuario
* @async
* @param {Object} req - Objeto de solicitud de Express.
* @param {Object} res - Objeto de respuesta de Express.
*/

//  {Object}: req, {Object}: res => getMisRoles() => void
// Update the registrarSensor function in `controladores/usuarioControlador.js`
exports.registrarSensor = async (req, res) => {
    let { id_usuario, estado, num_referencia, uuid, nombre, conexion, bateria } = req.body;

    // Validación de campos obligatorios
    if (!id_usuario) return res.status(400).json({ error: 'El id_usuario es obligatorio' });

    // Eliminar espacios en blanco de la uuid
    uuid = uuid.replace(/\s+/g, '');

    try {
        // Crear el sensor en la tabla Sensor
        const sensor = await Sensor.create({
            estado,
            num_referencia,
            uuid,
            nombre,
            conexion,
            bateria
        });

        // Crear la relación entre usuario y sensor
        const usuarioSensor = await UsuarioSensor.create({
            id_usuario,
            id_sensor: sensor.id_sensor
        });

        res.status(201).json({ usuarioSensor, sensor });
    } catch (error) {
        console.error("Error al registrar el sensor al usuario:", error);
        res.status(500).json({ error: 'Error al registrar el sensor al usuario.' });
    }
};
exports.actualizarSensor = async (req, res) => {
    const { id_sensor, estado, conexion, bateria } = req.body;

    if (!id_sensor) return res.status(400).json({ error: 'El id_sensor es obligatorio' });

    try {
        const sensor = await Sensor.findOne({ where: { id_sensor: id_sensor } });
        if (sensor) {
            await Sensor.update({ estado, conexion, bateria }, { where: { id_sensor: id_sensor } });
            res.status(200).json({ message: 'Sensor actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Sensor no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el sensor:", error);
        res.status(500).json({ error: 'Error al actualizar el sensor.' });
    }
}