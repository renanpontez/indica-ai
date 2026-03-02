'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

interface InfoPopoverProps {
  children: ReactNode;
}

export function InfoPopover({ children }: InfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-medium-grey hover:text-dark-grey transition-colors p-0.5"
        aria-label="More info"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 mt-1 w-64 bg-white border border-divider rounded-surface shadow-lg p-3">
          {children}
        </div>
      )}
    </div>
  );
}
