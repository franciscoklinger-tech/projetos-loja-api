const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const ctrl = require('../controllers/authController');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Maria Silva }
 *               email: { type: string, example: maria@email.com }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201: { description: Usuário criado (retorna user e token) }
 *       400: { description: Dados inválidos }
 *       409: { description: E-mail já cadastrado }
 */
router.post('/register', validate(ctrl.registerSchema), asyncHandler(ctrl.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica e retorna o token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@loja.com }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200: { description: Login realizado (retorna user e token) }
 *       401: { description: Credenciais inválidas }
 */
router.post('/login', validate(ctrl.loginSchema), asyncHandler(ctrl.login));

module.exports = router;
