import app from './app';
import { config } from './config/env';
import connectDB from './config/database';
import initializeFirebase from './config/firebase';

const startServer = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
