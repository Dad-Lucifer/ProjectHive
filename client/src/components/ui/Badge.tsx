import { clsx } from 'clsx';

type BadgeVariant = 'sky' | 'signal' | 'moss' | 'rust' | 'slate' | 'ink';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const styles: Record<BadgeVariant, string> = {
  sky: 'bg-[#e8f1f7] text-sky border-[#c5d9e6]',
  signal: 'bg-[#faf0e4] text-signal border-[#e8c89a]',
  moss: 'bg-[#e8f0eb] text-moss border-[#b8d4c0]',
  rust: 'bg-[#faeae7] text-rust border-[#e0b0a5]',
  slate: 'bg-[#eef0f2] text-slate border-[#d0d4d9]',
  ink: 'bg-ink text-paper border-ink',
};

export function Badge({ children, variant = 'slate', className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded border font-body font-medium',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
