// Global Jest configuration for tests
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Store MongoDB memory server instance globally
let mongoServer;

// Increase default timeout for all tests to 60 seconds
jest.setTimeout(60000);

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Connect to the database before all tests
beforeAll(async () => {
  let uri = process.env.MONGODB_URI;
  
  // Only create a memory server if not connecting to an external MongoDB
  if (!uri || uri.includes('mongodb+srv')) {
    // Using an external MongoDB (like Atlas)
    console.log('Using external MongoDB:', uri);
  } else {
    // Create an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    console.log('MongoDB Memory Server Started:', uri);
  }
  
  // Connection options for tests
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: true,
    maxPoolSize: 10
  };
  
  // Connect to the database (memory or external)
  await mongoose.connect(uri, mongooseOpts);
  console.log(`Connected to MongoDB at: ${uri}`);
  
  // Make connection available globally for tests
  global.__MONGO_URI__ = uri;
  global.__MONGO_CONNECTION__ = mongoose.connection;
});

// Clear all test data between tests
afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Warning: MongoDB not connected during cleanup');
    return;
  }
  
  const collections = mongoose.connection.collections;
  try {
    const deletePromises = [];
    for (const key in collections) {
      deletePromises.push(collections[key].deleteMany({}));
    }
    
    await Promise.all(deletePromises);
    console.log('Test data cleared');
  } catch (error) {
    console.error('Error clearing test data:', error);
  }
});

// Disconnect and stop MongoDB server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
});
