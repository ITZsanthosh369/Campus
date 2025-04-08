const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Don't attempt to connect if we're in test environment and already connected
    if (process.env.NODE_ENV === 'test' && mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up event listeners for connection status changes
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

// Function to check connection status
const checkConnectionStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    state: states[state] || 'unknown',
    connected: state === 1,
    dbName: mongoose.connection.name || 'none'
  };
};

module.exports = {
  connectDB,
  checkConnectionStatus
};
