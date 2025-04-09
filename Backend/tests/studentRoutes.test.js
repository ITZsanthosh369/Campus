const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/userModel');
const { createTestUser, cleanupTestData } = require('./testUtils');
const generateToken = require('../utils/generateToken');

// Increase Jest timeout for all tests in this file
jest.setTimeout(30000);

let mongoServer;
let studentToken;
let testStudent;

// Setup before all tests
beforeAll(async () => {
  // Create MongoMemoryServer
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Override the MONGODB_URI with our in-memory server
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test'; // Ensure we're in test mode
  
  // Create a test student
  testStudent = await createTestUser('student');
  
  // Generate proper JWT token
  studentToken = generateToken(testStudent._id.toString());
}, 30000); // 30 seconds timeout for setup

// Cleanup after each test
afterEach(async () => {
  await cleanupTestData();
}, 10000); // 10 seconds timeout for cleanup

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30000); // 30 seconds timeout for teardown

describe('Student API Routes', () => {
  describe('GET /api/v1/users/my-classes', () => {
    test('should return student classes with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/my-classes')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('classGroups');
      expect(res.body).toHaveProperty('courseGroups');
      expect(Array.isArray(res.body.classGroups)).toBe(true);
      expect(Array.isArray(res.body.courseGroups)).toBe(true);
    });

    test('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/users/my-classes');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });

    test('should return 401 when invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/users/my-classes')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/failed/i);
    });
  });

  describe('GET /api/v1/assignments', () => {
    test('should return assignments with valid token', async () => {
      // Create a fresh student for this test to avoid token issues
      const student = await createTestUser('student');
      const token = generateToken(student._id.toString());
      
      const res = await request(app)
        .get('/api/v1/assignments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('assignments');
      expect(Array.isArray(res.body.assignments)).toBe(true);
    });

    test('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/assignments');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });
  });

  describe('GET /api/v1/announcements', () => {
    test('should return announcements with valid token', async () => {
      // Create a fresh student for this test to avoid token issues
      const student = await createTestUser('student');
      const token = generateToken(student._id.toString());
      
      const res = await request(app)
        .get('/api/v1/announcements')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('announcements');
      expect(Array.isArray(res.body.announcements)).toBe(true);
    });

    test('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/announcements');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });
  });

  describe('GET /api/v1/queries/my-queries', () => {
    test('should return student queries with valid token', async () => {
      // Create a fresh student for this test to avoid token issues
      const student = await createTestUser('student');
      const token = generateToken(student._id.toString());
      
      const res = await request(app)
        .get('/api/v1/queries/my-queries')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('queries');
      expect(Array.isArray(res.body.queries)).toBe(true);
    });

    test('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/queries/my-queries');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });
  });

  describe('POST /api/v1/queries', () => {
    test('should create a query with valid payload', async () => {
      // Create a fresh student for this test to avoid token issues
      const student = await createTestUser('student');
      const token = generateToken(student._id.toString());
      
      const queryData = {
        courseId: '60d5ec9d8e8a8d2b9c9a2345',
        courseName: 'Introduction to Programming',
        facultyId: '60d5ec9d8e8a8d2b9c9a7890',
        subject: 'Question about Assignment 2',
        message: 'I need clarification on problem 3 of Assignment 2.'
      };

      const res = await request(app)
        .post('/api/v1/queries')
        .set('Authorization', `Bearer ${token}`)
        .send(queryData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('message', 'Query submitted successfully');
      expect(res.body).toHaveProperty('query');
      expect(res.body.query.subject).toBe(queryData.subject);
      expect(res.body.query.message).toBe(queryData.message);
    });

    test('should return 400 when required fields are missing', async () => {
      // Create a fresh student for this test to avoid token issues
      const student = await createTestUser('student');
      const token = generateToken(student._id.toString());
      
      const invalidQueryData = {
        // Missing required fields
        subject: 'Question about Assignment',
      };

      const res = await request(app)
        .post('/api/v1/queries')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidQueryData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required fields/i);
    });

    test('should return 401 when no token is provided', async () => {
      const queryData = {
        courseId: '60d5ec9d8e8a8d2b9c9a2345',
        courseName: 'Introduction to Programming',
        facultyId: '60d5ec9d8e8a8d2b9c9a7890',
        subject: 'Question about Assignment 2',
        message: 'I need clarification on problem 3 of Assignment 2.'
      };

      const res = await request(app)
        .post('/api/v1/queries')
        .send(queryData);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });

    test('should not allow faculty to create student queries', async () => {
      // Create a faculty user
      const facultyUser = await createTestUser('faculty');
      const facultyToken = generateToken(facultyUser._id.toString());

      const queryData = {
        courseId: '60d5ec9d8e8a8d2b9c9a2345',
        courseName: 'Introduction to Programming',
        facultyId: '60d5ec9d8e8a8d2b9c9a7890',
        subject: 'Question about Assignment 2',
        message: 'I need clarification on problem 3 of Assignment 2.'
      };

      const res = await request(app)
        .post('/api/v1/queries')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(queryData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/student only/i);
    });
  });
});
