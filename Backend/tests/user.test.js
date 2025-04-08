const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

let token;
let testUser;

// Use the global MongoDB connection from jest.setup.js
beforeEach(async () => {
  // Ensure we have a valid connection
  if (mongoose.connection.readyState !== 1) {
    console.log('Warning: MongoDB not connected in user.test.js');
  }
  
  // Create a test user before each test
  testUser = await User.create({
    name: 'User Profile Test',
    email: `usertest${Date.now()}@example.com`,
    password: 'password123',
    role: 'student',
    department: 'Computer Science',
    classGroup: 'CS-2023',
    batch: 'A',
    year: '2023'
  });
  
  // Generate token for authentication
  token = generateToken(testUser._id.toString());
});

describe('User Profile API', () => {
  describe('GET /api/v1/users/profile', () => {
    test('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.name).toBe(testUser.name);
      expect(res.body).not.toHaveProperty('password');
    });

    test('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });

    test('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/token failed/i);
    });
  });

  describe('PUT /api/v1/users/profile', () => {
    test('should update user profile with valid token', async () => {
      const updateData = {
        name: 'Updated Name',
        department: 'Updated Department'
      };

      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updateData.name);
      expect(res.body.department).toBe(updateData.department);
      expect(res.body).toHaveProperty('token');
    });

    test('should update password and return new token', async () => {
      const updateData = {
        password: 'newpassword123'
      };

      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      
      // Try login with new password
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'newpassword123'
        });
      
      expect(loginRes.statusCode).toBe(200);
    });

    test('should not update profile without token', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const res = await request(app)
        .put('/api/v1/users/profile')
        .send(updateData);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token provided/i);
    });
  });
});
