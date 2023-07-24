const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', '3601', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;