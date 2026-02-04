import request from 'supertest';

const mockPrisma = { event: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() } };
jest.mock('../src/prismaClient', () => ({ prisma: mockPrisma }));
const { prisma } = require('../src/prismaClient');
const { app } = require('../src/server');

describe('events routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('lists upcoming and past events', async () => {
    (prisma.event.findMany as any).mockResolvedValue([]);
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('upcoming');
    expect(res.body).toHaveProperty('past');
  });
});
