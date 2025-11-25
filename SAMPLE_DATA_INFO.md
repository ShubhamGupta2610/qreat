# Sample Data Information

## Overview
The RQEAT system has been initialized with sample data to demonstrate the full functionality of the restaurant ordering platform. This data can be managed through the admin dashboard.

## Sample Menu Items

The following menu items have been added to showcase the menu browsing and ordering features:

### Starters (3 items)
1. **Caesar Salad** - $8.99
   - Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing

2. **Bruschetta** - $7.50
   - Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil

3. **Chicken Wings** - $9.99
   - Crispy fried chicken wings with your choice of sauce

### Main Courses (3 items)
1. **Grilled Steak** - $24.99
   - Premium ribeye steak grilled to perfection, served with vegetables

2. **Salmon Fillet** - $22.50
   - Pan-seared salmon with lemon butter sauce and asparagus

3. **Pasta Carbonara** - $16.99
   - Creamy pasta with bacon, eggs, and parmesan cheese

### Desserts (3 items)
1. **Chocolate Cake** - $7.99
   - Rich chocolate layer cake with chocolate ganache

2. **Tiramisu** - $8.50
   - Classic Italian dessert with coffee-soaked ladyfingers and mascarpone

3. **Cheesecake** - $7.50
   - New York style cheesecake with berry compote

### Fast Food (3 items)
1. **Classic Burger** - $12.99
   - Juicy beef patty with lettuce, tomato, cheese, and special sauce

2. **Chicken Sandwich** - $11.50
   - Crispy fried chicken breast with coleslaw and mayo

3. **French Fries** - $4.99
   - Crispy golden fries with your choice of dipping sauce

**Total: 12 menu items**

## Default Discount Tiers

Four loyalty reward tiers have been configured:

1. **Bronze Tier** - 5% discount
   - Minimum spending: $50.00
   - Description: "5% off for customers who spent $50+"

2. **Silver Tier** - 10% discount
   - Minimum spending: $100.00
   - Description: "10% off for customers who spent $100+"

3. **Gold Tier** - 15% discount
   - Minimum spending: $200.00
   - Description: "15% off for customers who spent $200+"

4. **Platinum Tier** - 20% discount
   - Minimum spending: $500.00
   - Description: "20% off for customers who spent $500+"

All discount tiers are active by default.

## Managing Sample Data

### Viewing Sample Data
- **Menu Items**: Navigate to Admin Dashboard → Menu Management
- **Discounts**: Navigate to Admin Dashboard → Discount Management

### Modifying Sample Data
All sample data can be modified through the admin dashboard:

1. **Edit Menu Items**:
   - Click the edit icon on any menu item
   - Update name, description, price, category, or image
   - Toggle availability
   - Click "Update" to save changes

2. **Edit Discounts**:
   - Click the edit icon on any discount tier
   - Modify name, description, minimum spending, or percentage
   - Toggle active status
   - Click "Update" to save changes

### Deleting Sample Data

If you want to remove the sample data:

1. **Delete Menu Items**:
   - Go to Admin Dashboard → Menu Management
   - Click the delete icon on each item
   - Confirm deletion

2. **Delete Discounts**:
   - Go to Admin Dashboard → Discount Management
   - Click the delete icon on each discount
   - Confirm deletion

**Note**: You can also delete data directly from the Supabase dashboard if you prefer.

### Adding Your Own Data

Replace the sample data with your actual menu:

1. **Add Menu Items**:
   - Go to Menu Management
   - Click "Add Item"
   - Fill in item details
   - Upload your own images
   - Click "Create"

2. **Customize Discounts**:
   - Go to Discount Management
   - Click "Add Discount"
   - Set your own discount rules
   - Click "Create"

## Database Tables

Sample data is stored in the following tables:

- `menu_items`: All menu items with details
- `discounts`: Loyalty reward tiers

These tables can be accessed and managed through:
- Admin Dashboard (recommended for non-technical users)
- Supabase Dashboard (for direct database access)

## Important Notes

⚠️ **First User**: The first user to register becomes an administrator with full access to manage all data.

💡 **Images**: Sample menu items use placeholder images. Replace them with your actual food photos for better presentation.

🔄 **Updates**: All changes made through the admin dashboard are immediately reflected on the customer-facing pages.

🗑️ **Deletion**: Deleting menu items or discounts is permanent. Make sure you want to remove them before confirming.

## Recommendations

For production use, we recommend:

1. **Replace all sample menu items** with your actual menu
2. **Upload high-quality food photos** for each item
3. **Customize discount tiers** to match your business model
4. **Test the ordering flow** with a few test orders
5. **Configure Stripe** with your actual API keys
6. **Review and adjust prices** for your market

---

Need help managing your data? Check the USER_GUIDE.md for detailed instructions on using the admin dashboard.
