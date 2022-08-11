const { Sequelize, DataTypes, Model, Op } = require("sequelize");

const sequelize = new Sequelize({
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	dialect: process.env.DB_DIALECT
});

class note extends Model {};

note.init({
	owner: {
		type: DataTypes.STRING,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	value: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { sequelize });

const DB = sequelize

module.exports = { DB, note, Op };