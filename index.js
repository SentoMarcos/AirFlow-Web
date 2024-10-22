const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database'); // Importar configuración de base de datos
const usuarioRoutes = require('./rutas/usuarioRutas.js'); // Importa las rutas de usuario
const medicionRoutes = require('./rutas/medicionRutas'); // Importa las rutas de mediciones

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public')); // Sirve los archivos estáticos

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Usa las rutas
app.use('/usuarios', usuarioRutas);
app.use('/', medicionRutas); 

// Sincronizar la base de datos
sequelize.sync().then(() => {
  console.log("Base de datos y tablas sincronizadas.");
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
