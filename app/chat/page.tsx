'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiChat } from '@/lib/api';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Nexora AI Assistant with complete knowledge of our entire product catalog and your order history. I can help you:\n\n✨ Find specific products\n📊 Compare items and prices\n📦 Track your orders\n💡 Get personalized recommendations\n🔍 Answer questions about availability\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'What wireless headphones do you have under $100?',
    'Show me my recent orders',
    'Compare your best fitness trackers',
    'What\'s in stock in the Smart Home category?',
    'Recommend a laptop for video editing',
    'What are your top-rated products?',
    'Find me accessories for my Apple Watch',
    'Show products similar to my last purchase',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiChat(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white flex items-center gap-4 shadow-lg"
          >
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FaRobot className="text-4xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Shopping Assistant</h1>
              <p className="text-sm opacity-90 mt-1">Powered by Groq AI - Always here to help!</p>
            </div>
          </motion.div>

          <div className="bg-white border-x-2 border-gray-200 h-[500px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-xs md:max-w-md lg:max-w-lg ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gradient-to-r from-gray-200 to-gray-300'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <FaUser className="text-white text-sm" />
                      ) : (
                        <FaRobot className="text-gray-700" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`rounded-2xl p-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 px-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl p-4 shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="bg-white border-2 border-gray-200 rounded-b-2xl p-4 flex gap-3 shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about products..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
              <span>Send</span>
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600 mb-3 font-medium">💡 Try asking me:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mx-auto">
              {promptSuggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-3 bg-white text-gray-700 rounded-xl text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200 transition text-left font-medium"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              💬 I have access to all {promptSuggestions.length > 0 ? 'products' : 'our'} inventory and your order history
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
