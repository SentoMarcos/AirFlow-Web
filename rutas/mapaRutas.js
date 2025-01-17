const express = require('express');
const router = express.Router();
const mapaController = require('../controladores/mapaControlador');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Ruta para obtener la configuración del mapa
router.get('/mapa-config', mapaController.getMapaConfig);
router.get('/getMapaHtml', mapaController.getMapaHtml);

module.exports=router;