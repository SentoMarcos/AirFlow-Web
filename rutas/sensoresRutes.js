const express = require('express');
const router = express.Router();
const sensorControlador = require('../controladores/sensorControlador');

router.get('/', sensorControlador.getAllSensores); // Obtener todos los usuarios

module.exports = router;

