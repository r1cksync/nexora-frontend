import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data.data;
  },
  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/signup', { name, email, password });
    return response.data.data;
  },
  logout: async () => {
    await api.post('/api/auth/logout');
  },
  getCurrentUser: async (token: string) => {
    const response = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
};

// Products
export const getProducts = (params?: any) => api.get('/api/products', { params });
export const getProduct = (id: string) => api.get(`/api/products/${id}`);
export const addProductReview = (id: string, data: any) => api.post(`/api/products/${id}/reviews`, data);

// Cart (Updated - no longer need userId parameter)
export const getCart = () => api.get('/api/cart');
export const addToCart = (productId: string, quantity: number = 1) => 
  api.post('/api/cart', { productId, quantity });
export const updateCartItem = (productId: string, quantity: number) => 
  api.put('/api/cart', { productId, quantity });
export const removeFromCart = (productId: string) => 
  api.delete(`/api/cart/${productId}`);
export const clearCart = () => api.delete('/api/cart/clear');

// Checkout (Updated - no longer need userId)
export const checkout = (customerName: string, customerEmail: string, cartItems: any[]) => 
  api.post('/api/checkout', { customerName, customerEmail, cartItems });

// Orders (Updated - no longer need userId)
export const getOrders = () => api.get('/api/orders');
export const getOrder = (orderId: string) => api.get(`/api/orders/${orderId}`);

// Wishlist (Updated - no longer need userId)
export const getWishlist = () => api.get('/api/wishlist');
export const addToWishlist = (productId: string) => api.post('/api/wishlist', { productId });
export const removeFromWishlist = (productId: string) => 
  api.delete('/api/wishlist', { params: { productId } });

// AI Features
export const getAIRecommendations = (userId?: string) => 
  api.post('/api/ai/recommendations', { userId });
export const aiSearch = (query: string) => api.post('/api/ai/search', { query });
export const aiChat = (message: string, context?: string) => 
  api.post('/api/ai/chat', { message, context });

// Analytics
export const getAnalytics = (userId: string) => api.get('/api/analytics', { params: { userId } });

// User
export const getUser = (userId: string) => api.get(`/api/users/${userId}`);
export const updateUser = (userId: string, data: any) => api.put(`/api/users/${userId}`, data);

export default api;
