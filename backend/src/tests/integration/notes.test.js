import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';

let mongoServer;
let token;

const user = { email: 'notes@example.com', password: 'password123' };
const otherUser = { email: 'other@example.com', password: 'password123' };

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
  await request(app).post('/register').send(user);
  const loginRes = await request(app).post('/login').send(user);
  token = loginRes.body.access_token;
});

const authHeader = () => ({ Authorization: `Bearer ${token}` });

describe('Notes API (assignment)', () => {
  describe('POST /notes', () => {
    it('should create a note', async () => {
      const res = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Test Note', content: 'Content' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Test Note');
      expect(res.body.content).toBe('Content');
      expect(res.body.created_at).toBeDefined();
      expect(res.body.updated_at).toBeDefined();
    });

    it('should require authentication', async () => {
      const res = await request(app).post('/notes').send({ title: 'Test', content: 'A' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /notes', () => {
    it('should list notes created by the user', async () => {
      await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Note 1', content: 'A' });
      await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Note 2', content: 'B' });

      const res = await request(app).get('/notes').set(authHeader());

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by id', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'My Note', content: 'Body' });

      const res = await request(app).get(`/notes/${createRes.body.id}`).set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('My Note');
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Original', content: 'V1' });

      const res = await request(app)
        .put(`/notes/${createRes.body.id}`)
        .set(authHeader())
        .send({ title: 'Updated', content: 'V2' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
      expect(res.body.content).toBe('V2');

      const historyRes = await request(app)
        .get(`/notes/${createRes.body.id}/history`)
        .set(authHeader());

      expect(historyRes.status).toBe(200);
      const versions = historyRes.body.data.sort((a, b) => a.versionNumber - b.versionNumber);
      expect(versions).toHaveLength(2);
      expect(versions[1].title).toBe('Updated');
      expect(versions[1].content).toBe('V2');
    });

    it('should not create a version when saving unchanged content', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Stable', content: 'Same' });

      await request(app)
        .put(`/notes/${createRes.body.id}`)
        .set(authHeader())
        .send({ title: 'Stable', content: 'Same' });

      const historyRes = await request(app)
        .get(`/notes/${createRes.body.id}/history`)
        .set(authHeader());

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.data).toHaveLength(1);
    });

    it('should not create a version when only archiving', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Archive me', content: 'Body' });

      await request(app)
        .put(`/notes/${createRes.body.id}`)
        .set(authHeader())
        .send({ isArchived: true });

      const historyRes = await request(app)
        .get(`/notes/${createRes.body.id}/history`)
        .set(authHeader());

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.data).toHaveLength(1);
    });
  });

  describe('GET /notes archived filter', () => {
    it('should hide archived notes from the default list', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'To archive', content: 'X' });

      await request(app)
        .put(`/notes/${createRes.body.id}`)
        .set(authHeader())
        .send({ isArchived: true });

      const activeRes = await request(app).get('/notes').set(authHeader());
      expect(activeRes.status).toBe(200);
      expect(activeRes.body.some((n) => n.id === createRes.body.id)).toBe(false);

      const archivedRes = await request(app)
        .get('/notes')
        .query({ archived: true })
        .set(authHeader());

      expect(archivedRes.status).toBe(200);
      expect(archivedRes.body.some((n) => n.id === createRes.body.id)).toBe(true);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note', async () => {
      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Delete me', content: 'X' });

      const res = await request(app).delete(`/notes/${createRes.body.id}`).set(authHeader());

      expect(res.status).toBe(204);
    });
  });

  describe('POST /notes/:id/share', () => {
    it('should share a note with another user', async () => {
      await request(app).post('/register').send(otherUser);

      const createRes = await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'Shared Note', content: 'Share this' });

      const shareRes = await request(app)
        .post(`/notes/${createRes.body.id}/share`)
        .set(authHeader())
        .send({ share_with_email: otherUser.email });

      expect(shareRes.status).toBe(200);
      expect(shareRes.body.message).toBeDefined();

      const otherLogin = await request(app).post('/login').send(otherUser);
      const otherToken = otherLogin.body.access_token;

      const getRes = await request(app)
        .get(`/notes/${createRes.body.id}`)
        .set({ Authorization: `Bearer ${otherToken}` });

      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe('Shared Note');
    });
  });

  describe('GET /about', () => {
    it('should return about info', async () => {
      const res = await request(app).get('/about');
      expect(res.status).toBe(200);
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
      expect(res.body['my features']).toBeDefined();
    });
  });

  describe('GET /openapi.json', () => {
    it('should return openapi spec', async () => {
      const res = await request(app).get('/openapi.json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe('3.0.3');
      expect(res.body.paths['/register']).toBeDefined();
    });
  });

  describe('GET /search', () => {
    it('should search notes', async () => {
      await request(app)
        .post('/notes')
        .set(authHeader())
        .send({ title: 'UniqueSearchTerm', content: 'findme' });

      const res = await request(app)
        .get('/search')
        .query({ q: 'UniqueSearchTerm' })
        .set(authHeader());

      expect(res.status).toBe(200);
    });
  });
});
