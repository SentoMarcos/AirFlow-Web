const express = require('express');
const { createMedicion } = require('../controladores/medicionControlador');
const router = express.Router();

// Ruta para crear una nueva medición
router.post('/mediciones', createMedicion);

// Aquí puedes agregar más rutas para Mediciones

module.exports = router;
