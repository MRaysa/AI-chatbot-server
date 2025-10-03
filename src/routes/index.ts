import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Chat Boot API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
