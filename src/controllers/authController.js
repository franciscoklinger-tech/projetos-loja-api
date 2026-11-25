const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

/** POST /auth/register — cria usuário comum (nunca admin). */
async function register(req, res) {
  const { name, email, password } = req.body;

  if (await User.findOne({ where: { email } })) {
    throw new AppError('E-mail já cadastrado.', 409);
  }

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: 'user' });
  const { password: _omit, ...safeUser } = user.toJSON();
  res.status(201).json({ user: safeUser, token: signToken(user) });
}

/** POST /auth/login */
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { email } });

  // Mesma mensagem para e-mail ou senha errados (não revela qual existe)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const { password: _omit, ...safeUser } = user.toJSON();
  res.json({ user: safeUser, token: signToken(user) });
}

module.exports = { register, login, registerSchema, loginSchema };
