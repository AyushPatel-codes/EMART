import { Link, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import StoreLayout from './components/StoreLayout';
import PortalLayout from './components/PortalLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import { RegisterCustomer, RegisterSeller } from './pages/Register';
import { ROLES } from './utils/format';

import CDashboard from './pages/customer/Dashboard';
import CProfile from './pages/customer/Profile';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';
import Checkout from './pages/customer/Checkout';
import COrders from './pages/customer/Orders';
import COrderDetails from './pages/customer/OrderDetails';
import Addresses from './pages/customer/Addresses';
import CReviews from './pages/customer/Reviews';

import SellerLayout from './pages/seller/SellerLayout';
import SDashboard from './pages/seller/Dashboard';
import SStats from './pages/seller/Stats';
import SProducts from './pages/seller/Products';
import SProductForm from './pages/seller/ProductForm';
import SInventory from './pages/seller/Inventory';
import SOrders from './pages/seller/Orders';
import SReviews from './pages/seller/Reviews';
import SProfile from './pages/seller/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import ADashboard from './pages/admin/Dashboard';
import ACustomers from './pages/admin/Customers';
import ASellers from './pages/admin/Sellers';
import AProducts from './pages/admin/Products';
import ACategories from './pages/admin/Categories';
import AOrders from './pages/admin/Orders';
import AReviews from './pages/admin/Reviews';

const customerLinks = [
  { to: '/customer/dashboard', label: 'Dashboard' }, { to: '/customer/profile', label: 'Profile' },
  { to: '/customer/cart', label: 'Cart' }, { to: '/customer/wishlist', label: 'Wishlist' },
  { to: '/customer/orders', label: 'Orders' }, { to: '/customer/addresses', label: 'Addresses' },
  { to: '/customer/reviews', label: 'Reviews' },
];

const NotFound = () => (
  <div className="page container" style={{ textAlign: 'center' }}><h1>404</h1><p className="muted">Page not found.</p><Link className="btn btn-primary" to="/">Go home</Link></div>
);

export default function App() {
  return (
    <Routes>
      {/* Public + customer shopping pages (header/footer layout) */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category/:name" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login variant="customer" />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/seller/login" element={<Login variant="seller" />} />
        <Route path="/seller/register" element={<RegisterSeller />} />
        <Route path="/admin/login" element={<Login variant="admin" />} />
        <Route element={<ProtectedRoute roles={[ROLES.CUSTOMER]} />}>
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/wishlist" element={<Wishlist />} />
          <Route path="/customer/checkout" element={<Checkout />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Customer portal */}
      <Route element={<ProtectedRoute roles={[ROLES.CUSTOMER]} />}>
        <Route element={<PortalLayout title="Account" links={customerLinks} />}>
          <Route path="/customer/dashboard" element={<CDashboard />} />
          <Route path="/customer/profile" element={<CProfile />} />
          <Route path="/customer/orders" element={<COrders />} />
          <Route path="/customer/orders/:id" element={<COrderDetails />} />
          <Route path="/customer/addresses" element={<Addresses />} />
          <Route path="/customer/reviews" element={<CReviews />} />
        </Route>
      </Route>

      {/* Seller portal */}
      <Route element={<ProtectedRoute roles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SDashboard />} />
          <Route path="/seller/stats" element={<SStats />} />
          <Route path="/seller/products" element={<SProducts />} />
          <Route path="/seller/products/new" element={<SProductForm />} />
          <Route path="/seller/products/:id/edit" element={<SProductForm />} />
          <Route path="/seller/inventory" element={<SInventory />} />
          <Route path="/seller/orders" element={<SOrders />} />
          <Route path="/seller/reviews" element={<SReviews />} />
          <Route path="/seller/profile" element={<SProfile />} />
        </Route>
      </Route>

      {/* Admin portal */}
      <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<ADashboard />} />
          <Route path="/admin/customers" element={<ACustomers />} />
          <Route path="/admin/sellers" element={<ASellers />} />
          <Route path="/admin/products" element={<AProducts />} />
          <Route path="/admin/categories" element={<ACategories />} />
          <Route path="/admin/orders" element={<AOrders />} />
          <Route path="/admin/reviews" element={<AReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}
