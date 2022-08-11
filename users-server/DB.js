const { Sequelize, DataTypes, Model, Op } = require("sequelize");

const sequelize = new Sequelize({
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	dialect: process.env.DB_DIALECT
});

class user extends Model {};

user.init({
	login: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { sequelize });

const DB = sequelize

module.exports = { DB, user, Op };