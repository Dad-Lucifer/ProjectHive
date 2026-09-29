import { clsx } from 'clsx';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-start gap-3 py-12 px-6', className)}>
      {icon && <div className="text-line mb-2">{icon}</div>}
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="text-sm text-slate max-w-[42rem]">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
