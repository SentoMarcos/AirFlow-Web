const Usuario = require('../modelos/usuario');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  const { nombre, apellidos, email, telefono, contrasenya } = req.body;
  if (nombre && email && telefono && contrasenya) {
    try {
      const nuevoUsuario = await Usuario.create({ nombre, apellidos, email, telefono, contrasenya: contrasenya });
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(400).json({ error: 'Error al crear el usuario. Verifica los datos.' });
    }
  } else {
    res.status(400).json({ error: 'Faltan parámetros obligatorios' });
  }
};
