import { clsx } from 'clsx';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export function LevelBadge({ level, size = 'md', animate, className }: LevelBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-display font-medium border border-signal/40 rounded text-signal bg-[#faf0e4]',
        sizes[size],
        animate && 'transition-transform duration-[400ms]',
        className
      )}
    >
      LEVEL {level}
    </span>
  );
}
