const express = require('express');
const { enviarCorreo } = require('../controladores/emailControlador');

const router = express.Router();

router.post('/enviarCorreo', enviarCorreo);

module.exports = router;
