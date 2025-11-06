'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/types';
import { getProduct, addToCart, addToWishlist, getWishlist } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaCheckCircle, FaTruck } from 'react-icons/fa';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { toasts, success, error } = useToast();

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [productId, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const response = await getProduct(productId);
      setProduct(response.data.data);
    } catch (err) {
      console.error('Failed to load product:', err);
      error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await getWishlist();
      const wishlistIds = response.data.data.map((p: Product) => p.id);
      setIsInWishlist(wishlistIds.includes(productId));
    } catch (err) {
      console.error('Failed to check wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      error('Please login to add items to cart');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    try {
      await addToCart(productId, quantity);
      success(`Added ${quantity} item(s) to cart!`);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      error('Please login to add items to wishlist');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    try {
      await addToWishlist(productId);
      setIsInWishlist(true);
      success('Added to wishlist!');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to add to wishlist');
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
          <p className="text-lg text-gray-700 font-medium">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <FaArrowLeft />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
              <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 Only {product.stock} left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({product.reviews.length} reviews)</span>
              </div>

              <div className="mb-6">
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Category</h3>
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                  {product.category}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-medium border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <FaCheckCircle />
                  <span className="font-medium">In Stock</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <FaTruck />
                  <span className="font-medium">Free Shipping</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-800 transition"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToWishlist}
                  className={`p-4 rounded-xl shadow-lg transition ${
                    isInWishlist
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-red-500 border-2 border-red-500'
                  }`}
                >
                  <FaHeart className="text-2xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-800">{review.userName}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
