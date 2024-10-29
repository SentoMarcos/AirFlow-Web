const Medicion = require('../modelos/medicion');

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
