const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, checkConnectionStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const path = require('path');
const logRoutes = require('./utils/routeLogger'); // Import route logger at the top of the file

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const app = express();

// Middleware
app.use(express.json());

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://campus-connect-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization']
}));

// Handle OPTIONS requests
app.options('*', cors());

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
apiRouter.use('/assignments', require('./routes/assignmentRoutes'));
apiRouter.use('/attendance', require('./routes/attendanceRoutes'));
apiRouter.use('/submissions', require('./routes/submissionRoutes'));
apiRouter.use('/grading', require('./routes/gradingRoutes'));
apiRouter.use('/queries', require('./routes/queryRoutes'));
apiRouter.use('/announcements', require('./routes/announcementRoutes'));

// Debug endpoint to check available routes
apiRouter.get('/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const path = middleware.regexp.source === "^\\/?(?=\\/|$)"
            ? route.path
            : middleware.regexp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "") + route.path;
          routes.push(path);
        }
      });
    }
  });
  
  res.json({
    availableRoutes: routes
  });
});

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
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      
      // Log all routes after server starts
      logRoutes(app);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
    
    return server;
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};f (process.env.NODE_ENV !== 'test') {
  startServer();
// Only start server automatically when not in test environment
}
d startServer for testing
// Export both app and startServer for testing// Using module.exports directly instead of object syntax for backwards compatibility



module.exports = app;// Using module.exports directly instead of object syntax for backwards compatibilitymodule.exports = app;
