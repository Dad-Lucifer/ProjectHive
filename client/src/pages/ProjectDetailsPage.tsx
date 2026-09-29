import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProject, useProjectMembers, useProjectTasks } from '../hooks/useProject';
import { useAuthStore } from '../store/authStore';
import { useCompleteProject } from '../hooks/useProjects';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { TechStackList } from '../components/projects/TechStackList';
import { MatchScoreBadge } from '../components/projects/MatchScoreBadge';
import { JoinRequestModal } from '../components/join-requests/JoinRequestModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { RulerProgress } from '../components/ui/RulerProgress';
import { Skeleton, SkeletonText } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from '../hooks/useToast';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import { formatDate, formatRelative } from '../lib/formatters';

const proficiencyVariant: Record<string, 'sky' | 'signal' | 'rust' | 'slate'> = {
  BEGINNER: 'sky', INTERMEDIATE: 'signal', ADVANCED: 'rust', EXPERT: 'slate',
};

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [joinOpen, setJoinOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const { data: project, isLoading } = useProject(id!);
  const { data: members } = useProjectMembers(id!);
  const { data: tasks } = useProjectTasks(id!);
  const completeMutation = useCompleteProject(id!);

  if (isLoading) {
    return (
      <div className="max-w-3xl flex flex-col gap-6">
        <Skeleton className="h-8 w-2/3" />
        <SkeletonText lines={4} />
      </div>
    );
  }

  if (!project) {
    return <EmptyState title="Project not found" description="This project may have been removed or does not exist." actionLabel="Browse Projects" onAction={() => navigate('/explore')} />;
  }

  const isOwner = project.ownerId === currentUser?._id;
  const myMembership = members?.find((m) => m.userId === currentUser?._id);
  const isMember = !!myMembership;
  const verifiedTasks = tasks?.filter((t) => t.status === 'VERIFIED').length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-medium text-ink">{project.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <ProjectStatusBadge status={project.status} />
            <Badge variant="slate">{project.difficulty}</Badge>
            {project.estimatedDurationWeeks && (
              <span className="flex items-center gap-1 text-xs text-slate">
                <Clock size={12} /> {project.estimatedDurationWeeks}w
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate">
              <Users size={12} /> {project.memberCount} members
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {isOwner ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/projects/${id}/workspace`)}>Open Workspace</Button>
              <Button variant="danger" size="sm" onClick={() => setCompleteOpen(true)}>Complete Project</Button>
            </>
          ) : isMember ? (
            <Button variant="primary" size="sm" onClick={() => navigate(`/projects/${id}/workspace`)}>Go to Workspace</Button>
          ) : project.status === 'OPEN' && currentUser ? (
            <Button variant="primary" size="sm" onClick={() => setJoinOpen(true)}>Request to Join</Button>
          ) : null}
        </div>
      </div>

      {/* Match score */}
      {!isMember && !isOwner && project.matchScore && (
        <div className="p-4 border border-line rounded flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Your compatibility</span>
            <MatchScoreBadge score={project.matchScore} />
          </div>
          {project.matchScore.reasons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.matchScore.reasons.map((r) => (
                <span key={r} className="flex items-center gap-1 text-xs text-moss">
                  <CheckCircle size={11} /> {r}
                </span>
              ))}
            </div>
          )}
          {project.matchScore.gaps.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.matchScore.gaps.map((g) => (
                <span key={g} className="text-xs text-signal">• {g}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <Card>
        <h2 className="font-display text-base font-medium text-ink mb-3">About this project</h2>
        <p className="text-sm text-slate leading-relaxed">{project.description}</p>
      </Card>

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <Card>
          <h2 className="font-display text-base font-medium text-ink mb-3">Tech Stack</h2>
          <TechStackList items={project.techStack} max={20} />
        </Card>
      )}

      {/* Requirements */}
      {project.requirements.length > 0 && (
        <Card>
          <h2 className="font-display text-base font-medium text-ink mb-3">Requirements</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs text-slate font-medium">Skill</th>
                <th className="pb-2 text-xs text-slate font-medium">Min Proficiency</th>
                <th className="pb-2 text-xs text-slate font-medium">Importance</th>
              </tr>
            </thead>
            <tbody>
              {project.requirements.map((req, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="py-2 text-ink">{req.skillId}</td>
                  <td className="py-2"><Badge variant={proficiencyVariant[req.minimumProficiency] || 'slate'} size="sm">{req.minimumProficiency}</Badge></td>
                  <td className="py-2"><Badge variant={req.importance === 'REQUIRED' ? 'rust' : 'sky'} size="sm">{req.importance}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Roles */}
      {project.roles.length > 0 && (
        <Card>
          <h2 className="font-display text-base font-medium text-ink mb-3">Open Roles</h2>
          <div className="flex flex-col gap-3">
            {project.roles.map((role, i) => (
              <div key={i} className="border-b border-line last:border-0 pb-3 last:pb-0">
                <p className="text-sm font-medium text-ink">{role.name}</p>
                {role.description && <p className="text-xs text-slate mt-0.5">{role.description}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress */}
      {totalTasks > 0 && (
        <Card>
          <h2 className="font-display text-base font-medium text-ink mb-3">Project Progress</h2>
          <RulerProgress value={verifiedTasks} max={totalTasks} tone="moss" label={`${verifiedTasks} / ${totalTasks} tasks verified`} />
        </Card>
      )}

      {/* Members */}
      {members && members.length > 0 && (
        <Card>
          <h2 className="font-display text-base font-medium text-ink mb-3">Team ({members.length})</h2>
          <div className="flex flex-wrap gap-3">
            {members.map((m) => (
              <Link key={m._id} to={`/students/${m.userId}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar name={m.user?.name ?? 'Member'} avatarUrl={m.user?.avatarUrl} size="sm" />
                <div>
                  <p className="text-xs font-medium text-ink">{m.user?.name ?? 'Member'}</p>
                  <Badge variant={m.role === 'OWNER' ? 'signal' : 'slate'} size="sm">{m.role}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Modals */}
      {currentUser && project.status === 'OPEN' && (
        <JoinRequestModal
          open={joinOpen}
          onClose={() => setJoinOpen(false)}
          project={project}
          currentUser={currentUser}
        />
      )}

      <ConfirmDialog
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        onConfirm={async () => {
          try {
            await completeMutation.mutateAsync();
            setCompleteOpen(false);
            toast('success', 'Project marked as complete');
          } catch { /* handled by hook */ }
        }}
        title="Complete Project"
        description="Mark this project as completed. This action cannot be undone."
        confirmLabel="Complete"
        variant="primary"
        loading={completeMutation.isPending}
      />
    </div>
  );
}
