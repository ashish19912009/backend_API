const { Sequelize } = require("sequelize");

// Get the enviroment

const env = process.env.NODE_ENV || "development";
const config = require("./config");

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;
