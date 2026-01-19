'use client';

import { useToastContext } from '@/lib/toast/ToastContext';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, hideToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Desktop: Top-right corner */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 hidden sm:flex sm:items-start sm:justify-end px-4 py-6 z-50"
      >
        <div className="flex w-full flex-col items-end space-y-4">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              action={toast.action}
              onDismiss={hideToast}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Top full-width */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-x-0 top-0 flex sm:hidden px-4 py-4 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              action={toast.action}
              onDismiss={hideToast}
            />
          ))}
        </div>
      </div>
    </>
  );
}
