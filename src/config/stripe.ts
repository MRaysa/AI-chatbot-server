import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export const STRIPE_PLANS = {
  pro: {
    name: 'Pro',
    price: 1900, // $19.00 in cents
    currency: 'usd',
    interval: 'month' as Stripe.Price.Recurring.Interval,
    features: [
      'Unlimited messages',
      'Advanced AI model (GPT-4)',
      'Priority response time',
      'Email support',
      'Custom instructions',
      'Chat history export',
      'API access',
    ],
  },
  team: {
    name: 'Team',
    price: 4900, // $49.00 in cents
    currency: 'usd',
    interval: 'month' as Stripe.Price.Recurring.Interval,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared chat workspaces',
      'Admin dashboard',
      'Priority support',
      'Custom AI training',
      'Advanced analytics',
      'SSO integration',
    ],
  },
};
