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

module.exports = {
  setupTestDB,
  createTestUser,
  createTestDepartment,
  createTestClassGroup,
  cleanupTestData
};
