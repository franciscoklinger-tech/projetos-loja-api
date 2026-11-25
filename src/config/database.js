require('dotenv').config({ quiet: true });

const base = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: false,
};

module.exports = {
  development: base,
  production: base,
  // Nos testes usamos banco em memória: rápido e isolado
  test: { dialect: 'sqlite', storage: ':memory:', logging: false },
};
