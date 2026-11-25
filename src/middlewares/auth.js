const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/** Autenticação: exige um token JWT válido no header Authorization: Bearer <token>. */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token não informado.', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
}

/** Autorização por perfil: authorize('admin') */
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new AppError('Acesso negado.', 403));

module.exports = { authenticate, authorize };
