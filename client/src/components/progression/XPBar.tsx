import { RulerProgress } from '../ui/RulerProgress';
import { formatXP } from '../../lib/formatters';

interface XPBarProps {
  xp: number;
  nextLevelXp: number;
  animate?: boolean;
  className?: string;
}

export function XPBar({ xp, nextLevelXp, animate, className }: XPBarProps) {
  return (
    <div className={className}>
      <RulerProgress
        value={xp}
        max={nextLevelXp}
        tone="signal"
        animate={animate}
        ticks={20}
      />
      <p className="text-xs text-slate mt-1">
        {formatXP(xp)} / {formatXP(nextLevelXp)} XP to next level
      </p>
    </div>
  );
}
