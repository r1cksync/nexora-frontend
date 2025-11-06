'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { Product } from '@/types';
import { getProducts, addToCart, addToWishlist, getWishlist, getAIRecommendations } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { FaRobot, FaFilter, FaTimes } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { toasts, success, error } = useToast();

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [category, sortBy, isAuthenticated, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);

      try {
        const productsRes = await getProducts({ category: category !== 'all' ? category : undefined, sort: sortBy });
        setProducts(productsRes.data.data);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      }

      if (isAuthenticated && user) {
        try {
          const wishlistRes = await getWishlist();
          const ids = wishlistRes.data.data.map((p: Product) => p.id);
          setWishlistIds(ids);

          const recsRes = await getAIRecommendations(user.userId);
          setRecommendations(recsRes.data.data);
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      } else {
        setWishlistIds([]);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      error('Please login to add items to cart');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }
    try {
      await addToCart(productId, 1);
      success('✓ Added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      error('Please login to add items to wishlist');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }
    try {
      if (wishlistIds.includes(productId)) {
        error('Already in wishlist!');
        return;
      }
      await addToWishlist(productId);
      setWishlistIds([...wishlistIds, productId]);
      success('♥ Added to wishlist!');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const categories = ['all', 'Electronics', 'Wearables', 'Accessories', 'Furniture', 'Smart Home', 'Fitness'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading amazing products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4"
            >
              <HiSparkles className="inline mr-2" />
              AI-Powered Shopping
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Discover Amazing Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl opacity-90 mb-6"
            >
              Experience smart recommendations powered by advanced AI
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <FaRobot className="text-3xl" />
              <span className="text-lg font-medium">Powered by Groq AI</span>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">AI Picks For You</h2>
                  <p className="text-gray-600">Personalized based on your preferences</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlistIds.includes(product.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
              >
                {showFilters ? <FaTimes /> : <FaFilter />}
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </button>

              <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'flex' : 'hidden md:flex'} w-full md:w-auto`}>
                <div className="flex-1 md:flex-none">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full md:w-48 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 font-medium cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 md:flex-none">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-48 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating (High to Low)</option>
                  </select>
                </div>
              </div>

              <div className="hidden md:flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <span className="text-lg font-bold text-gray-900">{products.length}</span>
                <span className="ml-2 text-gray-600">products</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
            <div className="md:hidden text-sm text-gray-600">
              {products.length} items
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">No products found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlistIds.includes(product.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
