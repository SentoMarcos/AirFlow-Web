const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta si es necesario

const Medicion = sequelize.define('Medicion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false, // Campo obligatorio
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false, // Campo obligatorio
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: false, // Campo obligatorio
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: false, // Campo obligatorio
  },
});

module.exports = Medicion;
