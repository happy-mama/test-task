const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	dialect: process.env.DB_DIALECT
});

module.exports = sequelize