import type { ReactNode } from 'react';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import DiscountManagement from './pages/admin/DiscountManagement';
import AdminSettings from './pages/admin/AdminSettings';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  requireAdminAuth?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Menu',
    path: '/menu',
    element: <Menu />,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <Checkout />,
    visible: false,
  },
  {
    name: 'My Orders',
    path: '/orders',
    element: <Orders />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false,
  },
  {
    name: 'AI Assistant',
    path: '/ai-assistant',
    element: <AIAssistant />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />,
    visible: false,
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false,
    requireAdminAuth: true,
  },
  {
    name: 'Menu Management',
    path: '/admin/menu',
    element: <MenuManagement />,
    visible: false,
    requireAdminAuth: true,
  },
  {
    name: 'Order Management',
    path: '/admin/orders',
    element: <OrderManagement />,
    visible: false,
    requireAdminAuth: true,
  },
  {
    name: 'Customer Management',
    path: '/admin/customers',
    element: <CustomerManagement />,
    visible: false,
    requireAdminAuth: true,
  },
  {
    name: 'Discount Management',
    path: '/admin/discounts',
    element: <DiscountManagement />,
    visible: false,
    requireAdminAuth: true,
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    element: <AdminSettings />,
    visible: false,
    requireAdminAuth: true,
  },
];

export default routes;