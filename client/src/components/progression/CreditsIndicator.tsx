import { Zap } from 'lucide-react';

interface CreditsIndicatorProps {
  credits: number;
  className?: string;
}

export function CreditsIndicator({ credits, className }: CreditsIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Zap size={14} className={credits > 0 ? 'text-signal' : 'text-line'} />
      <span className="text-sm text-ink">
        <span className={credits > 0 ? 'text-signal font-medium' : 'text-slate'}>{credits}</span>
        {' '}project creation {credits === 1 ? 'credit' : 'credits'}
      </span>
    </div>
  );
}
