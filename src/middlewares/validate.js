const AppError = require('../utils/AppError');

/** Valida req.body com um schema do Zod e substitui pelo dado já tratado. */
module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message }));
    return next(new AppError('Dados inválidos.', 400, details));
  }
  req.body = result.data;
  return next();
};
