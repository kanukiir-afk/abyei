import request from 'supertest';

const mockPrisma = { news: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), count: jest.fn() } };
jest.mock('../src/prismaClient', () => ({ prisma: mockPrisma }));
const { prisma } = require('../src/prismaClient');
const { app } = require('../src/server');

describe('news routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('lists news', async () => {
    (prisma.news.findMany as any).mockResolvedValue([{ id: 'n1', title: 'News' }]);
    (prisma.news.count as any).mockResolvedValue(1);
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('returns 404 for unpublished article', async () => {
    (prisma.news.findUnique as any).mockResolvedValue({ id: 'n1', published: false });
    const res = await request(app).get('/api/news/slug-not-found');
    expect(res.status).toBe(404);
  });
});
