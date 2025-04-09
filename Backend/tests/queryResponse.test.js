const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { createTestUser, cleanupTestData, getTestCourseGroupModel, getTestQueryModel } = require('./testUtils');
const generateToken = require('../utils/generateToken');

jest.setTimeout(30000);

let facultyToken, studentToken;
let faculty, student;
let queryId;

beforeAll(async () => {
  // Create users
  faculty = await createTestUser('faculty');
  student = await createTestUser('student');
  facultyToken = generateToken(faculty._id.toString());
  studentToken = generateToken(student._id.toString());

  // Create course for the context
  const CourseGroup = getTestCourseGroupModel();

  const course = await CourseGroup.create({
    courseCode: 'CSE101',
    courseName: 'Introduction to Programming',
    faculty: faculty._id,
    students: [student._id]
  });

  // Create a query from the student to the faculty
  const Query = mongoose.model('Query', new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId },
    courseName: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: String,
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    message: String,
    status: { type: String, default: 'pending' },
    response: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }));

  const query = await Query.create({
    courseId: course._id,
    courseName: 'Introduction to Programming',
    studentId: student._id,
    studentName: 'Test Student',
    facultyId: faculty._id,
    subject: 'Question about Assignment',
    message: 'I need clarification on problem 3.',
    status: 'pending'
  });

  queryId = query._id;
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Query Response Workflow', () => {
  test('Faculty can see student query', async () => {
    const res = await request(app)
      .get('/api/v1/users/queries')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.queries.some(q => q._id.toString() === queryId.toString())).toBe(true);
  });

  test('Faculty can respond to the query', async () => {
    const responseData = {
      response: 'For problem 3, you need to use recursion.',
      status: 'answered'
    };

    const res = await request(app)
      .patch(`/api/v1/queries/${queryId}`)
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(responseData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.query.response).toBe(responseData.response);
    expect(res.body.query.status).toBe(responseData.status);
  });

  test('Student can see the response to their query', async () => {
    const res = await request(app)
      .get('/api/v1/queries/my-queries')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    
    const myQuery = res.body.queries.find(q => q._id.toString() === queryId.toString());
    expect(myQuery).toBeDefined();
    expect(myQuery.status).toBe('answered');
    expect(myQuery.response).toBe('For problem 3, you need to use recursion.');
  });

  test('Faculty can mark the query as closed', async () => {
    const closeData = {
      status: 'closed'
    };

    const res = await request(app)
      .patch(`/api/v1/queries/${queryId}`)
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(closeData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.query.status).toBe('closed');
  });

  test('Student cannot modify faculty response', async () => {
    const attemptData = {
      response: 'I am trying to change the response',
      status: 'pending'
    };

    const res = await request(app)
      .patch(`/api/v1/queries/${queryId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send(attemptData);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  test('Different faculty cannot respond to another faculty\'s query', async () => {
    // Create a different faculty
    const anotherFaculty = await createTestUser('faculty');
    const anotherToken = generateToken(anotherFaculty._id.toString());

    const responseData = {
      response: 'I am not the assigned faculty',
      status: 'answered'
    };

    const res = await request(app)
      .patch(`/api/v1/queries/${queryId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(responseData);

    // This should fail as the query is assigned to the original faculty
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
