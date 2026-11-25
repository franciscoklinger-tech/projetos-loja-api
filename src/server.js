const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

sequelize
  .authenticate()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`API rodando em http://localhost:${PORT} | Docs: http://localhost:${PORT}/docs`)
    )
  )
  .catch((err) => {
    console.error('Falha ao conectar no banco:', err.message);
    process.exit(1);
  });
