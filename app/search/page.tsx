'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { aiSearch, addToCart, addToWishlist, getWishlist } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { FaRobot, FaSearch } from 'react-icons/fa';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [query, isAuthenticated]);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      const ids = response.data.data.map((p: Product) => p.id);
      setWishlistIds(ids);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await aiSearch(searchTerm);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }
    try {
      await addToCart(productId, 1);
      alert('Added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      window.location.href = '/login';
      return;
    }
    try {
      if (wishlistIds.includes(productId)) {
        alert('Already in wishlist!');
        return;
      }
      await addToWishlist(productId);
      setWishlistIds([...wishlistIds, productId]);
      alert('Added to wishlist!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products with AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 pr-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-md text-gray-800 placeholder-gray-400"
              />
              <FaSearch className="absolute left-5 top-5 text-gray-400 text-xl" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                Search
              </motion.button>
            </div>
          </form>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <FaRobot className="text-blue-600 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-800">
          {query ? `AI Search Results for "${query}"` : 'Search Products'}
        </h1>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 font-medium">Searching with AI...</p>
          </motion.div>
        </div>
      ) : products.length === 0 && query ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <FaSearch className="text-7xl text-gray-300 mx-auto mb-6" />
          <p className="text-xl text-gray-600 font-medium mb-3">No products found for "{query}"</p>
          <p className="text-gray-500">Try different keywords or browse our shop</p>
        </motion.div>
      ) : (
        <div>
          {products.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-700 mb-6 text-lg font-medium"
            >
              {products.length} results found
            </motion.p>
          )}
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
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlistIds.includes(product.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSearch className="text-6xl text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
