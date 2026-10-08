import PortalLayout from '../../components/PortalLayout';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/sellers', label: 'Sellers' }, { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' }, { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reviews', label: 'Reviews' },
];
export default function AdminLayout() { return <PortalLayout title="Admin" links={links} />; }
