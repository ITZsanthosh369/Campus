const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { createTestUser, createTestDepartment, createTestClassGroup, cleanupTestData, getTestCourseGroupModel, getTestQueryModel } = require('./testUtils');
const generateToken = require('../utils/generateToken');
const fs = require('fs');
const path = require('path');

// Global timeout for all tests in this file
jest.setTimeout(30000);

let facultyToken, facultyId;
let courseId, classGroupId, queryId, assignmentId, submissionId;
let studentId;

// Setup before all tests
beforeAll(async () => {
  // Create a faculty user for testing
  const faculty = await createTestUser('faculty');
  facultyId = faculty._id;
  facultyToken = generateToken(faculty._id.toString());
  
  // Create a student for testing relationships
  const student = await createTestUser('student');
  studentId = student._id;

  // Create a department and add faculty to it
  const department = await createTestDepartment();
  department.faculties.push(faculty._id);
  await department.save();
  
  // Create a class group and set faculty as tutor
  const classGroup = await createTestClassGroup(department._id);
  classGroup.tutor = faculty._id;
  classGroup.students.push(student._id);
  await classGroup.save();
  classGroupId = classGroup._id;
  
  // Create a course group with faculty assigned
  const CourseGroup = getTestCourseGroupModel();
  
  const courseGroup = await CourseGroup.create({
    courseCode: 'TEST101',
    courseName: 'Test Course',
    semester: 1,
    faculty: faculty._id,
    classGroup: classGroup._id,
    students: [student._id]
  });
  courseId = courseGroup._id;
  
  // Create a query from student to faculty
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
    courseId: courseGroup._id,
    courseName: 'Test Course',
    studentId: student._id,
    studentName: 'Test Student',
    facultyId: faculty._id,
    subject: 'Test Query Subject',
    message: 'This is a test query message',
    status: 'pending'
  });
  queryId = query._id;
  
  // Create an assignment by the faculty
  const Assignment = mongoose.model('Assignment', new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    courseId: { type: mongoose.Schema.Types.ObjectId },
    courseName: String,
    maxMarks: Number,
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }));
  
  const assignment = await Assignment.create({
    title: 'Test Assignment',
    description: 'This is a test assignment',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    courseId: courseGroup._id,
    courseName: 'Test Course',
    maxMarks: 100,
    facultyId: faculty._id
  });
  assignmentId = assignment._id;
  
  // Create a submission by the student
  const Submission = mongoose.model('Submission', new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: String,
    submissionTitle: String,
    submissionText: String,
    attachmentUrl: String,
    createdAt: { type: Date, default: Date.now }
  }));
  
  const submission = await Submission.create({
    assignmentId: assignment._id,
    studentId: student._id,
    studentName: 'Test Student',
    submissionTitle: 'Test Submission',
    submissionText: 'This is a test submission.',
    attachmentUrl: ''
  });
  submissionId = submission._id;
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Faculty API Routes', () => {
  describe('GET /api/v1/users/my-classes', () => {
    test('should return faculty classes with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/my-classes')
        .set('Authorization', `Bearer ${facultyToken}`);

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
  });

  describe('POST /api/v1/announcements', () => {
    test('should create announcement with valid data', async () => {
      const announcementData = {
        title: 'Test Announcement',
        content: 'This is a test announcement',
        targetGroups: [courseId.toString()],
        targetType: 'course',
        isPinned: false
      };

      const res = await request(app)
        .post('/api/v1/announcements')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(announcementData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('announcement');
      expect(res.body.announcement.title).toBe(announcementData.title);
    });

    test('should return 400 when required fields are missing', async () => {
      const invalidData = {
        // Missing title and content
        targetGroups: [courseId.toString()],
        targetType: 'course'
      };

      const res = await request(app)
        .post('/api/v1/announcements')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide title and content/i);
    });
  });

  describe('POST /api/v1/announcements/circulars', () => {
    test('should upload circular with valid data', async () => {
      // Create a temporary test file
      const testFilePath = path.join(__dirname, 'test-circular.pdf');
      fs.writeFileSync(testFilePath, 'Test file content');

      const res = await request(app)
        .post('/api/v1/announcements/circulars')
        .set('Authorization', `Bearer ${facultyToken}`)
        .field('title', 'Test Circular')
        .field('description', 'This is a test circular')
        .field('targetRoles', 'student')
        .field('targetDepartments', JSON.stringify(['Computer Science']))
        .attach('file', testFilePath);

      // Clean up the test file
      fs.unlinkSync(testFilePath);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('circular');
      expect(res.body.circular.title).toBe('Test Circular');
    });

    test('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/announcements/circulars')
        .set('Authorization', `Bearer ${facultyToken}`)
        .field('description', 'This is a test circular')
        // Missing title and file

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide title and file/i);
    });
  });

  describe('GET /api/v1/users/queries', () => {
    test('should return queries assigned to faculty', async () => {
      const res = await request(app)
        .get('/api/v1/users/queries')
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('queries');
      expect(Array.isArray(res.body.queries)).toBe(true);
    });

    test('should filter queries by courseId', async () => {
      const res = await request(app)
        .get(`/api/v1/users/queries?courseId=${courseId}`)
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('queries');
    });
  });

  describe('PATCH /api/v1/queries/:id', () => {
    test('should respond to a query', async () => {
      const responseData = {
        response: 'This is a test response',
        status: 'answered'
      };

      const res = await request(app)
        .patch(`/api/v1/queries/${queryId}`)
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(responseData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('query');
      expect(res.body.query.response).toBe(responseData.response);
      expect(res.body.query.status).toBe(responseData.status);
    });

    test('should not allow unauthorized users to respond', async () => {
      // Create a student token
      const student = await createTestUser('student');
      const studentToken = generateToken(student._id.toString());

      const responseData = {
        response: 'Unauthorized response',
        status: 'answered'
      };

      const res = await request(app)
        .patch(`/api/v1/queries/${queryId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(responseData);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  describe('POST /api/v1/assignments', () => {
    test('should create assignment with valid data', async () => {
      const assignmentData = {
        title: 'New Test Assignment',
        description: 'This is another test assignment',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        courseId: courseId.toString(),
        maxMarks: 50
      };

      const res = await request(app)
        .post('/api/v1/assignments')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(assignmentData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('assignment');
      expect(res.body.assignment.title).toBe(assignmentData.title);
    });

    test('should return 400 when required fields are missing', async () => {
      const invalidData = {
        description: 'This is an invalid assignment',
        // Missing title, dueDate, courseId
      };

      const res = await request(app)
        .post('/api/v1/assignments')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide title, course ID, and due date/i);
    });
  });

  describe('GET /api/v1/submissions', () => {
    test('should return submissions for an assignment', async () => {
      const res = await request(app)
        .get(`/api/v1/submissions?assignmentId=${assignmentId}`)
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('submissions');
      expect(Array.isArray(res.body.submissions)).toBe(true);
    });

    test('should return 400 when assignmentId is missing', async () => {
      const res = await request(app)
        .get('/api/v1/submissions')
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide assignment ID/i);
    });
  });

  describe('POST /api/v1/submissions/grade', () => {
    test('should grade a submission', async () => {
      const gradeData = {
        submissionIds: [submissionId.toString()],
        marks: 85,
        feedback: 'Good job!'
      };

      const res = await request(app)
        .post('/api/v1/submissions/grade')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(gradeData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('gradedSubmissions');
      expect(Array.isArray(res.body.gradedSubmissions)).toBe(true);
    });

    test('should return 400 when submission IDs are missing', async () => {
      const invalidData = {
        marks: 90,
        feedback: 'Good work!'
      };

      const res = await request(app)
        .post('/api/v1/submissions/grade')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide submission IDs/i);
    });
  });

  describe('POST /api/v1/attendance', () => {
    test('should mark attendance for a class', async () => {
      const attendanceData = {
        courseId: courseId.toString(),
        date: new Date(),
        presentStudents: [
          { id: studentId.toString(), name: 'Test Student' }
        ],
        absentStudents: []
      };

      const res = await request(app)
        .post('/api/v1/attendance')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(attendanceData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('attendance');
      expect(res.body.attendance.presentStudents.length).toBe(1);
    });

    test('should return 400 when courseId is missing', async () => {
      const invalidData = {
        date: new Date(),
        presentStudents: [
          { id: studentId.toString(), name: 'Test Student' }
        ],
        absentStudents: []
      };

      const res = await request(app)
        .post('/api/v1/attendance')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide course ID and attendance data/i);
    });
  });

  describe('GET /api/v1/attendance', () => {
    test('should return attendance records for a course', async () => {
      const res = await request(app)
        .get(`/api/v1/attendance?courseId=${courseId}`)
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('attendance');
      expect(Array.isArray(res.body.attendance)).toBe(true);
    });

    test('should return 400 when courseId is missing', async () => {
      const res = await request(app)
        .get('/api/v1/attendance')
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/provide course ID/i);
    });
  });

  describe('GET /api/v1/users/activities', () => {
    test('should return faculty activities', async () => {
      const res = await request(app)
        .get('/api/v1/users/activities')
        .set('Authorization', `Bearer ${facultyToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('activities');
      expect(Array.isArray(res.body.activities)).toBe(true);
    });
  });
});
