const currency = import.meta.env.VITE_CURRENCY || 'USD';
export const money = (v) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v ?? 0);
export const dt = (v) => (v ? new Date(v).toLocaleString() : '');
export const day = (v) => (v ? new Date(v).toLocaleDateString() : '');
export const ROLES = { CUSTOMER: 'ROLE_CUSTOMER', SELLER: 'ROLE_SELLER', ADMIN: 'ROLE_ADMIN' };
export const ORDER_STEPS = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
export const ORDER_STATUSES = [...ORDER_STEPS, 'CANCELLED'];
export const homeFor = (role) => (role === ROLES.ADMIN ? '/admin/dashboard' : role === ROLES.SELLER ? '/seller/dashboard' : '/customer/dashboard');
export const canAccess = (role, path) =>
  path.startsWith('/admin') ? role === ROLES.ADMIN : path.startsWith('/seller') ? role === ROLES.SELLER : path.startsWith('/customer') ? role === ROLES.CUSTOMER : true;
export const label = (s) => (s || '').replace(/_/g, ' ');
