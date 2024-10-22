// index.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Importar configuración de base de datos
const usuarioRoutes = require('./rutas/usuarioRutas'); // Importa las rutas de usuario
const medicionRoutes = require('./rutas/medicionRutas'); // Importa las rutas de mediciones

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Usa las rutas
app.use('/usuarios', usuarioRoutes);
app.use('/', medicionRoutes); 

// Sincronizar la base de datos
sequelize.sync().then(() => {
  console.log("Base de datos y tablas sincronizadas.");
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
