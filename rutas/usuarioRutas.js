/**
 * @file usuarioRutas.js
 * @fileoverview Rutas de usuario
 * @requires express
 * @requires router
 * @requires usuarioControlador
 * @type {e | (() => Express)}
 */

const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

/**
 * Rutas de usuario
 * @GET - Obtener todos los usuarios
 * @POST - Crear un nuevo usuario
 * @POST - Autenticar un usuario
 * @PUT - Editar un usuario
 * @PUT - Eliminar un usuario
 * @module usuarioRutas
 */

// Rutas de usuario
router.get('/', usuarioControlador.getAllUsuarios); // Obtener todos los usuarios
router.post('/registro', usuarioControlador.createUsuario); // Crear un nuevo usuario
router.post('/login', usuarioControlador.loginUsuario); // Autenticar un usuario
router.put('/editUsuario', usuarioControlador.editUsuario); // Editar un usuario
router.put('/editContrasenya', usuarioControlador.editContrasenya); // Editar contraseña
router.get('/mis-sensores', usuarioControlador.getMisSensores); // Obtener todos mis sensores
router.post('/registrar-sensor', usuarioControlador.registrarSensor); // Registrar un sensor a un usuario
router.post('/roles', usuarioControlador.getMisRoles); // Obtener todos mis roles
router.put('/actualizar-sensor', usuarioControlador.actualizarSensor); // Actualizar un sensor

module.exports = router;
