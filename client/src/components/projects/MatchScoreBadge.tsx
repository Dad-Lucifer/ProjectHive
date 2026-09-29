import { useState } from 'react';
import { clsx } from 'clsx';
import { RulerProgress } from '../ui/RulerProgress';
import { CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import type { MatchScore } from '../../types/project';

interface MatchScoreBadgeProps {
  score: MatchScore;
  className?: string;
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((score.overallScore ?? 0) * 100);

  const components = [
    { label: 'Skills', value: score.skillScore ?? 0 },
    { label: 'Interests', value: score.interestScore ?? 0 },
    { label: 'Experience', value: score.experienceScore ?? 0 },
    { label: 'Availability', value: score.availabilityScore ?? 0 },
    { label: 'Collaboration', value: score.collaborationScore ?? 0 },
    { label: 'Reputation', value: score.reputationScore ?? 0 },
    { label: 'Workload', value: score.workloadScore ?? 0 },
  ].filter(({ value }) => value > 0); // hide zero/missing sub-scores

  const reasons = score.reasons ?? [];
  const gaps = score.gaps ?? [];

  return (
    <div className={clsx('inline-block', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded border text-sm font-medium cursor-pointer transition-colors',
          pct >= 70 ? 'bg-[#e8f0eb] border-moss/30 text-moss' :
          pct >= 40 ? 'bg-[#faf0e4] border-signal/30 text-signal' :
          'bg-[#eef0f2] border-line text-slate'
        )}
        aria-expanded={expanded}
        aria-label={`Match score ${pct}%, click to expand`}
      >
        {pct}% match
        <ChevronDown size={12} className={clsx('transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="mt-2 p-4 bg-paper border border-line rounded shadow-sm min-w-[260px] z-10">
          <p className="text-xs font-medium text-slate mb-3">Compatibility: {pct}%</p>

          {components.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {components.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-slate w-20 flex-shrink-0">{label}</span>
                  <RulerProgress value={value} max={1} tone="sky" ticks={10} className="flex-1" />
                  <span className="text-xs text-slate w-8 text-right">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
          )}

          {reasons.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-slate mb-1">You match:</p>
              {reasons.map((r) => (
                <div key={r} className="flex items-center gap-1.5 text-xs text-moss">
                  <CheckCircle size={11} /> {r}
                </div>
              ))}
            </div>
          )}

          {gaps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate mb-1">Skill gap:</p>
              {gaps.map((g) => (
                <div key={g} className="flex items-center gap-1.5 text-xs text-signal">
                  <AlertCircle size={11} /> {g}
                </div>
              ))}
            </div>
          )}

          {reasons.length === 0 && gaps.length === 0 && components.length === 0 && (
            <p className="text-xs text-slate">No detailed breakdown available.</p>
          )}
        </div>
      )}
    </div>
  );
}
