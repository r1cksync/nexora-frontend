'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/landing' || pathname === '/';

  return (
    <>
      {!isLandingPage && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isLandingPage && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nexora</h3>
                <p className="text-gray-400">AI-powered e-commerce platform for smart shopping</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/shop" className="hover:text-white transition">All Products</a></li>
                  <li><a href="/shop?category=Electronics" className="hover:text-white transition">Electronics</a></li>
                  <li><a href="/shop?category=Fashion" className="hover:text-white transition">Fashion</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Account</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/orders" className="hover:text-white transition">My Orders</a></li>
                  <li><a href="/wishlist" className="hover:text-white transition">Wishlist</a></li>
                  <li><a href="/cart" className="hover:text-white transition">Cart</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/chat" className="hover:text-white transition">AI Assistant</a></li>
                  <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
                  <li><a href="/help" className="hover:text-white transition">Help Center</a></li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Nexora. All rights reserved. Built with Next.js, MongoDB, and Groq AI.
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
