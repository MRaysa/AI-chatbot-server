import { Request, Response } from 'express';
import { stripe, STRIPE_PLANS } from '../config/stripe';
import { ApiResponse } from '../utils/apiResponse';
import Subscription from '../models/Subscription.model';
import User from '../models/User.model';

export class StripeController {
  /**
   * @desc    Create Stripe checkout session
   * @route   POST /api/stripe/create-checkout-session
   * @access  Private
   */
  async createCheckoutSession(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;
      const { plan } = req.body;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      if (!plan || !['pro', 'team'].includes(plan)) {
        return ApiResponse.badRequest(res, 'Invalid plan selected');
      }

      const user = await User.findOne({ uid });
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }

      const planDetails = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: uid,
          },
        });
        customerId = customer.id;

        // Save Stripe customer ID to user
        await User.findOneAndUpdate({ uid }, { stripeCustomerId: customerId });
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: planDetails.currency,
              product_data: {
                name: `${planDetails.name} Plan`,
                description: `${planDetails.name} subscription - ${planDetails.features.join(', ')}`,
              },
              unit_amount: planDetails.price,
              recurring: {
                interval: planDetails.interval,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.ALLOWED_ORIGINS}/chat?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.ALLOWED_ORIGINS}/chat`,
        metadata: {
          userId: uid,
          plan,
        },
      });

      return ApiResponse.success(res, 'Checkout session created successfully', {
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error('Create checkout session error:', error);
      return ApiResponse.error(res, error.message || 'Failed to create checkout session');
    }
  }

  /**
   * @desc    Handle Stripe webhook events
   * @route   POST /api/stripe/webhook
   * @access  Public (but verified by Stripe signature)
   */
  async handleWebhook(req: Request, res: Response): Promise<Response> {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return ApiResponse.badRequest(res, 'Missing stripe-signature header');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          await this.handleCheckoutSessionCompleted(session);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          await this.handleSubscriptionUpdated(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          await this.handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          await this.handlePaymentFailed(invoice);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      return ApiResponse.error(res, `Webhook Error: ${error.message}`);
    }
  }

  /**
   * @desc    Get user subscription status
   * @route   GET /api/stripe/subscription
   * @access  Private
   */
  async getSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const subscription = await Subscription.findOne({ userId: uid });

      if (!subscription) {
        return ApiResponse.success(res, 'No active subscription', {
          subscription: {
            plan: 'free',
            status: 'active',
          },
        });
      }

      return ApiResponse.success(res, 'Subscription retrieved successfully', {
        subscription: {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        },
      });
    } catch (error: any) {
      console.error('Get subscription error:', error);
      return ApiResponse.error(res, error.message || 'Failed to get subscription');
    }
  }

  /**
   * @desc    Cancel subscription
   * @route   POST /api/stripe/cancel-subscription
   * @access  Private
   */
  async cancelSubscription(req: Request, res: Response): Promise<Response> {
    try {
      const uid = (req as any).user?.uid;

      if (!uid) {
        return ApiResponse.unauthorized(res, 'User not authenticated');
      }

      const subscription = await Subscription.findOne({ userId: uid });

      if (!subscription) {
        return ApiResponse.notFound(res, 'No active subscription found');
      }

      // Cancel at period end (don't cancel immediately)
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      subscription.cancelAtPeriodEnd = true;
      await subscription.save();

      return ApiResponse.success(res, 'Subscription will be canceled at period end', {
        subscription: {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: true,
        },
      });
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      return ApiResponse.error(res, error.message || 'Failed to cancel subscription');
    }
  }

  // Private helper methods

  private async handleCheckoutSessionCompleted(session: any) {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;
    const subscriptionId = session.subscription;

    // Retrieve subscription details from Stripe
    const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

    // Create subscription record in database
    await Subscription.create({
      userId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      plan,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    console.log(`Subscription created for user ${userId} with plan ${plan}`);
  }

  private async handleSubscriptionUpdated(subscription: any) {
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    );

    console.log(`Subscription ${subscription.id} updated`);
  }

  private async handleSubscriptionDeleted(subscription: any) {
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        status: 'canceled',
      }
    );

    console.log(`Subscription ${subscription.id} deleted`);
  }

  private async handlePaymentFailed(invoice: any) {
    const subscriptionId = invoice.subscription;

    if (subscriptionId) {
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionId },
        {
          status: 'past_due',
        }
      );

      console.log(`Payment failed for subscription ${subscriptionId}`);
    }
  }
}

export default new StripeController();
