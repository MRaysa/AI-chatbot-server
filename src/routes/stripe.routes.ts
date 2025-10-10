import { Router, type Request, type Response } from 'express';
import stripeController from '../controllers/stripe.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

// Webhook endpoint (no auth required, verified by Stripe signature)
router.post('/webhook', stripeController.handleWebhook);

// Protected routes
router.post('/create-checkout-session', authMiddleware, stripeController.createCheckoutSession);
router.get('/subscription', authMiddleware, stripeController.getSubscription);
router.post('/cancel-subscription', authMiddleware, stripeController.cancelSubscription);

export default router;
