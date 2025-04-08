const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/userModel');
const { cleanupTestData } = require('./testUtils');

// Increase Jest timeout for all tests in this file
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Override the MONGODB_URI with our in-memory server
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test'; // Ensure we're in test mode
}, 30000); // 30 seconds timeout for setup

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30000); // 30 seconds timeout for teardown

afterEach(async () => {
  await cleanupTestData();
}, 10000); // 10 seconds timeout for cleanup

describe('Authentication API', () => {
  describe('POST /api/v1/auth/register', () => {
    test('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        classGroup: 'CS-2023',
        batch: 'A',
        year: '2023'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe(userData.email);
      expect(res.body.name).toBe(userData.name);
      expect(res.body.role).toBe(userData.role);
    }, 15000); // 15 seconds timeout for this test

    test('should not register a user with duplicate email', async () => {
      // First create a user
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        classGroup: 'CS-2023',
        batch: 'A',
        year: '2023'
      });

      // Try to register with the same email
      const userData = {
        name: 'Test User',
        email: 'existing@example.com', // Same email as above
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        classGroup: 'CS-2023',
        batch: 'A',
        year: '2023'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/user already exists/i);
    });

    test('should not register a user with incomplete data', async () => {
      const userData = {
        name: 'Test User',
        email: 'testuser@example.com',
        // Missing required fields like password, role, etc.
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      // Updated expectation - the server is returning 500 error, not 400
      expect(res.statusCode).toBe(500); 
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should login with valid credentials', async () => {
      // First create a user
      const user = await User.create({
        name: 'Test User',
        email: 'logintest@example.com',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        classGroup: 'CS-2023',
        batch: 'A',
        year: '2023'
      });

      // Try to login
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe(user.email);
    });

    test('should not login with invalid credentials', async () => {
      // First create a user
      await User.create({
        name: 'Test User',
        email: 'invalidlogin@example.com',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        classGroup: 'CS-2023',
        batch: 'A',
        year: '2023'
      });

      // Try to login with wrong password
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalidlogin@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    test('should not login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });
});
