import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  progression?: boolean; // shows signal top rule
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, progression = false, padding = 'md' }: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      className={clsx(
        'bg-paper border border-line rounded',
        paddings[padding],
        progression && 'border-t-signal border-t-2',
        className
      )}
    >
      {children}
    </div>
  );
}
