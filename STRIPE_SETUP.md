# Stripe Integration Setup Guide

## Environment Variables Required

Add these environment variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Client URL (for redirects)
CLIENT_URL=http://localhost:3000
```

## Stripe Dashboard Setup

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Switch to test mode for development

### 2. Get Your API Keys
- Go to Developers → API keys in your Stripe dashboard
- Copy your **Publishable key** and **Secret key**
- Add them to your `.env` file

### 3. Create a Product and Price
- Go to Products in your Stripe dashboard
- Create a new product called "Tech Pulse Pro"
- Add a recurring price of $7/month
- Copy the **Price ID** (starts with `price_`)
- Update the `priceId` in `src/pages/PricingPage.tsx` to match your Price ID

### 4. Set Up Webhooks (Optional for Production)
- Go to Developers → Webhooks in your Stripe dashboard
- Add endpoint: `https://yourdomain.com/api/webhook`
- Select these events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Copy the webhook signing secret and add it to your `.env` file

## Testing the Integration

### 1. Test Cards
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### 2. Test the Flow
1. Start your development server
2. Navigate to `/pricing`
3. Click "Subscribe to Pro"
4. Use a test card to complete payment
5. You should be redirected to `/success` or `/cancel`

## Production Deployment

### 1. Switch to Live Mode
- In your Stripe dashboard, switch from test to live mode
- Update your environment variables with live keys
- Update the Price ID to your live Price ID

### 2. Update Client URL
- Set `CLIENT_URL` to your production domain
- Update webhook endpoint to your production URL

### 3. Database Integration
The current implementation logs events to console. For production, you should:
- Update user subscription status in your database
- Send confirmation emails
- Handle subscription lifecycle events

## Security Notes

- Never expose your Stripe secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Add rate limiting to your API endpoints

## Troubleshooting

### Common Issues:
1. **"Invalid API key"** - Check your Stripe secret key
2. **"Price not found"** - Verify your Price ID in the pricing page
3. **Webhook errors** - Check webhook endpoint URL and secret
4. **CORS errors** - Ensure your server CORS settings include your client URL

### Debug Mode:
Add this to your server to see detailed Stripe logs:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});
``` 