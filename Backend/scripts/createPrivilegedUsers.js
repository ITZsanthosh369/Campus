require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/userModel');
const path = require('path');

/**
 * Script to create privileged users (HOD and Principal)
 */
async function createPrivilegedUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug log to check if env variable is loaded
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');

    // Check if users already exist
    const hodExists = await User.findOne({ email: 'hod@campusconnect.com' });
    const principalExists = await User.findOne({ email: 'principal@campusconnect.com' });

    // Create HOD user if it doesn't exist
    if (!hodExists) {
      const hod = await User.create({
        name: 'Dr. HOD',
        email: 'hod@campusconnect.com',
        password: 'admin123', // Will be hashed automatically by the User model pre-save hook
        role: 'hod',
        department: 'CSE',
      });
      console.log('HOD user created successfully:', hod.name);
    } else {
      console.log('HOD user already exists, skipping creation');
    }

    // Create Principal user if it doesn't exist
    if (!principalExists) {
      const principal = await User.create({
        name: 'Dr. Principal',
        email: 'principal@campusconnect.com',
        password: 'admin123', // Will be hashed automatically by the User model pre-save hook
        role: 'principal',
        department: 'Administration',
      });
      console.log('Principal user created successfully:', principal.name);
    } else {
      console.log('Principal user already exists, skipping creation');
    }

    // Create Student user for testing
    const studentExists = await User.findOne({ email: 'student@campusconnect.com' });
    
    if (!studentExists) {
      const student = await User.create({
        name: 'Test Student',
        email: 'student@campusconnect.com',
        password: 'student123', // Will be hashed automatically by the User model pre-save hook
        role: 'student',
        department: 'CSE',
        classGroup: 'CSE-2023',
        batch: 'A',
        year: '2'
      });
      console.log('Student user created successfully:', student.name);
    } else {
      console.log('Student user already exists, skipping creation');
    }

    // Create Faculty user for testing
    const facultyExists = await User.findOne({ email: 'faculty@campusconnect.com' });
    
    if (!facultyExists) {
      const faculty = await User.create({
        name: 'Test Faculty',
        email: 'faculty@campusconnect.com',
        password: 'faculty123', // Will be hashed automatically by the User model pre-save hook
        role: 'faculty',
        department: 'CSE',
      });
      console.log('Faculty user created successfully:', faculty.name);
    } else {
      console.log('Faculty user already exists, skipping creation');
    }

    console.log('All privileged users created successfully!');

  } catch (error) {
    console.error('Error creating privileged users:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createPrivilegedUsers();
