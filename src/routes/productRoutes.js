const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const ctrl = require('../controllers/productController');

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista produtos (paginado)
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10, maximum: 100 } }
 *       - { in: query, name: category, schema: { type: string } }
 *       - { in: query, name: q, description: Busca no título, schema: { type: string } }
 *     responses:
 *       200: { description: Lista de produtos com metadados de paginação }
 *   post:
 *     tags: [Produtos]
 *     summary: Cria um produto
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       201: { description: Produto criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autenticado }
 */
router.get('/', asyncHandler(ctrl.list));
router.post('/', authenticate, validate(ctrl.productSchema), asyncHandler(ctrl.create));

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Busca um produto pelo id
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Produto encontrado }
 *       404: { description: Produto não encontrado }
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza um produto (dono ou admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductInput' }
 *     responses:
 *       200: { description: Produto atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 *       404: { description: Produto não encontrado }
 *   delete:
 *     tags: [Produtos]
 *     summary: Remove um produto (dono ou admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Removido }
 *       401: { description: Não autenticado }
 *       403: { description: Sem permissão }
 *       404: { description: Produto não encontrado }
 */
router.get('/:id', asyncHandler(ctrl.getById));
router.put('/:id', authenticate, validate(ctrl.productSchema), asyncHandler(ctrl.update));
router.delete('/:id', authenticate, asyncHandler(ctrl.remove));

module.exports = router;
