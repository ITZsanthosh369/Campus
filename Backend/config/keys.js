/**
 * Centralized configuration keys
 * All environment variables and important configuration should be accessed from here
 */

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoURI: process.env.MONGODB_URI,
  
  // Authentication
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '7d', // Changed from 30d to 7d as per requirements
};
