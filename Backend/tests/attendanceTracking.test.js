const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { createTestUser, cleanupTestData, getTestCourseGroupModel } = require('./testUtils');
const generateToken = require('../utils/generateToken');

jest.setTimeout(30000);

let facultyToken, facultyId;
let courseId;
let students = [];
const totalStudents = 3;

beforeAll(async () => {
  // Create a faculty user
  const faculty = await createTestUser('faculty');
  facultyId = faculty._id;
  facultyToken = generateToken(faculty._id.toString());

  // Create multiple students
  for (let i = 0; i < totalStudents; i++) {
    const student = await createTestUser('student');
    students.push({
      id: student._id.toString(),
      name: `Test Student ${i + 1}`
    });
  }

  // Create a course with these students
  const CourseGroup = getTestCourseGroupModel();
  
  // Rest of the setup code remains the same
  const course = await CourseGroup.create({
    courseCode: 'MATH101',
    courseName: 'Mathematics',
    semester: 1,
    faculty: faculty._id,
    students: students.map(student => mongoose.Types.ObjectId(student.id))
  });

  courseId = course._id;
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Attendance Tracking Tests', () => {
  test('Faculty can mark attendance for all students present', async () => {
    const attendanceData = {
      courseId: courseId.toString(),
      date: new Date(),
      presentStudents: students,
      absentStudents: []
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(attendanceData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.attendance.presentStudents.length).toBe(totalStudents);
    expect(res.body.attendance.absentStudents.length).toBe(0);
  });

  test('Faculty can mark attendance with some students absent', async () => {
    // Mark first student absent, rest present
    const presentStudents = students.slice(1);
    const absentStudents = students.slice(0, 1);

    const attendanceData = {
      courseId: courseId.toString(),
      date: new Date(),
      presentStudents,
      absentStudents
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(attendanceData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.attendance.presentStudents.length).toBe(totalStudents - 1);
    expect(res.body.attendance.absentStudents.length).toBe(1);
  });

  test('Faculty can retrieve attendance records for a course', async () => {
    const res = await request(app)
      .get(`/api/v1/attendance?courseId=${courseId}`)
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.attendance)).toBe(true);
    expect(res.body.attendance.length).toBeGreaterThan(0);
  });

  test('Faculty can retrieve attendance filtered by date', async () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const res = await request(app)
      .get(`/api/v1/attendance?courseId=${courseId}&date=${today}`)
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.attendance)).toBe(true);
  });

  test('Cannot mark attendance for a course without courseId', async () => {
    const attendanceData = {
      // Missing courseId
      date: new Date(),
      presentStudents: students,
      absentStudents: []
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(attendanceData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/provide course ID/i);
  });

  test('Cannot mark attendance without presentStudents', async () => {
    const attendanceData = {
      courseId: courseId.toString(),
      date: new Date(),
      // Missing presentStudents
      absentStudents: []
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send(attendanceData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/provide.*attendance data/i);
  });

  test('Student cannot mark attendance', async () => {
    // Create a student token
    const student = await createTestUser('student');
    const studentToken = generateToken(student._id.toString());

    const attendanceData = {
      courseId: courseId.toString(),
      date: new Date(),
      presentStudents: students,
      absentStudents: []
    };

    const res = await request(app)
      .post('/api/v1/attendance')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(attendanceData);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
