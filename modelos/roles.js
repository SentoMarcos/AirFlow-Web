const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

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
