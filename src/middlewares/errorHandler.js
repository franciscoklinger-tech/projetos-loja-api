/** Middleware central de erros: garante respostas HTTP consistentes. */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ erro: 'Registro já existe.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON malformado.' });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  return res.status(status).json({
    erro: status === 500 ? 'Erro interno do servidor.' : err.message,
    ...(err.details && { detalhes: err.details }),
  });
};
