'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CartItemComponent from '@/components/CartItem';
import { Cart } from '@/types';
import { getCart, updateCartItem, removeFromCart, clearCart } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      router.push('/login');
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await updateCartItem(productId, quantity);
      setCart(response.data.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await removeFromCart(productId);
      setCart(response.data.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    try {
      const response = await clearCart();
      setCart(response.data.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading your cart...</p>
        </motion.div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-4"
        >
          <FaShoppingCart className="text-7xl text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some amazing products to get started!</p>
          <button 
            onClick={() => router.push('/shop')} 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cart.items.length} items in your cart</p>
          </div>
          {cart.items.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-red-600 transition"
            >
              <FaTrash />
              <span>Clear Cart</span>
            </motion.button>
          )}
        </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CartItemComponent
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Items ({cart.items.length})</span>
                <span className="font-semibold">{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                <span className="text-gray-800">Total</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition mb-3"
            >
              Proceed to Checkout
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/shop')}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
}
