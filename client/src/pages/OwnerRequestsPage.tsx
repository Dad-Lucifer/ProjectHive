import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getStudentProjects } from '../api/students';
import { useProjectJoinRequests } from '../hooks/useJoinRequests';
import { RequestCard } from '../components/join-requests/RequestCard';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Tabs } from '../components/ui/Tabs';
import { Inbox } from 'lucide-react';

function ProjectRequestsTab({ projectId }: { projectId: string }) {
  const [sort, setSort] = useState('date');
  const { data: requests, isLoading } = useProjectJoinRequests(projectId);
  const pending = requests?.filter((r) => r.status === 'PENDING') ?? [];

  const sorted = useMemo(() => {
    return [...pending].sort((a, b) => {
      if (sort === 'match') return (b.matchSnapshot?.overallScore ?? 0) - (a.matchSnapshot?.overallScore ?? 0);
      if (sort === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'level') return (b.applicant?.level ?? 0) - (a.applicant?.level ?? 0);
      return 0;
    });
  }, [pending, sort]);

  if (isLoading) return <div className="flex flex-col gap-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">{pending.length} pending request{pending.length !== 1 ? 's' : ''}</p>
        <Select
          id="req-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: 'date', label: 'Sort: Request Date' },
            { value: 'match', label: 'Sort: Match Score' },
            { value: 'level', label: 'Sort: Level' },
          ]}
        />
      </div>
      {sorted.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="New join requests will appear here."
          icon={<Inbox size={28} />}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((req) => (
            <RequestCard key={req._id} request={req} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OwnerRequestsPage() {
  const { currentUser } = useAuthStore();

  const { data: myProjects, isLoading } = useQuery({
    queryKey: ['student', currentUser?._id, 'projects'],
    queryFn: () => getStudentProjects(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  const ownedProjects = myProjects?.filter((p) => p.ownerId === currentUser?._id) ?? [];

  if (isLoading) return <Skeleton className="h-40" />;

  if (ownedProjects.length === 0) {
    return (
      <EmptyState
        title="You don't own any projects"
        description="Create a project to start receiving join requests."
        icon={<Inbox size={28} />}
      />
    );
  }

  return (
    <Tabs
      tabs={ownedProjects.map((p) => ({
        id: p._id,
        label: p.title,
        content: <ProjectRequestsTab projectId={p._id} />,
      }))}
    />
  );
}
