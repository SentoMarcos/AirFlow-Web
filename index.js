const express = require('express');
const cors = require('cors'); 
const { Sequelize, DataTypes } = require('sequelize');

// Crear una instancia de Express
const app = express();
const port = 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configurar Sequelize para conectarse a la base de datos PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

// Definir el modelo de "Usuarios"
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,     // Hace que el campo id sea autoincremental
    primaryKey: true,        // Define id como la clave primaria
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,        // Campo obligatorio
  },
  apellidos: {
    type: DataTypes.STRING,  // Campo opcional
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,        // Campo obligatorio
    unique: true,            // El email debe ser único
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,        // Campo obligatorio
  },
  contrasenya: {
    type: DataTypes.STRING,
    allowNull: false,        // Campo obligatorio
  }
});


// Sincronizar el modelo con la base de datos
sequelize.sync().then(() => {
  console.log("Base de datos y tabla sincronizadas.");
});

// Rutas del servidor

// Ruta para agregar un nuevo usuario
app.post('/usuarios', express.json(), async (req, res) => {
  const { nombre, apellidos, email, telefono, contrasenya } = req.body;
  if (nombre && email && telefono && contrasenya) {
    try {
      const nuevoUsuario = await Usuario.create({ nombre, apellidos, email, telefono, contrasenya });
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el usuario. Verifica los datos.' });
    }
  } else {
    res.status(400).json({ error: 'Faltan parámetros obligatorios' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
