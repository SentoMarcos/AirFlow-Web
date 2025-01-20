const bcrypt = require('bcryptjs');
/**
 * @fileoverview Modelo de la tabla Usuarios en la base de datos.
 * @module Usuario
 * @requires sequelize
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UsuarioRol = require("./usuario-rol");
const Rol = require("./roles"); // Importar la conexión a la base de datos

/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').ModelCtor<Model>} ModelCtor
 */

/**
 * @const {ModelCtor} Usuario
 * @description Modelo para la tabla de Usuarios en la base de datos.
 *
 * @property {number} id - Identificador único del usuario, clave primaria y autoincremental.
 * @property {string} nombre - Nombre del usuario, máximo 255 caracteres.
 * @property {string} [apellidos] - Apellidos del usuario, máximo 255 caracteres. Puede ser nulo.
 * @property {string} email - Correo electrónico del usuario, único y máximo 255 caracteres.
 * @property {string} telefono - Teléfono de contacto del usuario, máximo 255 caracteres.
 * @property {string} contrasenya - Contraseña del usuario, máximo 255 caracteres.
 */
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false, // Este campo no puede ser nulo según la nueva definición
    unique: true, // Este campo debe ser único
  },
  telefono: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  },
  contrasenya: {
    type: DataTypes.STRING(255), // Se especifica un tamaño máximo de 255 caracteres
    allowNull: false,
  }
}, {
  tableName: 'Usuarios', // Nombre de la tabla en la base de datos
  timestamps: true, // Cambia a true si quieres agregar createdAt y updatedAt
});

/**
 * Hook afterSync para crear un usuario admin y asignar su rol automáticamente.
 */
Usuario.afterSync(async () => {
  const usuarioAdminExistente = await Usuario.count({ where: { email: 'admin@admin.com' } });
  if (usuarioAdminExistente === 0) {
    // Encriptar la contraseña del usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10); // Contraseña por defecto

    // Crear el usuario admin
    const nuevoUsuarioAdmin = await Usuario.create({
      nombre: 'Administrador',
      apellidos: 'Sistema',
      email: 'admin@admin.com',
      telefono: '123456789',
      contrasenya: hashedPassword,
    });

    console.log('Usuario admin creado.');

    // Obtener el rol de Administrador (id_rol = 1)
    const rolAdmin = await Rol.findOne({ where: { id_rol: 1 } });

    if (rolAdmin) {
      // Crear la relación entre el usuario admin y el rol administrador en la tabla Usuario-Rol
      await UsuarioRol.create({
        id_usuario: nuevoUsuarioAdmin.id,
        id_rol: rolAdmin.id_rol,
      });

      console.log('Rol de Administrador asignado al usuario admin.');
    } else {
      console.log('Rol de Administrador no encontrado.');
    }
  } else {
    console.log('El usuario admin ya existe.');
  }
});

// Exportar el modelo
module.exports = Usuario;
