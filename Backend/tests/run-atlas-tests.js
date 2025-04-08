// Script to run tests with MongoDB Atlas connection
const { execSync } = require('child_process');
const path = require('path');

// Set environment variables for MongoDB Atlas
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb+srv://santhosh:TESLA369@cluster0.z6woa.mongodb.net/campusconnect-test?retryWrites=true&w=majority';

console.log('Running tests with MongoDB Atlas...');
console.log(`Using database: ${process.env.MONGODB_URI}`);

try {
  // Use execSync with properly escaped MongoDB URI
  execSync(
    'jest --runInBand --detectOpenHandles --forceExit --verbose',
    {
      stdio: 'inherit',
      env: process.env
    }
  );
} catch (error) {
  console.error('Test execution failed:', error);
  process.exit(1);
}
