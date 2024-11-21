const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const UsuarioSensor = require("../modelos/usuario-sensor");
const Sensor = require("../modelos/sensor");
const UsuarioRol = require("../modelos/usuario-rol");
const Rol = require("../modelos/roles");
/**
 * @module UsuarioController
 */

/**
 * Obtener todos los usuarios.
 * @function getAllUsuarios
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Obtener todos los usuarios
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
 * Crear un nuevo usuario.
 * @function createUsuario
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    const { nombre, apellidos, email, telefono, contrasenya } = req.body;

    // Validación de campos obligatorios
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    if (!email) return res.status(400).json({ error: 'El email es obligatorio' });
    if (!telefono) return res.status(400).json({ error: 'El teléfono es obligatorio' });

    console.log("Datos recibidos:", req.body); // Log para verificar datos recibidos
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contrasenya, 10); // 10 es el número de salt rounds

    try {
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidos,
            email,
            telefono,
            contrasenya: hashedPassword
        });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al crear el usuario:", error.message || error);

        // Captura de errores específicos
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Error de validación: verifica los datos ingresados' });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'El correo ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

/**
 * Autenticar un usuario.
 * @function loginUsuario
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Autenticar un usuario
exports.loginUsuario = async (req, res) => {
    const { email, contrasenya } = req.body;
    if (email && contrasenya) {
        try {
            const usuario = await Usuario.findOne({ where: { email: email, } });
            if (usuario) {
                // Verificar la contraseña encriptada
                const isMatch = await bcrypt.compare(contrasenya, usuario.contrasenya);
                console.log("¿Contraseñas coinciden?", isMatch);
                if (isMatch) {
                    res.status(200).json(usuario); // Devuelve el usuario si la autenticación es exitosa
                } else {
                    res.status(401).json({ error: 'Contraseña incorrecta' }); // Contraseña incorrecta
                }
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' }); // Usuario no encontrado
            }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            res.status(500).json({ error: 'Error al obtener el usuario.' });
        }
    } else {
        res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }
};
/**
 * Editar usuario sin cambiar la contraseña.
 * @function editUsuario
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Editar usuario sin contraseña
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
 * Editar la contraseña del usuario.
 * @function editContrasenya
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Editar cambio de contraseña
exports.editContrasenya = async (req, res) => {
    const { id, contrasenya } = req.body;
    if (id && contrasenya) {
        try {
            const usuario = await Usuario.findOne({ where: { id: id } });
            if (usuario) {
                await Usuario.update({ contrasenya: contrasenya }, { where: { id: id } });
                res.status(200).json({ message: 'Contraseña actualizada correctamente' });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }
    } else {
        res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }
};
// Obtener los sensores de un usuario específico
exports.getMisSensores = async (req, res) => {
    try {
        const { id_usuario } = req.params; // Obtener el ID del usuario de los parámetros de la solicitud

        // Buscar los sensores asociados al usuario
        const sensores = await UsuarioSensor.findAll({
            where: { id_usuario },
            include: [Sensor] // Incluir el modelo Sensor para obtener los detalles de los sensores
        });

        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores del usuario:", error);
        res.status(500).json({ error: 'Error al obtener los sensores del usuario.' });
    }
};

exports.getMisRoles = async (req, res) => {
    try {
        const { id_usuario } = req.body; // Obtener el ID del usuario desde el cuerpo de la solicitud
        console.log('Cuerpo de la solicitud:', req.body);
// Registrar sensor a un usuario
exports.registrarSensor = async (req, res) => {
    const { id_usuario, id_sensor, estado, num_referencia, uuid, nombre, conexion, bateria } = req.body;

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
    // Validación de campos obligatorios
    if (!id_usuario) return res.status(400).json({ error: 'El id_usuario es obligatorio' });
    if (!id_sensor) return res.status(400).json({ error: 'El id_sensor es obligatorio' });

    try {
        // Crear la relación entre usuario y sensor
        const usuarioSensor = await UsuarioSensor.create({
            id_usuario,
            id_sensor
        });

        // Crear el sensor en la tabla Sensor
        const sensor = await Sensor.create({
            id_sensor,
            estado,
            num_referencia,
            uuid,
            nombre,
            conexion,
            bateria
        });

        res.status(201).json({ usuarioSensor, sensor });
    } catch (error) {
        console.error("Error al registrar el sensor al usuario:", error);
        res.status(500).json({ error: 'Error al registrar el sensor al usuario.' });
    }
};