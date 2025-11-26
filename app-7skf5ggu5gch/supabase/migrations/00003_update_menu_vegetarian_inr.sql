/*
# Update Menu to Vegetarian Items with INR Pricing

1. Changes
   - Remove all non-vegetarian items
   - Add new vegetarian items
   - Convert all prices to Indian Rupees (INR)
   - Maintain 12 items across 4 categories

2. Removed Items (Non-Veg)
   - Chicken Wings
   - Grilled Steak
   - Salmon Fillet
   - Pasta Carbonara (contains bacon)
   - Classic Burger (beef)
   - Chicken Sandwich

3. New Vegetarian Items
   - Starters: Spring Rolls, Paneer Tikka
   - Main Course: Paneer Butter Masala, Veg Biryani, Dal Makhani
   - Fast Food: Veg Burger

4. Price Conversion
   - Approximate rate: 1 USD = 83 INR
   - All prices rounded to nearest ₹10
*/

-- Delete all existing menu items
DELETE FROM menu_items;

-- Insert vegetarian menu items with INR pricing

-- Starters (3 items)
INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
('Caesar Salad', 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing', 750, 'Starter', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500', true),
('Bruschetta', 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil', 620, 'Starter', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500', true),
('Spring Rolls', 'Crispy vegetable spring rolls served with sweet chili sauce', 580, 'Starter', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500', true);

-- Main Courses (4 items)
INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
('Paneer Butter Masala', 'Cottage cheese cubes in rich creamy tomato gravy with butter', 1650, 'Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', true),
('Veg Biryani', 'Aromatic basmati rice cooked with mixed vegetables and Indian spices', 1400, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
('Dal Makhani', 'Creamy black lentils slow-cooked with butter and cream, served with rice', 1250, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', true),
('Palak Paneer', 'Cottage cheese cubes in smooth spinach gravy with aromatic spices', 1500, 'Main Course', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', true);

-- Desserts (3 items)
INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
('Chocolate Cake', 'Rich chocolate layer cake with chocolate ganache', 660, 'Dessert', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', true),
('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', 700, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', true),
('Gulab Jamun', 'Soft milk dumplings soaked in rose-flavored sugar syrup', 500, 'Dessert', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', true);

-- Fast Food (2 items)
INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
('Veg Burger', 'Crispy vegetable patty with lettuce, tomato, cheese, and special sauce', 950, 'Fast Food', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500', true),
('French Fries', 'Crispy golden fries with your choice of dipping sauce', 410, 'Fast Food', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500', true);
