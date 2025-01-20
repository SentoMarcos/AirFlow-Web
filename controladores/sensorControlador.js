// Obtener todos los usuarios
//-----------------------------------------------------
//--getAllSensores()-->Código:numero,sensores:json
const Sensor = require("../modelos/sensor");
const Medicion = require("../modelos/medicion");
const sequelize = require("../config/database");
const UsuarioSensor = require("../modelos/usuario-sensor"); // Ensure this path is correct

exports.getAllSensores = async (req, res) => {
    try {
        const sensores = await Sensor.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            `(
                                SELECT MAX("Mediciones".fecha)
                                FROM "Mediciones"
                                WHERE "Mediciones".id_sensor = "Sensor".id_sensor
                            )`
                        ),
                        'ultima_medicion'
                    ]
                ]
            },
            group: ['Sensor.id_sensor'] // Usa el alias definido por Sequelize
        });

        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores:", error.message, error.stack);
        res.status(500).json({ error: `Error al obtener los sensores: ${error.message}` });
    }
};


exports.getAllSensoresOfUser = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioSensores = await UsuarioSensor.findAll({
            where: {
                id_usuario: id
            },
            include: [Sensor]
        });
        const sensores = usuarioSensores.map(us => us.Sensor);
        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores:", error.message, error.stack);
        res.status(500).json({ error: `Error al obtener los sensores: ${error.message}` });
    }
}

//funcion para cambiar el nombre a un sensor
exports.changeNameSensor = async (req, res) => {
    const { id, nombre } = req.body;
    try {
        const sensor = await Sensor.findOne({
            where: {
                id_sensor: id
            }
        });
        sensor.nombre = nombre;
        await sensor.save();
        res.status(200).json(sensor);
    } catch (error) {
        console.error("Error al cambiar el nombre del sensor:", error);
        res.status(500).json({ error: 'Error al cambiar el nombre del sensor.' });
    }
}
