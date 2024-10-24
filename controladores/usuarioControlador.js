// File: controladores/usuarioControlador.js

const Usuario = require('../modelos/usuario');

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

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    const { nombre, apellidos, email, telefono, contrasenya } = req.body;
    if (nombre && email && telefono && contrasenya) {
        try {
            const nuevoUsuario = await Usuario.create({ nombre, apellidos, email, telefono, contrasenya: contrasenya });
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(400).json({ error: 'Error al crear el usuario. Verifica los datos.' });
        }
    } else {
        res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }
};

// Autenticar un usuario
exports.loginUsuario = async (req, res) => {
    const { email, contrasenya } = req.body;
    if (email && contrasenya) {
        try {
            const usuario = await Usuario.findOne({ where: { email: email, } });
            if (usuario) {
                if (usuario.contrasenya === contrasenya) {
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