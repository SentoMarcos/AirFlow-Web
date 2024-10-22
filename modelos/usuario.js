const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contrasenya: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Usuario;
