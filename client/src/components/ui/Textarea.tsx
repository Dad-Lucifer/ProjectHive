import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, error, helper, showCount, maxLength, className, id, value, ...props },
  ref
) => {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`;
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-slate uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        maxLength={maxLength}
        className={clsx(
          'w-full px-3 py-2 bg-paper border rounded text-ink text-sm placeholder-slate transition-colors resize-y min-h-[100px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:border-sky',
          error ? 'border-rust' : 'border-line hover:border-slate',
          className
        )}
        {...props}
      />
      <div className="flex justify-between">
        <span>{error && <p className="text-xs text-rust">{error}</p>}
          {helper && !error && <p className="text-xs text-slate">{helper}</p>}
        </span>
        {showCount && maxLength && (
          <span className="text-xs text-slate">{charCount}/{maxLength}</span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
