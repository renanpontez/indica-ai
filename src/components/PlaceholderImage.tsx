'use client';

import { cn } from '@/lib/utils/cn';

interface PlaceholderImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlaceholderImage({ className, size = 'md' }: PlaceholderImageProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-full aspect-[16/9]',
  };

  const logoSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        'bg-secondary',
        sizeClasses[size],
        className
      )}
    >

      {/* Logo with subtle backdrop */}
      <div className="relative z-10 rounded-full bg-primary p-4 backdrop-blur-sm ">
        <img
          src="/assets/circle-picks-icon-white.svg"
          alt="Circle Picks"
          className={cn(logoSizeClasses[size], 'text-white fill-white')}
        />
      </div>
    </div>
  );
}
