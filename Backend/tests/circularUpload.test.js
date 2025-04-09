const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('../server');
const { createTestUser, cleanupTestData } = require('./testUtils');
const generateToken = require('../utils/generateToken');

jest.setTimeout(30000);

let facultyToken, hodToken, principalToken;
let testFilePath;

beforeAll(async () => {
  // Create users with different roles
  const faculty = await createTestUser('faculty');
  const hod = await createTestUser('hod');
  const principal = await createTestUser('principal');
  
  facultyToken = generateToken(faculty._id.toString());
  hodToken = generateToken(hod._id.toString());
  principalToken = generateToken(principal._id.toString());

  // Create a test PDF file for uploads
  testFilePath = path.join(__dirname, 'test-circular.pdf');
  fs.writeFileSync(testFilePath, 'Test PDF content for circular testing');
});

afterAll(async () => {
  // Clean up the test file
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
  
  await cleanupTestData();
});

// Make sure the authorization token is properly set
beforeEach(async () => {
  // Add logging to verify token generation
  console.log('Faculty token for test:', facultyToken);
});

describe('Circular Upload Tests', () => {
  test('Faculty can upload a circular', async () => {
    // Make sure the Authorization header is correctly formatted
    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${facultyToken}`) // Double check token format
      .field('title', 'Faculty Circular')
      .field('description', 'Important notice for students')
      .field('targetRoles', 'student')
      .attach('file', testFilePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.circular.title).toBe('Faculty Circular');
    expect(res.body.circular).toHaveProperty('fileUrl');
  });

  test('HOD can upload a circular to multiple departments', async () => {
    const targetDepartments = ['Computer Science', 'Electrical Engineering'];
    
    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${hodToken}`)
      .field('title', 'HOD Circular')
      .field('description', 'Important notice from HOD')
      .field('targetRoles', 'all')
      .field('targetDepartments', JSON.stringify(targetDepartments))
      .attach('file', testFilePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.circular.title).toBe('HOD Circular');
    expect(res.body.circular.targetDepartments).toEqual(expect.arrayContaining(targetDepartments));
  });

  test('Principal can upload a circular to all departments', async () => {
    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${principalToken}`)
      .field('title', 'Principal Circular')
      .field('description', 'Important notice from Principal')
      .field('targetRoles', 'all')
      .attach('file', testFilePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.circular.title).toBe('Principal Circular');
  });

  test('Cannot upload circular without title', async () => {
    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${facultyToken}`)
      .field('description', 'Missing title circular')
      .field('targetRoles', 'student')
      .attach('file', testFilePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/title/i);
  });

  test('Cannot upload circular without file', async () => {
    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${facultyToken}`)
      .field('title', 'Missing File Circular')
      .field('description', 'No file attached')
      .field('targetRoles', 'student');
      // No file attached

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/file/i);
  });

  test('Cannot upload circular with invalid file type', async () => {
    // Create a test file with invalid extension
    const invalidFilePath = path.join(__dirname, 'invalid-file.exe');
    fs.writeFileSync(invalidFilePath, 'Invalid file content');

    const res = await request(app)
      .post('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${facultyToken}`)
      .field('title', 'Invalid File Type')
      .field('description', 'This file should be rejected')
      .field('targetRoles', 'student')
      .attach('file', invalidFilePath);

    // Clean up invalid file
    fs.unlinkSync(invalidFilePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/file type/i);
  });

  test('Get all circulars', async () => {
    const res = await request(app)
      .get('/api/v1/announcements/circulars')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.circulars)).toBe(true);
    expect(res.body.circulars.length).toBeGreaterThan(0);
  });

  test('Filter circulars by department', async () => {
    const res = await request(app)
      .get('/api/v1/announcements/circulars?department=Computer Science')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.circulars)).toBe(true);
  });
});
