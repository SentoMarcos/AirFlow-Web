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
        type: DataTypes.TEXT,
        allowNull: false,
    },
    num_referencia: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    conexion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    bateria: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'Sensores',
    timestamps: false,
});
// Exportar el modelo
module.exports = Sensor;

