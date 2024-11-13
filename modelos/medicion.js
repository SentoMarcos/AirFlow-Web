/**
 * @fileoverview Modelo de la tabla Mediciones en la base de datos.
 * @module Medicion
 * @requires sequelize
 * @requires Sensores
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta si es necesario
const Sensores = require('./sensor'); // Asegúrate de tener el modelo Sensores

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} Medicion
 * @description Modelo para la tabla de Mediciones en la base de datos.
 *
 * @property {number} id - Identificador único de la medición, clave primaria y autoincremental.
 * @property {number} id_sensor - Identificador del sensor asociado, clave foránea que referencia a Sensores.
 * @property {string} tipo_gas - Tipo de gas medido.
 * @property {number} latitud - Latitud de la ubicación de la medición.
 * @property {number} longitud - Longitud de la ubicación de la medición.
 * @property {Date} fecha - Fecha de la medición.
 * @property {number} valor - Valor de la medición.
 */
const Medicion = sequelize.define('Medicion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  id_sensor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sensores, // Se refiere al modelo Sensores
      key: 'id_sensor' // Clave de la tabla Sensores
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION'
  },
  tipo_gas: {
    type: DataTypes.TEXT, // Se utiliza TEXT para el tipo de gas
    allowNull: false,
  },
  latitud: {
    type: DataTypes.DOUBLE, // Se utiliza DOUBLE para latitud
    allowNull: false,
  },
  longitud: {
    type: DataTypes.DOUBLE, // Se utiliza DOUBLE para longitud
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE, // Se utiliza DATE para la fecha
    allowNull: false,
    // Puedes usar `type: DataTypes.DATEWITHTIMEZONE` si necesitas manejar zonas horarias
  },
  valor: {
    type: DataTypes.DOUBLE, // Se utiliza DOUBLE para valor
    allowNull: false,
  },
}, {
  tableName: 'Mediciones', // Nombre de la tabla en la base de datos
  timestamps: false, // Cambia a true si quieres agregar createdAt y updatedAt
});

// Definición de relaciones
Medicion.belongsTo(Sensores, {
  foreignKey: 'id_sensor',
  targetKey: 'id_sensor',
  constraints: false,
});

module.exports = Medicion;
