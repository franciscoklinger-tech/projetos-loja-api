'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(150), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      category: { type: Sequelize.STRING(60), allowNull: false },
      image: { type: Sequelize.STRING(500), allowNull: true },
      // Dono do produto (base da autorização por recurso)
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Índices para as consultas mais comuns (filtro por categoria e por dono)
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
