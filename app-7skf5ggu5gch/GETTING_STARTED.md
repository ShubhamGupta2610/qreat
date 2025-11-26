# Getting Started with RQEAT

This guide will help you get RQEAT up and running quickly.

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Stripe (Required)

The payment system requires a Stripe secret key. Follow these steps:

1. **Get your Stripe key**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Sign in or create an account
   - Copy your **Secret key** (starts with `sk_test_`)

2. **Add to Supabase**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to your project → **Edge Functions** → **Secrets**
   - Add a new secret:
     - Name: `STRIPE_SECRET_KEY`
     - Value: Your Stripe secret key

### Step 3: Start the Application
```bash
npm run dev -- --host 127.0.0.1
```

### Step 4: Create Your Admin Account

1. Open the application in your browser
2. Click **Sign In** → **Sign up**
3. Create your account (first user becomes admin automatically)
4. You now have full access to the admin dashboard!

## ✅ Verify Everything Works

### Test Customer Flow
1. **Browse Menu**: Navigate to the Menu page
2. **Add to Cart**: Add a few items
3. **Checkout**: Proceed to checkout
4. **Test Payment**: Use test card `4242 4242 4242 4242`
5. **Track Order**: View your order in "My Orders"

### Test Admin Features
1. **Access Dashboard**: Click your profile → Admin Dashboard
2. **View Statistics**: See orders, customers, revenue
3. **Manage Menu**: Try adding a new menu item
4. **Update Order**: Change an order status
5. **View Customers**: Check customer spending

## 📋 What's Pre-Configured

✅ **Database**: Supabase with all tables and policies  
✅ **Authentication**: Username/password login system  
✅ **Sample Data**: 12 menu items across 4 categories  
✅ **Discounts**: 4 loyalty reward tiers (5%, 10%, 15%, 20%)  
✅ **Payment**: Stripe integration (needs your key)  
✅ **UI**: Warm, cozy design with responsive layout  

## 🎨 Customization

### Replace Sample Menu Items

1. Go to **Admin Dashboard** → **Menu Management**
2. Delete sample items or edit them with your actual menu
3. Upload your own food images
4. Set your prices

### Customize Discount Tiers

1. Go to **Admin Dashboard** → **Discount Management**
2. Edit existing tiers or create new ones
3. Set minimum spending and discount percentages
4. Activate/deactivate as needed

### Update Branding

The application uses a warm color palette:
- Primary: Soft brown (#8B7355)
- Background: Cream (#F5E6D3)
- Accent: Warm orange (#E67E22)

To customize colors, edit `src/index.css` and `tailwind.config.mjs`.

## 📚 Next Steps

### For Production Use

1. **Replace Sample Data**:
   - Add your actual menu items
   - Upload real food photos
   - Set correct prices

2. **Configure Stripe for Live Mode**:
   - Get your live Stripe key (starts with `sk_live_`)
   - Update the secret in Supabase
   - Test with real payments

3. **Customize Settings**:
   - Adjust discount tiers for your business
   - Update restaurant information
   - Configure order statuses

4. **Test Thoroughly**:
   - Complete several test orders
   - Verify payment processing
   - Check order status updates
   - Test admin functions

### Learn More

- **USER_GUIDE.md**: Comprehensive guide for customers and admins
- **STRIPE_SETUP.md**: Detailed Stripe configuration
- **SAMPLE_DATA_INFO.md**: Information about pre-loaded data
- **README.md**: Full project documentation

## 🆘 Troubleshooting

### Payment Not Working?
- Verify `STRIPE_SECRET_KEY` is set in Supabase Edge Functions
- Check you're using a valid test card number
- Look for errors in the browser console

### Can't Login?
- Verify username and password are correct
- Check that you've created an account
- Try signing up again if needed

### Sample Data Not Showing?
- Refresh the page
- Check the Menu page
- Verify database migrations ran successfully

### Admin Dashboard Not Accessible?
- Ensure you're the first registered user
- Check your profile role in the database
- Try logging out and back in

## 💡 Tips

- **First User = Admin**: The first person to register gets admin access
- **Test Cards**: Use `4242 4242 4242 4242` for successful test payments
- **Loyalty Rewards**: Discounts apply automatically based on spending
- **Order Status**: Update order status from the admin dashboard
- **AI Assistant**: Use it to help customers with menu questions

## 🎯 Success Checklist

- [ ] Dependencies installed
- [ ] Stripe secret key configured
- [ ] Application running locally
- [ ] Admin account created
- [ ] Test order completed successfully
- [ ] Admin dashboard accessible
- [ ] Sample data reviewed
- [ ] Ready to customize!

---

**Need Help?** Check the documentation files or review the code comments for guidance.

**Ready to Launch?** Follow the production checklist in the README.md file.

🎉 **Congratulations!** You're all set to start using RQEAT!
