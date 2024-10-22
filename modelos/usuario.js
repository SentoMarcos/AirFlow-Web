const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false, // Este campo no puede ser nulo según la nueva definición
    unique: true, // Este campo debe ser único
  },
  telefono: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  },
  contrasenya: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  }
}, {
  tableName: 'Usuarios', // Nombre de la tabla en la base de datos
  timestamps: false, // Cambia a true si quieres agregar createdAt y updatedAt
});

// Exportar el modelo
module.exports = Usuario;
