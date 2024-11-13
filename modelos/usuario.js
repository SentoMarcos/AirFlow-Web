/**
 * @fileoverview Modelo de la tabla Usuarios en la base de datos.
 * @module Usuario
 * @requires sequelize
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} Usuario
 * @description Modelo para la tabla de Usuarios en la base de datos.
 *
 * @property {number} id - Identificador único del usuario, clave primaria y autoincremental.
 * @property {string} nombre - Nombre del usuario, máximo 255 caracteres.
 * @property {string} [apellidos] - Apellidos del usuario, máximo 255 caracteres. Puede ser nulo.
 * @property {string} email - Correo electrónico del usuario, único y máximo 255 caracteres.
 * @property {string} telefono - Teléfono de contacto del usuario, máximo 255 caracteres.
 * @property {string} contrasenya - Contraseña del usuario, máximo 255 caracteres.
 */
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
  timestamps: true, // Cambia a true si quieres agregar createdAt y updatedAt
});

// Exportar el modelo
module.exports = Usuario;
