import { Router, type Request, type Response } from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import userRoutes from './user.routes';
import stripeRoutes from './stripe.routes';

const router: Router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Chat routes
router.use('/chats', chatRoutes);

// User routes
router.use('/users', userRoutes);

// Stripe routes
router.use('/stripe', stripeRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Chat Boot API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
