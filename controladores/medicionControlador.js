const Medicion = require('../modelos/medicion');
const { Op } = require("sequelize");

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
exports.createMedicion = async (req, res) => {
    const { valor, fecha, latitud, longitud } = req.body;
  
    // Verificar que todos los campos obligatorios están presentes
    if (valor !== undefined && fecha && latitud !== undefined && longitud !== undefined) {
      try {
        const nuevaMedicion = await Medicion.create({ valor, fecha, latitud, longitud });
        res.status(201).json(nuevaMedicion);
      } catch (error) {
        console.error("Error al crear la medición:", error);
        res.status(400).json({ error: 'Error al crear la medición. Verifica los datos.' });
      }
    } else {
      res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }
};

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
