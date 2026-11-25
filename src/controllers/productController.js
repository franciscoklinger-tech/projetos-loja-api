const { z } = require('zod');
const { Op } = require('sequelize');
const { Product } = require('../models');
const AppError = require('../utils/AppError');

const productSchema = z.object({
  title: z.string().trim().min(3, 'O título deve ter ao menos 3 caracteres.'),
  price: z.number({ invalid_type_error: 'O preço deve ser um número.' }).positive('O preço deve ser maior que zero.'),
  description: z.string().trim().optional(),
  category: z.string().trim().min(2, 'Informe a categoria.'),
  image: z.string().trim().url('URL de imagem inválida.').optional().or(z.literal('')),
});

/** Busca o produto ou lança 404. */
async function findOrFail(id) {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError('Produto não encontrado.', 404);
  return product;
}

/** Só o dono do produto ou um admin pode alterar/remover. */
function assertCanModify(product, user) {
  if (user.role !== 'admin' && product.userId !== user.id) {
    throw new AppError('Você não tem permissão sobre este produto.', 403);
  }
}

/** GET /products?page=1&limit=10&category=x&q=texto */
async function list(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { category, q } = req.query;

  const where = {};
  if (category) where.category = category;
  if (q) where.title = { [Op.like]: `%${q}%` };

  // Paginação feita no banco (LIMIT/OFFSET), sem trazer tudo para a memória
  const { rows, count } = await Product.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['id', 'DESC']],
  });

  res.json({ data: rows, meta: { page, limit, total: count, pages: Math.ceil(count / limit) } });
}

/** GET /products/:id */
async function getById(req, res) {
  res.json(await findOrFail(req.params.id));
}

/** POST /products */
async function create(req, res) {
  const product = await Product.create({ ...req.body, userId: req.user.id });
  res.status(201).json(product);
}

/** PUT /products/:id */
async function update(req, res) {
  const product = await findOrFail(req.params.id);
  assertCanModify(product, req.user);
  await product.update(req.body);
  res.json(product);
}

/** DELETE /products/:id */
async function remove(req, res) {
  const product = await findOrFail(req.params.id);
  assertCanModify(product, req.user);
  await product.destroy();
  res.status(204).send();
}

module.exports = { list, getById, create, update, remove, productSchema };
