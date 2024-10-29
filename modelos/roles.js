/**
 * @fileoverview Modelo de la tabla Roles en la base de datos.
 * @module Rol
 * @requires sequelize
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos
/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} Rol
 * @description Modelo para la tabla de Roles en la base de datos.
 *
 * @property {number} id_rol - Identificador único del rol, clave primaria.
 * @property {string} descripcion - Descripción del rol.
 */
const Rol = sequelize.define('Rol', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Clave primaria
        allowNull: false, // Campo obligatorio
    },
    descripcion: {
        type: DataTypes.TEXT, // Tipo de dato TEXT para la descripción
        allowNull: false, // Campo obligatorio
    },
}, {
    tableName: 'Roles', // Nombre de la tabla en la base de datos
    timestamps: false, // Cambia a true si deseas agregar createdAt y updatedAt
});

// Exportar el modelo
module.exports = Rol;
