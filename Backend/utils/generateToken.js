const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

/**
 * Generate JWT token for authentication
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, keys.jwtSecret, {
    expiresIn: '7d', // Changed from 30d to 7d as per requirements
  });
};

module.exports = generateToken;
