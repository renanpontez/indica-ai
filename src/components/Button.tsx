import { cn } from '@/lib/utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary !text-white hover:bg-primary-600',
    secondary: 'bg-surface text-dark-grey hover:bg-opacity-90',
    outline: 'border-2 border-divider text-dark-grey hover:bg-surface',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-small min-h-[36px]',
    md: 'px-4 py-2 text-body min-h-[44px]',
    lg: 'px-6 py-3 text-body min-h-[52px]',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-surface font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:text-medium-grey',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
      {loading ? (
        <LoadingSpinner size="sm" className="mr-2" />
      ) : null}
    </button>
  );
}
