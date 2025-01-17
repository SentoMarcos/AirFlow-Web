const express = require('express');
const router = express.Router();
const sensorControlador = require('../controladores/sensorControlador');

router.get('/', sensorControlador.getAllSensores); // Obtener todos los usuarios
router.get('/getSensoresUser/:id', sensorControlador.getAllSensoresOfUser); // Obtener todos los sensores de un usuario
router.put('/changeNameSensor', sensorControlador.changeNameSensor); // Cambiar el nombre de un sensor

module.exports = router;

