'use client';

import { useState, useCallback } from 'react';
import { ToastType, ToastProps } from '@/components/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      type,
      message,
      duration,
      onClose: (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      },
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showToast('success', message, duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast('error', message, duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast('info', message, duration);
  }, [showToast]);

  return { toasts, success, error, info };
};
