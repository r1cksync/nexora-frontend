'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaRobot, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { getCart } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartCount();
    }
    
    const handleCartUpdate = () => loadCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated]);

  const loadCartCount = async () => {
    try {
      const response = await getCart();
      const itemCount = response.data.data.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(itemCount);
    } catch (error) {
      console.error('Failed to load cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/landing';
  };

  return (
    <motion.header
      style={{ backgroundColor: headerBackground }}
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/landing" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">N</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nexora
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search with AI-powered intelligence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink href="/shop" icon={FaShoppingCart} label="Shop" />
                <NavLink href="/wishlist" icon={FaHeart} label="Wishlist" />
                <NavLink href="/orders" icon={FaUser} label="Orders" />
                <NavLink href="/chat" icon={FaRobot} label="AI Chat" />
                
                <Link
                  href="/cart"
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                  <span className="font-medium">Cart</span>
                </Link>

                <div className="ml-4 pl-4 border-l-2 border-gray-200 flex items-center space-x-3">
                  <div className="hidden xl:flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">Welcome back!</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                  >
                    <FaSignOutAlt />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </div>
              </>
            ) : (
              !loading && (
                <>
                  <NavLink href="/shop" icon={FaShoppingCart} label="Shop" />
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search with AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
        className="lg:hidden overflow-hidden bg-white border-t border-gray-200"
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          {isAuthenticated ? (
            <>
              <MobileNavLink href="/shop" icon={FaShoppingCart} label="Shop" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/wishlist" icon={FaHeart} label="Wishlist" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/orders" icon={FaUser} label="Orders" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/chat" icon={FaRobot} label="AI Chat" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/cart" icon={FaShoppingCart} label={`Cart (${cartCount})`} onClick={() => setMobileMenuOpen(false)} />
              <div className="pt-2 border-t border-gray-200">
                <div className="text-sm font-semibold text-gray-900 mb-2 px-4">
                  Hello, {user?.name?.split(' ')[0]}!
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500"
                >
                  <FaSignOutAlt />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          ) : (
            !loading && (
              <>
                <MobileNavLink href="/shop" icon={FaShoppingCart} label="Shop" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink href="/login" icon={FaSignInAlt} label="Login" onClick={() => setMobileMenuOpen(false)} />
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center"
                >
                  Sign Up Free
                </Link>
              </>
            )
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
    >
      <Icon />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
    >
      <Icon className="text-lg" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
