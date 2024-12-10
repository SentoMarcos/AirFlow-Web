// Obtener todos los usuarios
//-----------------------------------------------------
//--getAllSensores()-->Código:numero,sensores:json
const Sensor = require("../modelos/sensor");
exports.getAllSensores = async (req, res) => {
    try {
        const sensores = await Sensor.findAll();
        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores:", error);
        res.status(500).json({ error: 'Error al obtener los sensores.' });
    }
};

exports.getAllSensoresOfUser = async (req, res) => {
    const { id } = req.params;
    try {
        const sensores = await Sensor.findAll({
            where: {
                usuarioId: id
            }
        });
        res.status(200).json(sensores);
    } catch (error) {
        console.error("Error al obtener los sensores:", error);
        res.status(500).json({ error: 'Error al obtener los sensores.' });
    }
}