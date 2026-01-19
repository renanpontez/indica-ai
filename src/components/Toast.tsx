'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { ToastType, ToastAction } from '@/lib/toast/ToastContext';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
  onDismiss: (id: string) => void;
}

export function Toast({ id, message, type, action, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const iconByType = {
    success: (
      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-out',
        // Desktop: slide from right
        'sm:translate-x-0',
        isVisible && !isLeaving ? 'sm:translate-x-0 opacity-100' : 'sm:translate-x-full opacity-0',
        // Mobile: slide from top (handled by container positioning)
        isVisible && !isLeaving ? 'translate-y-0' : '-translate-y-2 sm:translate-y-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="shrink-0">{iconByType[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-dark-grey">{message}</p>
            {action && (
              <p className="mt-1">
                <Link
                  href={action.href}
                  onClick={() => onDismiss(id)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {action.label}
                </Link>
              </p>
            )}
          </div>
          <div className="ml-4 flex shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex rounded-md bg-white text-medium-grey hover:text-dark-grey focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
