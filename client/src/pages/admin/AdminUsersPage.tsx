import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, suspendUser, unsuspendUser } from '../../api/admin';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { toast } from '../../hooks/useToast';
import { extractError } from '../../api/client';
import { getErrorMessage } from '../../lib/errorCodes';
import { formatDate } from '../../lib/formatters';
import type { User } from '../../types/user';

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [action, setAction] = useState<'suspend' | 'unsuspend' | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, search],
    queryFn: () => getAdminUsers({ page, limit: 20, search: search || undefined }),
  });

  const suspendMutation = useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setTargetUser(null); setAction(null);
      toast('success', 'User suspended');
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: unsuspendUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setTargetUser(null); setAction(null);
      toast('success', 'User reinstated');
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-sm">
        <Input
          id="admin-user-search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : !data?.items.length ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f3ef]">
              <tr className="text-left border-b border-line">
                <th className="px-4 py-3 text-xs text-slate font-medium">User</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Role</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Level</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Status</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Joined</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user._id} className="border-b border-line last:border-0 hover:bg-[#fafaf7]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
                      <div>
                        <p className="font-medium text-ink">{user.name}</p>
                        <p className="text-xs text-slate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={user.role === 'ADMIN' ? 'rust' : 'slate'} size="sm">{user.role}</Badge></td>
                  <td className="px-4 py-3 text-signal font-medium">{user.level}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.suspended ? 'rust' : 'moss'} size="sm">
                      {user.suspended ? 'Suspended' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    {user.role !== 'ADMIN' && (
                      user.suspended ? (
                        <Button size="sm" variant="secondary" onClick={() => { setTargetUser(user); setAction('unsuspend'); }}>Reinstate</Button>
                      ) : (
                        <Button size="sm" variant="danger" onClick={() => { setTargetUser(user); setAction('suspend'); }}>Suspend</Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} />}

      <ConfirmDialog
        open={!!(targetUser && action === 'suspend')}
        onClose={() => { setTargetUser(null); setAction(null); }}
        onConfirm={() => targetUser && suspendMutation.mutate(targetUser._id)}
        title={`Suspend ${targetUser?.name}`}
        description="This user will no longer be able to log in or participate in projects."
        confirmLabel="Suspend User"
        variant="danger"
        loading={suspendMutation.isPending}
      />
      <ConfirmDialog
        open={!!(targetUser && action === 'unsuspend')}
        onClose={() => { setTargetUser(null); setAction(null); }}
        onConfirm={() => targetUser && unsuspendMutation.mutate(targetUser._id)}
        title={`Reinstate ${targetUser?.name}`}
        description="This user's account will be reactivated."
        confirmLabel="Reinstate"
        variant="primary"
        loading={unsuspendMutation.isPending}
      />
    </div>
  );
}
