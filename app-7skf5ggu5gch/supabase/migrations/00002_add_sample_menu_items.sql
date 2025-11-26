/*
# Add Sample Menu Items

## Plain English Explanation
This migration adds sample menu items across all categories (Starter, Main Course, Dessert, Fast Food) to showcase the restaurant menu.

## Notes
- These are display items for the restaurant menu
- All items have corresponding CRUD interfaces in the admin dashboard
- Users can modify, add, or delete these items through the admin panel
*/

INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
  ('Caesar Salad', 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing', 8.99, 'Starter', 'https://miaoda-site-img.s3cdn.medo.dev/images/4d45a97d-1ac3-496d-9462-68a783aa6fb5.jpg', true),
  ('Bruschetta', 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil', 7.50, 'Starter', 'https://miaoda-site-img.s3cdn.medo.dev/images/3f4d7a01-0898-4a6b-8157-a2b976b56baa.jpg', true),
  ('Chicken Wings', 'Crispy fried chicken wings with your choice of sauce', 9.99, 'Starter', 'https://miaoda-site-img.s3cdn.medo.dev/images/bb639183-91c2-4db8-98f6-85b17526f270.jpg', true),
  
  ('Grilled Steak', 'Premium ribeye steak grilled to perfection, served with vegetables', 24.99, 'Main Course', 'https://miaoda-site-img.s3cdn.medo.dev/images/a157d1bb-dbf7-4f7f-a4a4-f4b7dd0a1292.jpg', true),
  ('Salmon Fillet', 'Pan-seared salmon with lemon butter sauce and asparagus', 22.50, 'Main Course', 'https://miaoda-site-img.s3cdn.medo.dev/images/6f73e18e-9aa5-4de8-8bfd-940ee417d3ff.jpg', true),
  ('Pasta Carbonara', 'Creamy pasta with bacon, eggs, and parmesan cheese', 16.99, 'Main Course', 'https://miaoda-site-img.s3cdn.medo.dev/images/6f73e18e-9aa5-4de8-8bfd-940ee417d3ff.jpg', true),
  
  ('Chocolate Cake', 'Rich chocolate layer cake with chocolate ganache', 7.99, 'Dessert', 'https://miaoda-site-img.s3cdn.medo.dev/images/5f10da40-ee55-43e4-9aa0-d409bdacc4f6.jpg', true),
  ('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', 8.50, 'Dessert', 'https://miaoda-site-img.s3cdn.medo.dev/images/b8bae623-7c7d-4b20-b9f3-c3a0b097eaae.jpg', true),
  ('Cheesecake', 'New York style cheesecake with berry compote', 7.50, 'Dessert', 'https://miaoda-site-img.s3cdn.medo.dev/images/b8bae623-7c7d-4b20-b9f3-c3a0b097eaae.jpg', true),
  
  ('Classic Burger', 'Juicy beef patty with lettuce, tomato, cheese, and special sauce', 12.99, 'Fast Food', 'https://miaoda-site-img.s3cdn.medo.dev/images/ead0ae53-c030-4f60-8403-08df2d955017.jpg', true),
  ('Chicken Sandwich', 'Crispy fried chicken breast with coleslaw and mayo', 11.50, 'Fast Food', 'https://miaoda-site-img.s3cdn.medo.dev/images/bb639183-91c2-4db8-98f6-85b17526f270.jpg', true),
  ('French Fries', 'Crispy golden fries with your choice of dipping sauce', 4.99, 'Fast Food', 'https://miaoda-site-img.s3cdn.medo.dev/images/ead0ae53-c030-4f60-8403-08df2d955017.jpg', true);
