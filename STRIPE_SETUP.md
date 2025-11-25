# Stripe Payment Setup Guide

## Overview
RQEAT uses Stripe for secure payment processing. To enable payment functionality, you need to configure your Stripe API keys.

## Setup Instructions

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create a Stripe account
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

### 2. Configure Environment Variables

You need to add your Stripe secret key to the Supabase Edge Functions environment:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Secrets**
3. Add a new secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (e.g., `sk_test_...`)

**Option B: Using Supabase CLI** (if you have it installed)
```bash
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### 3. Test the Payment Flow

1. **Register an Account**: Create a new account on the website (first user becomes admin)
2. **Browse Menu**: Add items to your cart
3. **Checkout**: Proceed to checkout and click "Pay with Stripe"
4. **Test Payment**: Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date, any 3-digit CVC, and any ZIP code

### 4. Verify Payment

After successful payment:
- You'll be redirected to the payment success page
- Your order status will be updated to "Received"
- Your total spending will be updated in your profile
- Applicable discounts will be calculated for future orders

## Important Notes

⚠️ **Security**: Never commit your Stripe secret key to version control or share it publicly.

💡 **Test Mode**: Use test API keys (starting with `sk_test_`) during development. Switch to live keys (starting with `sk_live_`) only when ready for production.

📊 **Monitoring**: Check your Stripe Dashboard to monitor payments, refunds, and customer data.

## Discount System

The system automatically applies discounts based on customer spending:
- **Bronze Tier**: 5% off for customers who spent $50+
- **Silver Tier**: 10% off for customers who spent $100+
- **Gold Tier**: 15% off for customers who spent $200+
- **Platinum Tier**: 20% off for customers who spent $500+

Discounts are automatically calculated and applied at checkout.

## Troubleshooting

### Payment Not Processing
- Verify your `STRIPE_SECRET_KEY` is correctly set in Supabase Edge Functions
- Check the browser console for error messages
- Ensure you're using valid test card numbers

### Discount Not Applied
- Verify the customer has sufficient total spending
- Check the discount configuration in Admin Dashboard → Discount Management
- Ensure discounts are marked as "Active"

### Order Status Not Updating
- Check the payment verification in the Payment Success page
- Verify the Edge Functions are deployed correctly
- Check Supabase logs for any errors

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For application issues:
- Check the browser console for errors
- Review Supabase Edge Function logs
- Verify database permissions and RLS policies
