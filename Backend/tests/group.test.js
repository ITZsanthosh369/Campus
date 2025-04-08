const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const ClassGroup = require('../models/classGroupModel');
const { createTestUser, createTestDepartment, createTestClassGroup, cleanupTestData } = require('./testUtils');
const generateToken = require('../utils/generateToken');

// Increase Jest timeout for all tests in this file
jest.setTimeout(30000);

let mongoServer;
let adminToken, coordinatorToken, facultyToken;
let classGroupId, facultyId, departmentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Override the MONGODB_URI with our in-memory server
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test'; // Ensure we're in test mode
}, 30000); // 30 seconds timeout for setup

beforeEach(async () => {
  // Create test users with different roles
  const admin = await createTestUser('admin');
  const coordinator = await createTestUser('faculty'); // Will be set as program coordinator
  const faculty = await createTestUser('faculty');
  
  // Generate tokens
  adminToken = generateToken(admin._id.toString());
  coordinatorToken = generateToken(coordinator._id.toString());
  facultyToken = generateToken(faculty._id.toString());
  facultyId = faculty._id;
  
  // Create test department
  const department = await createTestDepartment();
  departmentId = department._id;
  
  // Create test class group with coordinator
  const classGroup = await ClassGroup.create({
    name: 'Test Class Group',
    year: 2023,
    batch: 'A',
    programCoordinator: coordinator._id,
    department: department._id,
    students: []
  });
  classGroupId = classGroup._id;
}, 15000); // 15 seconds timeout for setup

afterEach(async () => {
  await cleanupTestData();
}, 10000); // 10 seconds timeout for cleanup

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 30000); // 30 seconds timeout for teardown

describe('Group API', () => {
  describe('POST /api/v1/groups/assign-course', () => {
    test('should allow admin to assign a course to class group', async () => {
      const courseData = {
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        semester: 1,
        facultyId: facultyId.toString(),
        classGroupId: classGroupId.toString()
      };

      const res = await request(app)
        .post('/api/v1/groups/assign-course')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/course assigned/i);
      expect(res.body).toHaveProperty('courseGroup');
      expect(res.body.courseGroup.courseCode).toBe(courseData.courseCode);
    });

    test('should allow program coordinator to assign a course to their class group', async () => {
      const courseData = {
        courseCode: 'CS102',
        courseName: 'Data Structures',
        semester: 2,
        facultyId: facultyId.toString(),
        classGroupId: classGroupId.toString()
      };

      const res = await request(app)
        .post('/api/v1/groups/assign-course')
        .set('Authorization', `Bearer ${coordinatorToken}`)
        .send(courseData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('courseGroup');
    });

    test('should not allow regular faculty to assign course to class group', async () => {
      const courseData = {
        courseCode: 'CS103',
        courseName: 'Algorithms',
        semester: 3,
        facultyId: facultyId.toString(),
        classGroupId: classGroupId.toString()
      };

      const res = await request(app)
        .post('/api/v1/groups/assign-course')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(courseData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/not allowed/i);
    });

    test('should not assign course with missing parameters', async () => {
      const courseData = {
        courseCode: 'CS104',
        // Missing courseName and other required fields
        classGroupId: classGroupId.toString()
      };

      const res = await request(app)
        .post('/api/v1/groups/assign-course')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required fields/i);
    });

    test('should not assign course to non-existent class group', async () => {
      const courseData = {
        courseCode: 'CS105',
        courseName: 'Web Development',
        semester: 5,
        facultyId: facultyId.toString(),
        classGroupId: new mongoose.Types.ObjectId().toString() // Non-existent ID
      };

      const res = await request(app)
        .post('/api/v1/groups/assign-course')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(courseData);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
