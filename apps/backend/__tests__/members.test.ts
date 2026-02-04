import request from 'supertest';

const mockPrisma = { member: { findMany: jest.fn(), create: jest.fn() }, user: { create: jest.fn() } };
jest.mock('../src/prismaClient', () => ({ prisma: mockPrisma }));
const { prisma } = require('../src/prismaClient');
const { app } = require('../src/server');

describe('members routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('submits a registration', async () => {
    (prisma.user.create as any).mockResolvedValue({ id: 'u1', email: 'x@y.com' });
    (prisma.member.create as any).mockResolvedValue({ id: 'm1' });

    const res = await request(app).post('/api/members/register').send({ fullName: 'Test User', email: 'x@y.com' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('searches approved members', async () => {
    (prisma.member.findMany as any).mockResolvedValue([{ id: 'm1', user: { name: 'Test', approved: true } }]);
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.members)).toBe(true);
  });
});
