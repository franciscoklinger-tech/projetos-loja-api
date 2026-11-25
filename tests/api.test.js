process.env.JWT_SECRET = 'segredo-de-teste';
const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

const product = { title: 'Camiseta', price: 59.9, category: 'roupas' };
let token;
let otherToken;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // cria as tabelas no banco em memória
  token = (await request(app).post('/auth/register').send({ name: 'Ana', email: 'ana@email.com', password: '123456' })).body.token;
  otherToken = (await request(app).post('/auth/register').send({ name: 'Bia', email: 'bia@email.com', password: '123456' })).body.token;
});

afterAll(() => sequelize.close());

describe('Autenticação', () => {
  it('rejeita e-mail duplicado (409)', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Ana', email: 'ana@email.com', password: '123456' });
    expect(res.status).toBe(409);
  });

  it('rejeita senha errada (401)', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'ana@email.com', password: 'errada' });
    expect(res.status).toBe(401);
  });

  it('faz login e não expõe a senha', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'ana@email.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
  });
});

describe('CRUD de produtos', () => {
  let id;

  it('401 ao criar sem token', async () => {
    expect((await request(app).post('/products').send(product)).status).toBe(401);
  });

  it('400 com dados inválidos', async () => {
    const res = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send({ title: 'x', price: -1 });
    expect(res.status).toBe(400);
    expect(res.body.detalhes.length).toBeGreaterThan(0);
  });

  it('cria produto (201)', async () => {
    const res = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send(product);
    expect(res.status).toBe(201);
    expect(res.body.price).toBe(59.9);
    id = res.body.id;
  });

  it('lista com paginação (200)', async () => {
    const res = await request(app).get('/products?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
  });

  it('busca por id e 404 quando não existe', async () => {
    expect((await request(app).get(`/products/${id}`)).status).toBe(200);
    expect((await request(app).get('/products/9999')).status).toBe(404);
  });

  it('403 ao alterar produto de outro usuário', async () => {
    const res = await request(app).put(`/products/${id}`).set('Authorization', `Bearer ${otherToken}`).send(product);
    expect(res.status).toBe(403);
  });

  it('atualiza produto do próprio dono (200)', async () => {
    const res = await request(app).put(`/products/${id}`).set('Authorization', `Bearer ${token}`).send({ ...product, price: 79.9 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(79.9);
  });

  it('remove produto (204) e depois retorna 404', async () => {
    expect((await request(app).delete(`/products/${id}`).set('Authorization', `Bearer ${token}`)).status).toBe(204);
    expect((await request(app).get(`/products/${id}`)).status).toBe(404);
  });
});
