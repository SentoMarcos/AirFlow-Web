const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioControlador');

// Rutas de usuario
router.get('/', usuarioController.getAllUsuarios); // Obtener todos los usuarios
router.post('/', usuarioController.createUsuario); // Crear un nuevo usuario

module.exports = router;
