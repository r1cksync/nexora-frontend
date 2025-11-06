'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, type, message, duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500 text-2xl" />,
    error: <FaExclamationCircle className="text-red-500 text-2xl" />,
    info: <FaInfoCircle className="text-blue-500 text-2xl" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 shadow-lg ${bgColors[type]} min-w-[300px] max-w-md`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-gray-800 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition"
      >
        <FaTimes />
      </button>
    </motion.div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[];
}

export const ToastContainer = ({ toasts }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
