/**
 * @fileoverview Modelo de la tabla Usuario-Rol en la base de datos.
 * @module UsuarioRol
 * @requires sequelize
 * @requires Usuario
 * @requires Rol
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos
const Usuario = require('./Usuario'); // Importar el modelo Usuario
const Rol = require('./Roles');         // Importar el modelo Rol

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} UsuarioRol
 * @description Modelo para la tabla de unión entre Usuario y Rol en la base de datos.
 *
 * @property {number} id_usuario - Llave foránea que referencia al usuario.
 * @property {number} id_rol - Llave foránea que referencia al rol.
 */

const UsuarioRol = sequelize.define('UsuarioRol', {
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
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false, // Campo obligatorio
        references: {
            model: Rol,      // Se refiere al modelo Rol
            key: 'id_rol',   // Llave primaria de la tabla Roles
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
    }
}, {
    tableName: 'Usuario-Rol', // Nombre de la tabla en la base de datos
    timestamps: false, // Cambia a true si deseas agregar createdAt y updatedAt
});

UsuarioRol.belongsTo(Rol, { foreignKey: 'id_rol' });

UsuarioRol.afterSync(async () => {
    const rolesExistentes = await Rol.count(); // Verificar si ya hay datos
    const usuarios = await Usuario.count(); // Verificar si ya hay datos
    if (rolesExistentes !== 0 && usuarios !== 0) {
        await UsuarioRol.bulkCreate([
            { id_rol: 1, id_usuario: 1 },
        ]);
        console.log('Datos iniciales de roles insertados.');
    }
});

// Exportar el modelo
module.exports = UsuarioRol;
