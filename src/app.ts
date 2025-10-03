import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  })
);

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI Chat Boot API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
