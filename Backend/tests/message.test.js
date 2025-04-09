const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { createTestUser, createTestDepartment, createTestClassGroup, cleanupTestData } = require('./testUtils');
const generateToken = require('../utils/generateToken');
const Message = require('../models/messageModel');

// Global timeout for all tests in this file
jest.setTimeout(30000);

let studentToken, facultyToken, adminToken;
let department, classGroup, student, faculty, admin;

// Use the already established mongoose connection from jest.setup.js
beforeEach(async () => {
  // Create test users with different roles
  student = await createTestUser('student');
  faculty = await createTestUser('faculty');
  admin = await createTestUser('admin');
  
  // Generate tokens
  studentToken = generateToken(student._id.toString());
  facultyToken = generateToken(faculty._id.toString());
  adminToken = generateToken(admin._id.toString());
  
  // Create test department
  department = await createTestDepartment();
  
  // Add our test users to department
  department.students.push(student._id);
  department.faculties.push(faculty._id);
  await department.save();
  
  // Create test class group
  classGroup = await createTestClassGroup(department._id);
  classGroup.students.push(student._id);
  await classGroup.save();
  
  // Create some test messages
  await Message.create({
    sender: faculty._id,
    groupType: 'Department',
    groupId: department._id,
    content: 'Test department message'
  });
  
  await Message.create({
    sender: faculty._id,
    groupType: 'ClassGroup',
    groupId: classGroup._id,
    content: 'Test class group message'
  });
});

afterEach(async () => {
  await cleanupTestData();
}, 10000); // 10 second timeout for cleanup

describe('Message API', () => {
  describe('POST /api/v1/messages/send', () => {
    test('should allow student to send message to their department', async () => {
      const messageData = {
        groupType: 'Department',
        groupId: department._id.toString(),
        content: 'Hello from student'
      };

      const res = await request(app)
        .post('/api/v1/messages/send')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(messageData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message.content).toBe(messageData.content);
      expect(res.body.message.sender).toHaveProperty('_id');
      if (res.body.message.sender && res.body.message.sender._id) {
        expect(typeof res.body.message.sender._id).toBe('string');
      }
    });

    test('should allow faculty to send message to department', async () => {
      const messageData = {
        groupType: 'Department',
        groupId: department._id.toString(),
        content: 'Hello from faculty'
      };

      const res = await request(app)
        .post('/api/v1/messages/send')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(messageData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('message');
    });

    test('should not allow admin to send messages', async () => {
      const messageData = {
        groupType: 'Department',
        groupId: department._id.toString(),
        content: 'Hello from admin'
      };

      const res = await request(app)
        .post('/api/v1/messages/send')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(messageData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/admin users are not allowed/i);
    });

    test('should not allow sending message to group user does not belong to', async () => {
      // Create another department the user doesn't belong to
      const anotherDepartment = await createTestDepartment();
      
      // Make sure the user is NOT added to the department
      // (this was likely missing in the original implementation)
      
      const messageData = {
        groupType: 'Department',
        groupId: anotherDepartment._id.toString(),
        content: 'This should fail'
      };

      const res = await request(app)
        .post('/api/v1/messages/send')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(messageData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/do not have permission/i);
    });
  });

  describe('GET /api/v1/messages', () => {
    test('should allow student to get messages from their department', async () => {
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({
          groupType: 'Department',
          groupId: department._id.toString()
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('messages');
      expect(Array.isArray(res.body.messages)).toBe(true);
      expect(res.body.messages.length).toBeGreaterThan(0);
    });

    test('should allow faculty to get messages from class group', async () => {
      // First add faculty to class group as tutor
      classGroup.tutor = faculty._id;
      await classGroup.save();
      
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${facultyToken}`)
        .query({
          groupType: 'ClassGroup',
          groupId: classGroup._id.toString()
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('messages');
    });

    test('should not allow admin to get messages', async () => {
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          groupType: 'Department',
          groupId: department._id.toString()
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/admin users are not allowed/i);
    });

    test('should return 400 if groupType or groupId is missing', async () => {
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({
          // Missing groupType and groupId
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide groupType and groupId/i);
    });

    test('should handle pagination correctly', async () => {
      // Create several messages for testing pagination
      for (let i = 0; i < 10; i++) {
        await Message.create({
          sender: student._id,
          groupType: 'Department',
          groupId: department._id,
          content: `Pagination test message ${i}`
        });
      }
      
      // Get first page with 5 items per page
      const res = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({
          groupType: 'Department',
          groupId: department._id.toString(),
          page: 1,
          limit: 5
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.messages.length).toBe(5);
      if (res.body.hasOwnProperty('page')) {
        expect(res.body.page).toBe(1);
      }
      if (res.body.hasOwnProperty('pages')) {
        expect(res.body.pages).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
