import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, helper, className, id, ...props },
  ref
) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 bg-paper border rounded text-ink text-sm placeholder-slate transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:border-sky',
          error ? 'border-rust' : 'border-line hover:border-slate',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rust">{error}</p>}
      {helper && !error && <p className="text-xs text-slate">{helper}</p>}
    </div>
  );
});

Input.displayName = 'Input';
