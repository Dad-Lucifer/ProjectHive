import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications, useMarkAllRead } from '../../hooks/useNotifications';
import { Button } from '../ui/Button';
import { formatRelative } from '../../lib/formatters';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useNotifications({ limit: 5 });
  const markAll = useMarkAllRead();

  const items = data?.items ?? [];
  const unread = items.filter((n) => !n.readAt).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate hover:text-ink transition-colors rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 bg-rust text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-paper border border-line rounded shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="text-sm font-medium text-ink">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs text-sky hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="p-4 text-sm text-slate">No notifications yet.</p>
          ) : (
            <ul>
              {items.map((n) => (
                <li
                  key={n._id}
                  className={`px-4 py-3 border-b border-line last:border-0 ${!n.readAt ? 'bg-[#f5f3ef]' : ''}`}
                >
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-xs text-slate mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate/60 mt-1">{formatRelative(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="px-4 py-3 border-t border-line">
            <Link
              to="/notifications"
              className="text-xs text-sky hover:underline"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
