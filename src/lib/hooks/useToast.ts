'use client';

import { useToastContext } from '@/lib/toast/ToastContext';

export function useToast() {
  const { showToast } = useToastContext();
  return { showToast };
}
