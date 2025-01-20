/**
 * @file usuario-sensor.js
 * @brief Modelo de la tabla Usuario-Sensor en la base de datos.
 * @requires sequelize
 * @requires Usuario
 * @requires Sensor
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos
const Usuario = require('./Usuario'); // Importar el modelo Usuario
const Sensor = require('./Sensor');   // Importar el modelo Sensor

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} UsuarioSensor
 * @description Modelo para la tabla de unión entre Usuario y Sensor en la base de datos.
 *
 * @property {number} id_usuario - Llave foránea que referencia al usuario.
 * @property {number} id_sensor - Llave foránea que referencia al sensor.
 */

const UsuarioSensor = sequelize.define('UsuarioSensor', {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false, // Campo obligatorio
        references: {
            model: Usuario,  // Se refiere al modelo Usuario
            key: 'id',       // Llave primaria de la tabla Usuarios
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
    },
    id_sensor: {
        type: DataTypes.INTEGER,
        allowNull: false, // Campo obligatorio
        references: {
            model: Sensor,   // Se refiere al modelo Sensor
            key: 'id_sensor' // Llave primaria de la tabla Sensores
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
    }
}, {
    tableName: 'Usuario-Sensor', // Nombre de la tabla en la base de datos
    timestamps: false, // Cambia a true si deseas agregar createdAt y updatedAt
});

// Definir asociaciones entre los modelos
Usuario.belongsToMany(Sensor, {
    through: UsuarioSensor,
    foreignKey: 'id_usuario',
    otherKey: 'id_sensor',
});

Sensor.belongsToMany(Usuario, {
    through: UsuarioSensor,
    foreignKey: 'id_sensor',
    otherKey: 'id_usuario',
});

// Asociaciones adicionales en UsuarioSensor
UsuarioSensor.belongsTo(Sensor, {
    foreignKey: 'id_sensor',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
});

UsuarioSensor.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
});

// Exportar el modelo
module.exports = UsuarioSensor;