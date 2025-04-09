const mongoose = require('mongoose');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const ClassGroup = require('../models/classGroupModel');

/**
 * Setup MongoDB for testing - but check if already connected first
 */
const setupTestDB = async () => {
  // Skip connection if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return mongoose.connection;
  }

  // Use in-memory MongoDB server
  if (process.env.MONGODB_MEMORY_SERVER === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    console.log('Using MongoDB Memory Server:', uri);
  } else {
    console.log('Using MongoDB URI:', process.env.MONGODB_URI);
  }

  // Connect with optimized settings
  return await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 75000
  });
};

/**
 * Create a test user with specified role
 */
const createTestUser = async (role = 'student') => {
  try {
    const timestamp = Date.now();
    return await User.create({
      name: `Test ${role}`,
      email: `test${role}${timestamp}@example.com`,
      password: 'password123',
      role: role,
      department: 'TestDepartment',
      classGroup: role === 'student' ? 'TestClass' : undefined,
      batch: role === 'student' ? 'TestBatch' : undefined,
      year: role === 'student' ? '2023' : undefined
    });
  } catch (error) {
    console.error(`Error creating test ${role}:`, error.message);
    throw error;
  }
};

/**
 * Create test department with HOD, faculty and students
 */
const createTestDepartment = async () => {
  try {
    const hod = await createTestUser('hod');
    const faculty = await createTestUser('faculty');
    const student = await createTestUser('student');
    
    return await Department.create({
      name: 'Test Department',
      hod: hod._id,
      faculties: [faculty._id],
      students: [student._id]
    });
  } catch (error) {
    console.error('Error creating test department:', error);
    throw error;
  }
};

/**
 * Create test class group with program coordinator, tutor and students
 */
const createTestClassGroup = async (departmentId) => {
  try {
    const programCoordinator = await createTestUser('faculty');
    const tutor = await createTestUser('faculty');
    const student = await createTestUser('student');
    
    const deptId = departmentId || new mongoose.Types.ObjectId();
    
    return await ClassGroup.create({
      name: 'Test Class',
      year: 2023,
      batch: 'A',
      tutor: tutor._id,
      programCoordinator: programCoordinator._id,
      department: deptId,
      students: [student._id]
    });
  } catch (error) {
    console.error('Error creating test class group:', error);
    throw error;
  }
};

/**
 * Clean up all test data
 * This is now handled by the jest.setup.js file, but we keep this
 * for backward compatibility with existing tests
 */
const cleanupTestData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return; // Not connected, nothing to clean
    }

    // Only delete documents, not collections
    const collections = mongoose.connection.collections;
    const cleanupPromises = [];
    
    for (const key in collections) {
      cleanupPromises.push(collections[key].deleteMany({}));
    }
    
    await Promise.all(cleanupPromises);
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
};

/**
 * Tear down the test DB
 */
const teardownTestDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error tearing down test DB:', error);
  }
};

/**
 * Helper function to safely get or create a model for testing
 * This prevents the "OverwriteModelError: Cannot overwrite model once compiled" error
 * @param {string} modelName - Name of the model
 * @param {Object} schemaDefinition - Mongoose schema definition object
 * @returns {mongoose.Model}
 */
const getOrCreateModel = (modelName, schemaDefinition) => {
  try {
    // Try to get the existing model first
    return mongoose.model(modelName);
  } catch (error) {
    // If the model doesn't exist, create it
    return mongoose.model(modelName, new mongoose.Schema(schemaDefinition));
  }
};

/**
 * Create a test course group or return existing one
 */
const getTestCourseGroupModel = () => {
  const courseGroupSchema = {
    courseCode: String,
    courseName: String,
    semester: Number,
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    classGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassGroup' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  };
  
  return getOrCreateModel('CourseGroup', courseGroupSchema);
};

/**
 * Create a test query model or return existing one
 */
const getTestQueryModel = () => {
  const querySchema = {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseGroup' },
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
  };
  
  return getOrCreateModel('Query', querySchema);
};

module.exports = {
  setupTestDB,
  createTestUser,
  createTestDepartment,
  createTestClassGroup,
  cleanupTestData,
  getOrCreateModel,
  getTestCourseGroupModel,
  getTestQueryModel,
  
  /**
   * Create test activity data for student dashboard
   */
  createTestActivities: (userId, count = 5) => {
    const activities = [];
    const types = ['assignment_submission', 'quiz_completion', 'course_enrollment', 'announcement_read', 'class_attendance'];
    const courses = ['Introduction to Programming', 'Data Structures', 'Database Systems', 'Web Development', 'Algorithms'];
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random day in the last week
      
      activities.push({
        _id: new mongoose.Types.ObjectId(),
        userId,
        type: types[Math.floor(Math.random() * types.length)],
        courseName: courses[Math.floor(Math.random() * courses.length)],
        description: `Activity ${i+1} description text`,
        date: date,
        status: Math.random() > 0.3 ? 'completed' : 'pending'
      });
    }
    
    return activities;
  }
};
