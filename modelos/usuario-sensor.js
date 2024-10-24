const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos
const Usuario = require('./Usuario'); // Importar el modelo Usuario
const Sensor = require('./Sensor');   // Importar el modelo Sensor

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

// Exportar el modelo
module.exports = UsuarioSensor;
