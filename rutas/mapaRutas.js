const express = require('express');
const router = express.Router();
const mapaController = require('../controladores/mapaControlador');

// Ruta para obtener la configuración del mapa
router.get('/mapa-config', mapaController.getMapaConfig);
router.get('/getMapaHtml', mapaController.getMapaHtml);

module.exports = router;
