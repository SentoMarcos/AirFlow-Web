const Usuario = require('../modelos/usuario');
const Sensor = require('../modelos/sensor');
const Medicion = require('../modelos/medicion');
const UsuarioSensor = require('../modelos/usuario-sensor');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database'); // Instancia de la base de datos


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
        // Obtener todas las mediciones ordenadas por el campo 'id'
        const mediciones = await Medicion.findAll({
            order: [['id', 'ASC']]  // Ordenar por 'id' en orden ascendente
        });

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

exports.getMedicionesPorSensores = async (req, res) => {
    try {
        const { sensores } = req.body; // Extraer los IDs de sensores del cuerpo de la solicitud

        if (!Array.isArray(sensores) || sensores.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron sensores válidos." });
        }

        // Buscar todas las mediciones para los sensores proporcionados
        const mediciones = await Medicion.findAll({
            where: {
                id_sensor: sensores // Filtrar por los IDs de sensores
            },
            attributes: ['id', 'id_sensor', 'tipo_gas', 'latitud', 'longitud', 'fecha', 'valor'] // Campos a devolver
        });

        // Si no se encuentran mediciones
        if (mediciones.length === 0) {
            return res.status(404).json({ error: "No se encontraron mediciones para los sensores proporcionados." });
        }

        // Transformar las instancias de Sequelize en un formato más limpio
        const medicionesData = mediciones.map(medicion => medicion.toJSON());

        res.status(200).json(medicionesData);
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
        res.status(500).json({ error: "Error al obtener las mediciones.", detalles: error.message });
    }
};

exports.getMedicionesPorFecha = async (req, res) => {
    try {
        const { sensores, fechaInicio, fechaFin } = req.body; // Extraer los IDs de sensores y las fechas del cuerpo de la solicitud

        if (!Array.isArray(sensores) || sensores.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron sensores válidos." });
        }

        // Asegúrate de que las fechas se encuentren en el formato correcto
        const mediciones = await Medicion.findAll({
            where: {
                id_sensor: sensores,
                fecha: {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)] // Filtrar por las fechas proporcionadas
                }
            },
            attributes: ['id', 'id_sensor', 'tipo_gas', 'latitud', 'longitud', 'fecha', 'valor'] // Campos a devolver
        });

        // Si no se encuentran mediciones
        if (mediciones.length === 0) {
            return res.status(404).json({ error: "No se encontraron mediciones para los sensores y fechas proporcionados." });
        }

        // Transformar las instancias de Sequelize en un formato más limpio
        const medicionesData = mediciones.map(medicion => medicion.toJSON());

        res.status(200).json(medicionesData);
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
        res.status(500).json({ error: "Error al obtener las mediciones.", detalles: error.message });
    }
};

exports.getMedicionesPorIntervaloFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body; // Extraer las fechas del cuerpo de la solicitud

        // Asegúrate de que las fechas se encuentren en el formato correcto
        const mediciones = await Medicion.findAll({
            where: {
                fecha: {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)] // Filtrar por las fechas proporcionadas
                }
            },
            attributes: ['id', 'id_sensor', 'tipo_gas', 'latitud', 'longitud', 'fecha', 'valor'] // Campos a devolver
        });

        // Si no se encuentran mediciones
        if (mediciones.length === 0) {
            return res.status(404).json({ error: "No se encontraron mediciones para el intervalo de fechas proporcionado." });
        }

        // Transformar las instancias de Sequelize en un formato más limpio
        const medicionesData = mediciones.map(medicion => medicion.toJSON());

        res.status(200).json(medicionesData);
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
        res.status(500).json({ error: "Error al obtener las mediciones.", detalles: error.message });
    }
};


/**
 * Obtener la media de las mediciones de todos los sensores de un usuario.
 * @function getMediaMedicionesUsuario
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @description Este método calcula la media de los valores de medición para los sensores asociados a un usuario específico.
 */
exports.getMediaMedicionesUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Obtener los sensores asociados al usuario
        const sensores = await UsuarioSensor.findAll({
            where: { id_usuario: idUsuario },
            include: [
                {
                    model: Sensor,
                    attributes: ['id_sensor']
                }
            ]
        });

        if (sensores.length === 0) {
            return res.status(404).json({ error: 'No se encontraron sensores asociados al usuario.' });
        }

        // Extraer los IDs de los sensores
        const sensorIds = sensores.map(sensor => sensor.id_sensor);

        // Calcular la media de las mediciones de estos sensores
        const mediciones = await Medicion.findAll({
            where: {
                id_sensor: { [Op.in]: sensorIds }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('fecha')), 'fecha_dia'], // Agrupar por día
                [sequelize.fn('AVG', sequelize.col('valor')), 'valor_promedio'] // Calcular la media
            ],
            group: ['fecha_dia'], // Agrupar por la fecha en días
            order: [[sequelize.col('fecha_dia'), 'ASC']] // Ordenar cronológicamente
        });


        // Verificar si hay resultados
        if (mediciones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron mediciones para los sensores del usuario.' });
        }

        res.status(200).json(mediciones);
    } catch (error) {
        console.error('Error al calcular la media de las mediciones:', error);
        res.status(500).json({ error: 'Error al calcular la media de las mediciones.' });
    }
};

//allMediciones of user
exports.getAllMedicionesUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Obtener los sensores asociados al usuario
        const sensores = await UsuarioSensor.findAll({
            where: { id_usuario: idUsuario },
            include: [
                {
                    model: Sensor,
                    attributes: ['id_sensor']
                }
            ]
        });

        if (sensores.length === 0) {
            return res.status(404).json({ error: 'No se encontraron sensores asociados al usuario.' });
        }

        // Extraer los IDs de los sensores
        const sensorIds = sensores.map(sensor => sensor.id_sensor);

        // Calcular la media de las mediciones de estos sensores
        const mediciones = await Medicion.findAll({
            where: {
                id_sensor: { [Op.in]: sensorIds }
            },
            order: [[sequelize.col('fecha'), 'DESC']] // Ordenar cronológicamente
        });

        // Verificar si hay resultados
        if (mediciones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron mediciones para los sensores del usuario.' });
        }

        res.status(200).json(mediciones);
    } catch (error) {
        console.error('Error al obtener las mediciones del usuario:', error);
        res.status(500).json({ error: 'Error al obtener las mediciones del usuario.' });
    }
};

