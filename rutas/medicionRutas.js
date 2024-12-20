/**
 * @file medicionRutas.js
 * @fileoverview Rutas de Mediciones
 * @requires express
 * @requires router
 * @requires medicionControlador
 * @type {e | (() => Express)}
 */

const express = require('express');
const medicionControlador = require('../controladores/medicionControlador');
const { createMedicion, getMedicionesPorSensores, getMedicionesPorFecha} = require('../controladores/medicionControlador');
const router = express.Router();

/**
 * Rutas de Mediciones
 * @POST - Crear una nueva medición
 * @GET - Obtener todas las mediciones
 * @GET - Obtener todas las mediciones de un sensor
 * @module medicionRutas
 */
// Ruta para crear una nueva medición
router.post('/mediciones', createMedicion);
router.post('/mediciones-por-sensor', getMedicionesPorSensores);
router.post('/mediciones-por-fecha', getMedicionesPorFecha);
router.post('/mediciones/add', medicionControlador.createMedicion);
router.get('/mediciones/:id', medicionControlador.getMedicionesOfSensor);
router.get('/mediciones-all', medicionControlador.getAllMediciones);

// Aquí puedes agregar más rutas para Mediciones

module.exports = router;
