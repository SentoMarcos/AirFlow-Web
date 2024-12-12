const Medicion = require('../modelos/medicion');
const { Op } = require('sequelize');

/**
 * @module MedicionController
 */

/**
 * Crear una nueva medición.
 * @function createMedicion
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @description Este método permite crear una nueva medición en la base de datos, asegurándose de que todos los campos necesarios estén presentes.
 */
// Crear una nueva medición
//-----------------------------------------------------
//--Medición<Objeto>-->createMedicion()-->Código:numero
//-----------------------------------------------------
exports.createMedicion = async (req, res) => {
    const { id_sensor, tipo_gas, valor, fecha, latitud, longitud } = req.body;

    // Validación de campos obligatorios
    const missingFields = [];
    if (id_sensor === undefined) missingFields.push('id_sensor');
    if (tipo_gas === undefined || tipo_gas === null) missingFields.push('tipo_gas');
    if (valor === undefined) missingFields.push('valor');
    if (fecha === undefined || fecha === null) missingFields.push('fecha');
    if (latitud === undefined) missingFields.push('latitud');
    if (longitud === undefined) missingFields.push('longitud');

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Faltan campos obligatorios: ${missingFields.join(', ')}` });
    }

    try {
        // Normalizar la fecha al nivel de minutos
        const fechaNormalizada = new Date(fecha);
        fechaNormalizada.setSeconds(0, 0);

// Verificar si ya existe una medición con el mismo id_sensor y el mismo minuto
        const medicionExistente = await Medicion.findOne({
            where: {
                id_sensor,
                fecha: {
                    [Op.gte]: fechaNormalizada, // Mayor o igual a la fecha normalizada
                    [Op.lt]: new Date(fechaNormalizada.getTime() + 60000) // Menor al siguiente minuto
                }
            }
        });
        if (medicionExistente) {
            return res.status(409).json({
                error: "Ya existe una medición para este sensor en el mismo segundo."
            });
        }

        // Crear la nueva medición si no existe una duplicada
        const nuevaMedicion = await Medicion.create({
            id_sensor,
            tipo_gas,
            latitud,
            longitud,
            fecha,
            valor
        });

        res.status(201).json(nuevaMedicion);
    } catch (error) {
        console.error("Error al crear la medición:", error);
        res.status(500).json({
            error: "Error al crear la medición. Verifica los datos."
        });
    }
};

//-----------------------------------------------------
//--Medición<Objeto>-->getAllMediciones()-->Medición<Arreglo>
//-----------------------------------------------------
/**
 * Obtener todas las mediciones.
 * @function getAllMediciones
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @description Este método permite obtener todas las mediciones presentes en la base de datos.
 */
exports.getAllMediciones = async (req, res) => {
    try {
        const mediciones = await Medicion.findAll();
        res.status(200).json(mediciones);
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
        res.status(500).json({ error: 'Error al obtener las mediciones.' });
    }
}


//-----------------------------------------------------
//--Medición<Objeto>-->getMedicionesOfSensor()-->Medición<Arreglo>
//-----------------------------------------------------
/**
 * Obtener las mediciones de un sensor.
 * @function getMedicionesOfSensor
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @description Este método permite obtener todas las mediciones de un sensor en particular.
 */
exports.getMedicionesOfSensor = async (req, res) => {
    const { id } = req.params;
    try {
        const mediciones = await Medicion.findAll({
            where: {
                id_sensor: id
            }
        });
        res.status(200).json(mediciones);
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
        res.status(500).json({ error: 'Error al obtener las mediciones.' });
    }
}
