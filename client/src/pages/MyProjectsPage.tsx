import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getStudentProjects } from '../api/students';
import { Tabs } from '../components/ui/Tabs';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RulerProgress } from '../components/ui/RulerProgress';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { useProgression } from '../hooks/useProgression';
import { CreationLockPanel } from '../components/progression/CreationLockPanel';
import { Plus } from 'lucide-react';
import type { Project } from '../types/project';

export function MyProjectsPage() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const { data: progression } = useProgression();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['student', currentUser?._id, 'projects'],
    queryFn: () => getStudentProjects(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  if (isLoading) {
    return <div className="flex flex-col gap-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20" />)}</div>;
  }

  const allProjects: Project[] = projects ?? [];
  const active = allProjects.filter((p) => p.status === 'OPEN' || p.status === 'IN_PROGRESS');
  const completed = allProjects.filter((p) => p.status === 'COMPLETED');
  const owned = allProjects.filter((p) => p.ownerId === currentUser?._id);
  const contributed = allProjects.filter((p) => p.ownerId !== currentUser?._id);

  const canCreate = currentUser && progression &&
    progression.level >= 5 &&
    progression.projectCreationCredits > 0 &&
    progression.activeProjectCount < 3;

  function ProjectRow({ project }: { project: Project }) {
    const isOwner = project.ownerId === currentUser?._id;
    return (
      <div className="border border-line rounded px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/projects/${project._id}`} className="text-sm font-medium text-ink hover:text-sky transition-colors truncate">
              {project.title}
            </Link>
            <Badge variant={isOwner ? 'signal' : 'slate'} size="sm">{isOwner ? 'Owner' : 'Contributor'}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project._id}/workspace`)}>Open</Button>
        </div>
      </div>
    );
  }

  function ProjectList({ projects: list }: { projects: Project[] }) {
    if (!list.length) {
      return <EmptyState title="No projects here" description="Projects you join or create will appear in the relevant tab." actionLabel="Explore Projects" onAction={() => navigate('/explore')} />;
    }
    return <div className="flex flex-col gap-2">{list.map((p) => <ProjectRow key={p._id} project={p} />)}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">{allProjects.length} project{allProjects.length !== 1 ? 's' : ''} total</p>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => navigate('/projects/new')}
          title={canCreate ? undefined : 'Check eligibility to create a project'}
        >
          Create Project
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'active', label: `Active (${active.length})`, content: <ProjectList projects={active} /> },
          { id: 'completed', label: `Completed (${completed.length})`, content: <ProjectList projects={completed} /> },
          { id: 'owned', label: `Owned (${owned.length})`, content: <ProjectList projects={owned} /> },
          { id: 'contributed', label: `Contributed (${contributed.length})`, content: <ProjectList projects={contributed} /> },
        ]}
      />
    </div>
  );
}
