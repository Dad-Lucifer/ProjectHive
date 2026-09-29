import { X } from 'lucide-react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import type { Toast as ToastType, ToastType as ToastKind } from '../../hooks/useToast';

const config: Record<ToastKind, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  success: { icon: CheckCircle, bg: 'bg-[#e8f0eb]', text: 'text-moss', border: 'border-moss/30' },
  error: { icon: AlertCircle, bg: 'bg-[#faeae7]', text: 'text-rust', border: 'border-rust/30' },
  info: { icon: Info, bg: 'bg-[#e8f1f7]', text: 'text-sky', border: 'border-sky/30' },
};

export function Toast({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  const { icon: Icon, bg, text, border } = config[toast.type];

  return (
    <div className={clsx('flex items-start gap-3 px-4 py-3 rounded border shadow-sm min-w-[280px] max-w-[380px]', bg, border)}>
      <Icon size={16} className={clsx('flex-shrink-0 mt-0.5', text)} />
      <p className={clsx('text-sm flex-1', text)}>{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className={clsx('flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer', text)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
