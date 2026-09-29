import { useState } from 'react';
import { useNotifications, useMarkAllRead, useMarkNotificationRead } from '../hooks/useNotifications';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatRelative } from '../lib/formatters';
import { clsx } from 'clsx';
import { Bell } from 'lucide-react';

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications({ page, limit: 20 });
  const markAll = useMarkAllRead();
  const markRead = useMarkNotificationRead();

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAll.mutate()} loading={markAll.isPending}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up. Notifications appear here when teammates accept your requests, verify your tasks, or when projects update."
          icon={<Bell size={32} />}
        />
      ) : (
        <div className="border border-line rounded divide-y divide-line">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={clsx(
                'px-4 py-3 cursor-pointer hover:bg-[#f5f3ef] transition-colors',
                !n.readAt && 'bg-[#fafaf7]'
              )}
              onClick={() => { if (!n.readAt) markRead.mutate(n._id); }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className={clsx('text-sm', n.readAt ? 'text-slate' : 'text-ink font-medium')}>{n.title}</p>
                  <p className="text-xs text-slate mt-0.5">{n.message}</p>
                </div>
                {!n.readAt && (
                  <div className="w-2 h-2 rounded-full bg-sky flex-shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-xs text-slate/60 mt-1">{formatRelative(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={data.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
