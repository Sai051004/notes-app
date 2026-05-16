import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('Auth API (assignment)', () => {
  const user = { email: 'test@example.com', password: 'password123' };

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/register').send(user);

      expect(res.status).toBe(201);
      expect(res.body.message).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/register').send(user);
      const res = await request(app).post('/register').send(user);

      expect(res.status).toBe(409);
      expect(res.body.message).toBeDefined();
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/register').send(user);
    });

    it('should login successfully', async () => {
      const res = await request(app).post('/login').send(user);

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: user.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});
