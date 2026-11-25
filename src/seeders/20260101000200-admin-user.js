'use strict';
require('dotenv').config({ quiet: true });
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL || 'admin@loja.com',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10),
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: process.env.ADMIN_EMAIL || 'admin@loja.com' });
  },
};
