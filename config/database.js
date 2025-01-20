/**
 * Database configuration
 * @module config/database
 * @requires dotenv
 * @requires sequelize
 */
const { Sequelize } = require('sequelize');

/**
 * @const {Sequelize} sequelize
 * @description Conexión a la base de datos.
 */

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

module.exports = sequelize;
