'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <div className="aspect-square relative">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Overlay with Quick Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[2px] flex items-center justify-center gap-3"
              >
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ delay: 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/product/${product.id}`);
                  }}
                  className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 transition"
                  title="Quick View"
                >
                  <FaEye className="text-blue-600 text-xl" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => onAddToCart(product.id)}
                  disabled={product.stock === 0}
                  className={`p-3 rounded-full shadow-lg transition ${
                    product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-white hover:bg-green-50'
                  }`}
                  title="Add to Cart"
                >
                  <FaShoppingCart className={`text-xl ${
                    product.stock === 0 ? 'text-gray-500' : 'text-green-600'
                  }`} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddToWishlist(product.id)}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all z-10 ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <motion.div
            animate={isInWishlist ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <FaHeart className="text-lg" />
          </motion.div>
        </motion.button>

        {/* Stock Badges */}
        {product.stock < 10 && product.stock > 0 && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
          >
            🔥 Only {product.stock} left!
          </motion.div>
        )}
        {product.stock === 0 && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
          >
            Out of Stock
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 text-gray-800 min-h-[3.5rem] leading-tight group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <FaStar className="text-yellow-500 text-sm" />
            <span className="font-semibold text-gray-800 text-sm">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 text-xs">
            ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            <FaShoppingCart />
            <span>Add</span>
          </motion.button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {product.tags.slice(0, 3).map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-2.5 py-1 rounded-full font-medium border border-blue-100"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
