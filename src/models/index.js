const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const models = {
  User: require('./user')(sequelize),
  Product: require('./product')(sequelize),
};

// Registra as associações (hasMany, belongsTo...)
Object.values(models).forEach((model) => model.associate && model.associate(models));

module.exports = { sequelize, Sequelize, ...models };
