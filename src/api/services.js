import api from './client';

const clean = (p) => Object.fromEntries(Object.entries(p || {}).filter(([, v]) => v !== '' && v !== undefined && v !== null));
const get = (u, p) => api.get(u, { params: clean(p) }).then((r) => r.data);
const post = (u, b) => api.post(u, b).then((r) => r.data);
const put = (u, b) => api.put(u, b).then((r) => r.data);
const del = (u) => api.delete(u).then((r) => r.data);

export const authApi = {
  registerCustomer: (b) => post('/auth/customer/register', b),
  registerSeller: (b) => post('/auth/seller/register', b),
  login: (b) => post('/auth/login', b),
  adminLogin: (b) => post('/auth/admin/login', b),
  logout: () => post('/auth/logout'),
};

export const catalogApi = {
  products: (p) => get('/products', p),
  product: (id) => get(`/products/${id}`),
  reviews: (id, p) => get(`/products/${id}/reviews`, p),
  categories: () => get('/categories'),
};

export const customerApi = {
  profile: () => get('/profile'),
  updateProfile: (b) => put('/profile', b),
  dashboard: () => get('/customer/dashboard'),
  addresses: () => get('/addresses'),
  addAddress: (b) => post('/addresses', b),
  updateAddress: (id, b) => put(`/addresses/${id}`, b),
  deleteAddress: (id) => del(`/addresses/${id}`),
  cart: () => get('/cart'),
  addToCart: (b) => post('/cart/items', b),
  updateCartItem: (pid, quantity) => put(`/cart/items/${pid}`, { quantity }),
  removeCartItem: (pid) => del(`/cart/items/${pid}`),
  clearCart: () => del('/cart'),
  wishlist: () => get('/wishlist'),
  addWish: (pid) => post(`/wishlist/${pid}`),
  removeWish: (pid) => del(`/wishlist/${pid}`),
  placeOrder: (b) => post('/orders', b),
  orders: (p) => get('/orders', p),
  order: (id) => get(`/orders/${id}`),
  cancelOrder: (id) => put(`/orders/${id}/cancel`),
  createReview: (pid, b) => post(`/products/${pid}/reviews`, b),
  myReviews: (p) => get('/customer/reviews', p),
  deleteReview: (id) => del(`/customer/reviews/${id}`),
};

export const sellerApi = {
  profile: () => get('/seller/profile'),
  updateProfile: (b) => put('/seller/profile', b),
  stats: () => get('/seller/dashboard'),
  products: (p) => get('/seller/products', p),
  product: (id) => get(`/seller/products/${id}`),
  createProduct: (b) => post('/seller/products', b),
  updateProduct: (id, b) => put(`/seller/products/${id}`, b),
  deleteProduct: (id) => del(`/seller/products/${id}`),
  inventory: (p) => get('/seller/inventory', p),
  updateStock: (id, stock) => put(`/seller/products/${id}/stock`, { stock }),
  orders: (p) => get('/seller/orders', p),
  updateOrderStatus: (id, status) => put(`/seller/orders/${id}/status`, { status }),
  reviews: (p) => get('/seller/reviews', p),
};

export const adminApi = {
  dashboard: () => get('/admin/dashboard'),
  customers: (p) => get('/admin/customers', p),
  customerOrders: (id, p) => get(`/admin/customers/${id}/orders`, p),
  suspendCustomer: (id) => put(`/admin/customers/${id}/suspend`),
  activateCustomer: (id) => put(`/admin/customers/${id}/activate`),
  deleteCustomer: (id) => del(`/admin/customers/${id}`),
  sellers: (p) => get('/admin/sellers', p),
  sellerProducts: (id, p) => get(`/admin/sellers/${id}/products`, p),
  sellerOrders: (id, p) => get(`/admin/sellers/${id}/orders`, p),
  approveSeller: (id) => put(`/admin/sellers/${id}/approve`),
  rejectSeller: (id) => put(`/admin/sellers/${id}/reject`),
  suspendSeller: (id) => put(`/admin/sellers/${id}/suspend`),
  activateSeller: (id) => put(`/admin/sellers/${id}/activate`),
  deleteSeller: (id) => del(`/admin/sellers/${id}`),
  products: (p) => get('/admin/products', p),
  activateProduct: (id) => put(`/admin/products/${id}/activate`),
  deactivateProduct: (id) => put(`/admin/products/${id}/deactivate`),
  deleteProduct: (id) => del(`/admin/products/${id}`),
  categories: () => get('/admin/categories'),
  createCategory: (b) => post('/admin/categories', b),
  updateCategory: (id, b) => put(`/admin/categories/${id}`, b),
  deleteCategory: (id) => del(`/admin/categories/${id}`),
  orders: (p) => get('/admin/orders', p),
  reviews: (p) => get('/admin/reviews', p),
  deleteReview: (id) => del(`/admin/reviews/${id}`),
};
