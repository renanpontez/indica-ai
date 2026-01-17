import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/format';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-small',
    md: 'h-12 w-12 text-body',
    lg: 'h-20 w-20 text-title-m',
  };

  const initials = getInitials(alt);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center overflow-hidden bg-surface text-dark-grey font-medium',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
