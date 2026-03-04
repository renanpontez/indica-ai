'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BanModalProps {
  isOpen: boolean;
  userName: string;
  username: string;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export function BanModal({
  isOpen,
  userName,
  username,
  onConfirm,
  onClose,
}: BanModalProps) {
  const t = useTranslations('admin.banModal');
  const [reason, setReason] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError(t('reasonRequired'));
      return;
    }
    if (confirmUsername !== username) {
      setError(t('confirmMismatch'));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(reason.trim());
      setReason('');
      setConfirmUsername('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-600">{t('title')}</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-medium-grey hover:text-dark-grey transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{t('message')}</p>
          </div>

          <p className="font-medium text-dark-grey mb-4">{userName}</p>

          <label className="block text-sm font-medium text-dark-grey mb-1.5">
            {t('reasonLabel')}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('reasonPlaceholder')}
            className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-dark-grey placeholder:text-medium-grey/60 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
            rows={3}
            disabled={isSubmitting}
          />

          <label className="block text-sm font-medium text-dark-grey mb-1.5 mt-4">
            {t('confirmLabel')} <span className="font-bold">@{username}</span>
          </label>
          <input
            type="text"
            value={confirmUsername}
            onChange={(e) => setConfirmUsername(e.target.value)}
            placeholder={t('confirmPlaceholder')}
            className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-dark-grey placeholder:text-medium-grey/60 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            disabled={isSubmitting}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-medium-grey border border-divider rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || confirmUsername !== username}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('banning') : t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
