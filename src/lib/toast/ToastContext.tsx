'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  href: string;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', action?: ToastAction) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, message, type, action };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  }, [hideToast]);

  const value: ToastContextValue = useMemo(
    () => ({
      toasts,
      showToast,
      hideToast,
    }),
    [toasts, showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}
