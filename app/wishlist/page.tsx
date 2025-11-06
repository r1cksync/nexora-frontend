'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { getWishlist, removeFromWishlist, addToCart } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { FaHeart } from 'react-icons/fa';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      router.push('/login');
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      alert('Added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setProducts(products.filter(p => p.id !== productId));
      alert('Removed from wishlist');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove from wishlist');
    }
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
          <p className="text-lg text-gray-700 font-medium">Loading your wishlist...</p>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaHeart className="text-red-500" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-gray-600">{products.length} items saved for later</p>
        </motion.div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <FaHeart className="text-7xl text-gray-300 mx-auto mb-6" />
          <p className="text-xl text-gray-600 font-medium mb-3">Your wishlist is empty</p>
          <p className="text-gray-500 mb-8">Save your favorite items for later!</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Start Shopping
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleRemoveFromWishlist}
                isInWishlist={true}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
