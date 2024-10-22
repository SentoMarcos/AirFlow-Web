const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos
const Usuario = require('./Usuario'); // Importar el modelo Usuario
const Rol = require('./Roles');         // Importar el modelo Rol

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

// Exportar el modelo
module.exports = UsuarioRol;
