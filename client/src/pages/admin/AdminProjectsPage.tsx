import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminProjects } from '../../api/admin';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { ProjectStatusBadge } from '../../components/projects/ProjectStatusBadge';
import { formatDate } from '../../lib/formatters';
import { Users } from 'lucide-react';

export function AdminProjectsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'projects', page],
    queryFn: () => getAdminProjects({ page, limit: 20 }),
  });

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="flex flex-col gap-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : !data?.items.length ? (
        <EmptyState title="No projects" description="No projects have been created yet." />
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f3ef]">
              <tr className="text-left border-b border-line">
                <th className="px-4 py-3 text-xs text-slate font-medium">Title</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Difficulty</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Status</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Members</th>
                <th className="px-4 py-3 text-xs text-slate font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0 hover:bg-[#fafaf7]">
                  <td className="px-4 py-3">
                    <Link to={`/projects/${p._id}`} className="font-medium text-ink hover:text-sky transition-colors">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3"><Badge variant="slate" size="sm">{p.difficulty}</Badge></td>
                  <td className="px-4 py-3"><ProjectStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-slate">
                      <Users size={12} /> {p.memberCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate text-xs">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} />}
    </div>
  );
}
