import api from './axios';

//  auth controller
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);

//  product controller
export const getProducts = () => api.get('/api/products');
export const addProduct = (data) => api.post('/api/products', data);

//  admin controller
export const getAdminOrders = () => api.get('/api/admin/orders');
export const updateAdminOrder = (id, data) => api.put(`/api/admin/orders/${id}`, data);
export const addAdminProduct = (data) => api.post('/api/admin/products', data);
export const deleteAdminProduct = (id) => api.delete(`/api/admin/products/${id}`);

//  cart-controller
export const createCart = (data) => api.post('/api/cart', data);
export const addToCart = (productId, data) => api.post(`/api/cart/add/${productId}`, data);

//  order controller
export const getOrders = (userId) => api.get(`/api/orders/${userId}`);
export const placeOrder = (userId, data) => api.post(`/api/orders/${userId}`, data);

//  payment controller
export const createPaymentOrder = (data) => api.post('/api/payment/create-order', data);
export const verifyPayment = (data) => api.post('/api/payment/verify', data);

// api/endpoints.js
export const getCategories = () => api.get('/api/categories');
export const addCategory = (data) => api.post('/api/categories/admin', data);
export const updateCategory = (id, data) => api.put(`/api/categories/admin/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/categories/admin/${id}`);