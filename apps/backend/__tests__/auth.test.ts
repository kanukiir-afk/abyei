import request from 'supertest';

// synchronous mock of prisma used by routes
const mockPrisma = {
  user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  verificationToken: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn() }
};

jest.mock('../src/prismaClient', () => ({ prisma: mockPrisma }));
jest.mock('bcryptjs', () => ({ hash: jest.fn(() => Promise.resolve('hashed')), compare: jest.fn(() => Promise.resolve(true)) }));

const { prisma } = require('../src/prismaClient');
const { app } = require('../src/server');

describe('auth routes', () => {
  afterEach(() => jest.clearAllMocks());

  it('registers a new user and creates verification token', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({ id: 'u1', email: 'a@b.com' });
    (prisma.verificationToken.create as any).mockResolvedValue({ token: 't1' });

    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'secret' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(prisma.verificationToken.create).toHaveBeenCalled();
  });

  it('logs in an existing user', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: 'hashed', role: 'ADMIN' });
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'secret' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('a@b.com');
  });
});
