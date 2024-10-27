const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

// Rutas de usuario
router.get('/', usuarioControlador.getAllUsuarios); // Obtener todos los usuarios
router.post('/registro', usuarioControlador.createUsuario); // Crear un nuevo usuario
router.post('/login', usuarioControlador.loginUsuario); // Autenticar un usuario
router.put('/editUsuario', usuarioControlador.editUsuario); // Editar un usuario
router.put('/editContrasenya', usuarioControlador.editContrasenya); // Eliminar un usuario

module.exports = router;
