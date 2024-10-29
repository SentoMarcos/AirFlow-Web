/**
 * @fileoverview Modelo de la tabla Sensores en la base de datos.
 * @module Sensor
 * @requires sequelize
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} Sensor
 * @description Modelo para la tabla de Sensores en la base de datos.
 *
 * @property {number} id_sensor - Identificador único del sensor, clave primaria y autoincremental.
 * @property {string} estado - Estado actual del sensor.
 * @property {string} num_referencia - Número de referencia del sensor.
 */
const Sensor = sequelize.define('Sensor', {
    id_sensor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    estado: {
        type: DataTypes.TEXT, // Tipo de dato TEXT para el estado
        allowNull: false, // Campo obligatorio
    },
    num_referencia: {
        type: DataTypes.TEXT, // Tipo de dato TEXT para el número de referencia
        allowNull: false, // Campo obligatorio
    },
}, {
    tableName: 'Sensores', // Nombre de la tabla en la base de datos
    timestamps: false, // Cambia a true si deseas agregar createdAt y updatedAt
});

// Exportar el modelo
module.exports = Sensor;
