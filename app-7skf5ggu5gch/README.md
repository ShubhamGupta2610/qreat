# RQEAT - Online Restaurant Ordering System

## 🍽️ Project Overview

RQEAT is a comprehensive online restaurant ordering platform that enables customers to browse menus, place orders, track spending, and receive personalized loyalty discounts. The system includes an AI-powered feedback agent and a complete admin dashboard for restaurant management.

## ✨ Key Features

### Customer Features
- 🔐 **User Authentication**: Secure username/password login and registration
- 📋 **Menu Browsing**: Browse menu items by categories (Starter, Main Course, Dessert, Fast Food)
- 🔍 **Search & Filter**: Find items quickly with search and category filters
- 🛒 **Shopping Cart**: Add items with quantity management
- 💳 **Stripe Payment**: Secure payment processing with Stripe integration
- 🎁 **Loyalty Rewards**: Automatic discounts based on spending (5%, 10%, 15%, 20%)
- 📦 **Order Tracking**: Real-time order status updates (Received → Preparing → Delivered)
- 👤 **Customer Profile**: View spending history and loyalty tier progress
- 🤖 **AI Assistant**: Get menu recommendations and order assistance

### Admin Features
- 📊 **Dashboard**: View statistics (orders, customers, revenue, menu items)
- 🍴 **Menu Management**: Full CRUD operations for menu items
- 📋 **Order Management**: View and update order status
- 👥 **Customer Management**: Track customer spending and information
- 🏷️ **Discount Management**: Configure loyalty reward tiers

## 🎨 Design

The application features a warm, cozy atmosphere with:
- **Color Palette**: Soft browns (#8B7355), cream (#F5E6D3), warm orange accents (#E67E22)
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database + Authentication + Edge Functions)
- **Payment**: Stripe
- **Routing**: React Router v6

## 📁 Project Directory

```
├── README.md                    # Documentation
├── STRIPE_SETUP.md             # Stripe configuration guide
├── USER_GUIDE.md               # User manual
├── SAMPLE_DATA_INFO.md         # Sample data information
├── TODO.md                     # Implementation checklist
├── src/
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Shared components (Header, Footer)
│   │   └── ui/                 # shadcn/ui components
│   ├── contexts/               # React contexts (Cart, Auth)
│   ├── db/
│   │   ├── supabase.ts        # Supabase client
│   │   └── api.ts             # Database API functions
│   ├── pages/
│   │   ├── Home.tsx           # Landing page
│   │   ├── Menu.tsx           # Menu browsing
│   │   ├── Cart.tsx           # Shopping cart
│   │   ├── Checkout.tsx       # Checkout page
│   │   ├── Orders.tsx         # Order history
│   │   ├── Profile.tsx        # Customer profile
│   │   ├── AIAssistant.tsx    # AI chat interface
│   │   └── admin/             # Admin pages
│   ├── types/                 # TypeScript type definitions
│   └── routes.tsx             # Route configuration
├── supabase/
│   ├── migrations/            # Database migrations
│   └── functions/             # Edge Functions
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Stripe account (for payment processing)

### Installation

1. **Extract the code package**

2. **Install dependencies**
```bash
npm install
```

3. **Configure Stripe** (Required for payment functionality)
   - Follow the instructions in `STRIPE_SETUP.md`
   - Add your Stripe secret key to Supabase Edge Functions

4. **Start the development server**
```bash
npm run dev -- --host 127.0.0.1
```

5. **Access the application**
   - Open your browser and navigate to the provided local URL
   - Create an account (first user becomes admin)

## 📖 Documentation

- **STRIPE_SETUP.md**: Complete guide for configuring Stripe payment
- **USER_GUIDE.md**: Comprehensive user manual for customers and admins
- **SAMPLE_DATA_INFO.md**: Information about pre-loaded sample data
- **TODO.md**: Implementation checklist and project status

## 🎯 Quick Start Guide

### For Customers

1. **Sign Up**: Create an account with username, name, mobile, and table number
2. **Browse Menu**: Explore menu items by category
3. **Add to Cart**: Select items and quantities
4. **Checkout**: Review order and complete payment with Stripe
5. **Track Orders**: Monitor order status in "My Orders"
6. **Earn Rewards**: Automatic discounts based on spending

### For Administrators

1. **Access Admin Dashboard**: Click your profile → Admin Dashboard
2. **Manage Menu**: Add, edit, or remove menu items
3. **Process Orders**: View orders and update status
4. **View Customers**: Track customer spending and loyalty tiers
5. **Configure Discounts**: Set up loyalty reward tiers

## 💎 Loyalty Rewards System

- 🥉 **Bronze**: 5% off at $50+ total spending
- 🥈 **Silver**: 10% off at $100+ total spending
- 🥇 **Gold**: 15% off at $200+ total spending
- 💎 **Platinum**: 20% off at $500+ total spending

Discounts are automatically calculated and applied at checkout!

## 🔒 Security Features

- Secure authentication with Supabase
- Row Level Security (RLS) policies
- Encrypted payment processing with Stripe
- Protected admin routes
- Environment variable configuration

## 📊 Database Schema

- **profiles**: User information and spending tracking
- **menu_items**: Restaurant menu with categories
- **orders**: Order records with customer details
- **discounts**: Loyalty reward tier configuration

## 🧪 Testing

### Test Payment

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiry, any 3-digit CVC, any ZIP

### Sample Data

The system includes 12 sample menu items and 4 discount tiers. See `SAMPLE_DATA_INFO.md` for details.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Environment Variables

The following environment variables are pre-configured:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_APP_ID`: Application identifier

## 📝 Notes

- First registered user automatically becomes admin
- Sample menu items use placeholder images
- Stripe test mode is enabled by default
- All prices are in USD

## 🤝 Support

For detailed usage instructions:
- Check `USER_GUIDE.md` for customer and admin guides
- Review `STRIPE_SETUP.md` for payment configuration
- See `SAMPLE_DATA_INFO.md` for managing sample data

## 📄 License

This project is created with Miaoda platform.

---

**Built with ❤️ using React, TypeScript, Supabase, and Stripe**
