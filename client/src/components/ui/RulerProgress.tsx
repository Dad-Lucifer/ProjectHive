import { clsx } from 'clsx';

interface RulerProgressProps {
  value: number;
  max: number;
  tone?: 'signal' | 'sky' | 'moss';
  label?: string;
  ticks?: number;
  className?: string;
  animate?: boolean;
}

const toneColors: Record<string, { filled: string; unfilled: string }> = {
  signal: { filled: 'bg-signal', unfilled: 'bg-line' },
  sky: { filled: 'bg-sky', unfilled: 'bg-line' },
  moss: { filled: 'bg-moss', unfilled: 'bg-line' },
};

export function RulerProgress({ value, max, tone = 'signal', label, ticks = 20, className, animate = false }: RulerProgressProps) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  const filledCount = Math.round(ratio * ticks);
  const colors = toneColors[tone];

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex gap-px" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
        {Array.from({ length: ticks }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-3 flex-1',
              i < filledCount ? colors.filled : colors.unfilled,
              animate && i < filledCount && 'transition-all duration-[400ms] ease-out'
            )}
          />
        ))}
      </div>
      {label && (
        <p className="text-xs text-slate">{label}</p>
      )}
    </div>
  );
}
