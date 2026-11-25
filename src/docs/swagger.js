const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Loja Virtual', version: '1.0.0', description: 'CRUD de produtos com autenticação JWT.' },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        ProductInput: {
          type: 'object',
          required: ['title', 'price', 'category'],
          properties: {
            title: { type: 'string', example: 'Camiseta básica' },
            price: { type: 'number', example: 59.9 },
            description: { type: 'string', example: 'Algodão, tamanho M' },
            category: { type: 'string', example: 'roupas' },
            image: { type: 'string', example: 'https://placehold.co/300x200' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')],
});
