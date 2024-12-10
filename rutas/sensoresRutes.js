const express = require('express');
const router = express.Router();
const sensorControlador = require('../controladores/sensorControlador');

router.get('/', sensorControlador.getAllSensores); // Obtener todos los usuarios
router.get('/getSensoresUser', sensorControlador.getAllSensoresOfUser); // Obtener todos los sensores de un usuario

module.exports = router;

