import { Link } from 'react-router-dom';
import { formatRelative } from '../../lib/formatters';
import type { Notification } from '../../types/notification';
import { clsx } from 'clsx';

interface NotificationListProps {
  notifications: Notification[];
  compact?: boolean;
}

export function NotificationList({ notifications, compact }: NotificationListProps) {
  return (
    <ul className="divide-y divide-line">
      {notifications.map((n) => (
        <li key={n._id} className={clsx('py-3', !n.readAt && 'bg-[#fafaf7]')}>
          <p className={clsx('text-sm', n.readAt ? 'text-slate' : 'text-ink font-medium')}>{n.title}</p>
          {!compact && <p className="text-xs text-slate mt-0.5">{n.message}</p>}
          <p className="text-xs text-slate/60 mt-1">{formatRelative(n.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}
