/**
 * Faculty Dashboard Data Seeder
 * 
 * This script creates test data for the faculty dashboard functionality:
 * - Creates a faculty user if not exists
 * - Creates course groups and class groups
 * - Creates announcements and circulars
 * - Creates student queries
 * - Creates assignments and submissions
 * - Creates attendance records
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Backend/models/userModel');
const ClassGroup = require('../Backend/models/classGroupModel');
const CourseGroup = require('../Backend/models/courseGroupModel');
const Announcement = require('../Backend/models/announcementModel');
const Circular = require('../Backend/models/circularModel');
const Query = require('../Backend/models/queryModel');
const Assignment = require('../Backend/models/assignmentModel');
const Submission = require('../Backend/models/submissionModel');
const Attendance = require('../Backend/models/attendanceModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to seed faculty dashboard data
const seedFacultyData = async () => {
  try {
    console.log('Starting data seeding process...');

    // Create faculty user if not exists
    let faculty = await User.findOne({ email: 'faculty@test.com' });
    if (!faculty) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      faculty = await User.create({
        name: 'Test Faculty',
        email: 'faculty@test.com',
        password: hashedPassword,
        role: 'faculty',
        department: 'Computer Science',
      });
      console.log('Faculty user created');
    } else {
      console.log('Faculty user already exists, using existing user');
    }

    // Create student users if they don't exist
    let student1 = await User.findOne({ email: 'student1@test.com' });
    if (!student1) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      student1 = await User.create({
        name: 'Test Student 1',
        email: 'student1@test.com',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science',
        year: 2,
        batch: 'A',
      });
      console.log('Student user 1 created');
    }

    let student2 = await User.findOne({ email: 'student2@test.com' });
    if (!student2) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      student2 = await User.create({
        name: 'Test Student 2',
        email: 'student2@test.com',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science',
        year: 3,
        batch: 'B',
      });
      console.log('Student user 2 created');
    }

    // Create class groups
    let classGroup1 = await ClassGroup.findOne({ name: 'CS-2023-A' });
    if (!classGroup1) {
      classGroup1 = await ClassGroup.create({
        name: 'CS-2023-A',
        year: 2,
        batch: 'A',
        department: 'Computer Science',
        tutor: faculty._id,
        students: [student1._id, student2._id],
      });
      console.log('Class Group CS-2023-A created');
    }

    let classGroup2 = await ClassGroup.findOne({ name: 'CS-2022-B' });
    if (!classGroup2) {
      classGroup2 = await ClassGroup.create({
        name: 'CS-2022-B',
        year: 3,
        batch: 'B',
        department: 'Computer Science',
        tutor: faculty._id,
        students: [student2._id],
      });
      console.log('Class Group CS-2022-B created');
    }

    // Create course groups
    let courseGroup1 = await CourseGroup.findOne({ courseCode: 'CS101' });
    if (!courseGroup1) {
      courseGroup1 = await CourseGroup.create({
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        semester: 1,
        faculty: faculty._id,
        classGroup: classGroup1._id,
        students: classGroup1.students,
      });
      console.log('Course Group CS101 created');
    }

    let courseGroup2 = await CourseGroup.findOne({ courseCode: 'CS201' });
    if (!courseGroup2) {
      courseGroup2 = await CourseGroup.create({
        courseCode: 'CS201',
        courseName: 'Data Structures',
        semester: 3,
        faculty: faculty._id,
        classGroup: classGroup2._id,
        students: classGroup2.students,
      });
      console.log('Course Group CS201 created');
    }

    // Create announcements
    const announcement1Count = await Announcement.countDocuments({ title: 'Midterm Exam Schedule' });
    if (announcement1Count === 0) {
      await Announcement.create({
        title: 'Midterm Exam Schedule',
        content: 'The midterm exams will be held from October 15th to October 20th. Please check the schedule on the notice board.',
        sender: faculty._id,
        senderName: faculty.name,
        targetGroups: [courseGroup1._id],
        targetType: 'course',
      });
      console.log('Announcement 1 created');
    }

    const announcement2Count = await Announcement.countDocuments({ title: 'Project Submission Deadline' });
    if (announcement2Count === 0) {
      await Announcement.create({
        title: 'Project Submission Deadline',
        content: 'The final project must be submitted by November 30th. Late submissions will not be accepted.',
        sender: faculty._id,
        senderName: faculty.name,
        targetGroups: [courseGroup2._id],
        targetType: 'course',
      });
      console.log('Announcement 2 created');
    }

    // Create a circular (assuming you have a Circular model)
    const circular1Count = await Circular.countDocuments({ title: 'New Laboratory Rules' });
    if (circular1Count === 0) {
      await Circular.create({
        title: 'New Laboratory Rules',
        description: 'Updated safety guidelines for the computer labs',
        fileUrl: 'https://example.com/lab-rules.pdf',
        sender: faculty._id,
        senderName: faculty.name,
        targetRoles: ['student'],
        targetDepartments: ['Computer Science'],
      });
      console.log('Circular created');
    }

    // Create student queries
    const query1Count = await Query.countDocuments({ subject: 'Assignment Clarification' });
    if (query1Count === 0) {
      await Query.create({
        courseId: courseGroup1._id,
        courseName: courseGroup1.courseName,
        studentId: student1._id,
        studentName: student1.name,
        facultyId: faculty._id,
        subject: 'Assignment Clarification',
        message: 'I need clarification on question 3 of the midterm assignment.',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Query 1 created');
    }

    const query2Count = await Query.countDocuments({ subject: 'Lab Report Extension' });
    if (query2Count === 0) {
      await Query.create({
        courseId: courseGroup2._id,
        courseName: courseGroup2.courseName,
        studentId: student2._id,
        studentName: student2.name,
        facultyId: faculty._id,
        subject: 'Lab Report Extension',
        message: 'Can I have a 2-day extension for the lab report submission?',
        status: 'answered',
        response: 'Yes, you can submit by Friday.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });
      console.log('Query 2 created');
    }

    // Create assignments
    let assignment1 = await Assignment.findOne({ title: 'Programming Basics' });
    if (!assignment1) {
      assignment1 = await Assignment.create({
        title: 'Programming Basics',
        description: 'Complete the programming exercises 1-10 in Chapter 3',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        courseId: courseGroup1._id,
        courseName: courseGroup1.courseName,
        maxMarks: 20,
        createdAt: new Date(),
        facultyId: faculty._id,
      });
      console.log('Assignment 1 created');
    }

    // Create submissions
    const submission1Count = await Submission.countDocuments({ submissionTitle: 'Programming Basics - Submission' });
    if (submission1Count === 0) {
      await Submission.create({
        assignmentId: assignment1._id,
        studentId: student1._id,
        studentName: student1.name,
        submissionTitle: 'Programming Basics - Submission',
        submissionText: 'Here are my solutions for exercises 1-10',
        attachmentUrl: 'https://example.com/submission1.pdf',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
      console.log('Submission 1 created');
    }

    const submission2Count = await Submission.countDocuments({ submissionTitle: 'Programming Exercises Solution' });
    if (submission2Count === 0) {
      await Submission.create({
        assignmentId: assignment1._id,
        studentId: student2._id,
        studentName: student2.name,
        submissionTitle: 'Programming Exercises Solution',
        submissionText: 'My solutions for Chapter 3 exercises',
        attachmentUrl: 'https://example.com/submission2.pdf',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      });
      console.log('Submission 2 created');
    }

    // Create attendance record
    const attendance1Count = await Attendance.countDocuments({ courseId: courseGroup1._id.toString() });
    if (attendance1Count === 0) {
      await Attendance.create({
        courseId: courseGroup1._id,
        courseName: courseGroup1.courseName,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        presentStudents: [
          { id: student1._id, name: student1.name }
        ],
        absentStudents: [
          { id: student2._id, name: student2.name }
        ],
        markedBy: faculty._id,
        markedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      });
      console.log('Attendance record created');
    }

    console.log('Data seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
  }
};

// Run the seeder
seedFacultyData();
