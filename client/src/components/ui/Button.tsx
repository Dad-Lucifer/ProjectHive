import { forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  { variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props },
  ref
) => {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-medium rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants: Record<Variant, string> = {
    primary: 'bg-sky text-white hover:bg-[#234d68] border border-sky',
    secondary: 'bg-paper text-ink border border-line hover:bg-[#f0ede6] hover:border-slate',
    ghost: 'bg-transparent text-slate hover:text-ink hover:bg-[#f0ede6]',
    danger: 'bg-rust text-white hover:bg-[#9e3a26] border border-rust',
  };

  const sizes: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
