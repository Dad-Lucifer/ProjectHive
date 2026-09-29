import { useState } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  badge?: number;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex border-b border-line overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky',
              active === tab.id
                ? 'border-sky text-sky'
                : 'border-transparent text-slate hover:text-ink hover:border-line'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-rust text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4">
        {current?.content}
      </div>
    </div>
  );
}
