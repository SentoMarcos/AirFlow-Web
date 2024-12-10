/**
 * @file medicionRutas.js
 * @fileoverview Rutas de Mediciones
 * @requires express
 * @requires router
 * @requires medicionControlador
 * @type {e | (() => Express)}
 */

const express = require('express');
const { createMedicion, getMedicionesPorSensores, getMedicionesPorFecha} = require('../controladores/medicionControlador');
const router = express.Router();

/**
 * Rutas de Mediciones
 * @POST - Crear una nueva medición
 *
 * @module medicionRutas
 */
// Ruta para crear una nueva medición
router.post('/mediciones', createMedicion);
router.post('/mediciones-por-sensor', getMedicionesPorSensores);
router.post('/mediciones-por-fecha', getMedicionesPorFecha);
// Aquí puedes agregar más rutas para Mediciones

module.exports = router;
