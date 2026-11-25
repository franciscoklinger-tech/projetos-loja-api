const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'user' },
    },
    {
      tableName: 'users',
      // Nunca devolve o hash da senha nas respostas JSON
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: { attributes: {} } },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Product, { foreignKey: 'userId', as: 'products' });
  };

  return User;
};
