import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudent, getStudentContributions, getStudentProjects } from '../api/students';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { LevelBadge } from '../components/progression/LevelBadge';
import { RulerProgress } from '../components/ui/RulerProgress';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton, SkeletonText } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Star, CheckCircle } from 'lucide-react';
import { formatDate } from '../lib/formatters';

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id!),
    enabled: !!id,
  });

  const { data: projects } = useQuery({
    queryKey: ['student', id, 'projects'],
    queryFn: () => getStudentProjects(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl flex flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <SkeletonText lines={4} />
      </div>
    );
  }

  if (!student) {
    return <EmptyState title="Student not found" description="This profile may no longer exist." actionLabel="Go back" onAction={() => navigate(-1)} />;
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Header */}
      <Card className="flex items-start gap-5">
        <Avatar name={student.name} avatarUrl={student.avatarUrl} size="xl" />
        <div className="flex-1">
          <h2 className="font-display text-xl font-medium text-ink">{student.name}</h2>
          {student.department && <p className="text-sm text-slate">{student.department}{student.academicYear ? ` · ${student.academicYear}` : ''}</p>}
          {student.college && <p className="text-xs text-slate mt-0.5">{student.college}</p>}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <LevelBadge level={student.level} size="sm" />
            <span className="text-sm text-signal font-medium">{student.xp.toLocaleString()} XP</span>
            {student.reputation && (
              <div className="flex items-center gap-1 text-xs text-slate">
                <Star size={11} fill="currentColor" className="text-signal" />
                {student.reputation.averageRating.toFixed(1)} ({student.reputation.ratingCount} reviews)
              </div>
            )}
            {student.unlockedCapabilities?.includes('PROJECT_OWNER') && (
              <Badge variant="signal">Project Owner</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Bio */}
      {student.bio && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-2">About</h3>
          <p className="text-sm text-slate">{student.bio}</p>
        </Card>
      )}

      {/* Skills */}
      {student.skills.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {student.skills.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <Badge variant="slate">{s.skillId}</Badge>
                <Badge variant="sky" size="sm">{s.proficiency}</Badge>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Interests */}
      {student.interests.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {student.interests.map((i) => <Badge key={i} variant="sky">{i}</Badge>)}
          </div>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <h3 className="font-display text-base font-medium text-ink mb-3">Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xl font-display font-medium text-ink">{student.completedProjectCount}</p>
            <p className="text-xs text-slate">Completed projects</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-ink">{student.activeProjectCount}</p>
            <p className="text-xs text-slate">Active projects</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-ink">{student.ownedProjectCount}</p>
            <p className="text-xs text-slate">Projects led</p>
          </div>
        </div>
        <div className="mt-4">
          <RulerProgress value={student.activeProjectCount} max={3} tone="sky" ticks={3} label={`${student.activeProjectCount}/3 active`} />
        </div>
      </Card>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Projects</h3>
          <div className="flex flex-col divide-y divide-line">
            {projects.map((p) => (
              <div key={p._id} className="py-2.5">
                <Link to={`/projects/${p._id}`} className="text-sm font-medium text-ink hover:text-sky transition-colors">{p.title}</Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={p.status === 'COMPLETED' ? 'moss' : 'slate'} size="sm">{p.status}</Badge>
                  {p.ownerId === student._id && <Badge variant="signal" size="sm">Owner</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
