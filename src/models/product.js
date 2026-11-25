const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      title: { type: DataTypes.STRING(150), allowNull: false },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // O DECIMAL pode voltar como string; convertemos para número
        get() {
          const value = this.getDataValue('price');
          return value === null ? null : Number(value);
        },
      },
      description: { type: DataTypes.TEXT },
      category: { type: DataTypes.STRING(60), allowNull: false },
      image: { type: DataTypes.STRING(500) },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: 'products' }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
  };

  return Product;
};
