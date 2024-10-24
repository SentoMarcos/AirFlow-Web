const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importar la conexión a la base de datos

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
