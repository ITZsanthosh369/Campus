const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, checkConnectionStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint to verify DB connection
app.get('/health', (req, res) => {
  const dbStatus = checkConnectionStatus();
  
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    database: dbStatus
  });
});

// API Routes with centralized base path
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

// Register routes to API router
apiRouter.use('/auth', require('./routes/authRoutes')); 
apiRouter.use('/users', require('./routes/userRoutes'));
apiRouter.use('/groups', require('./routes/groupRoutes'));
apiRouter.use('/messages', require('./routes/messageRoutes'));
apiRouter.use('/profiles', require('./routes/profileRoutes'));

// Base route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// Connect to database before starting server
const startServer = async () => {
  try {
    await connectDB();
    
    if (process.env.NODE_ENV !== 'test') {
      const server = app.listen(PORT, () => {
        const status = checkConnectionStatus();
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`MongoDB connection status: ${status.state}`);
        console.log(`Connected to database: ${status.dbName}`);
      });
      return server;
    }
    return null;
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
  }
};

// Only start server automatically when not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export both app and startServer for testing
// Using module.exports directly instead of object syntax for backwards compatibility
module.exports = app;
