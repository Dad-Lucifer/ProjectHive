import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProject, useProjectMembers, useProjectTasks } from '../hooks/useProject';
import { useAuthStore } from '../store/authStore';
import { getProjectAnalytics } from '../api/projects';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { RulerProgress } from '../components/ui/RulerProgress';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, CheckSquare, Clock } from 'lucide-react';
import { formatDate, formatRelative, formatOnTimeRate } from '../lib/formatters';
import type { ProjectMembership } from '../types/membership';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2C5C7A', '#3E6B52', '#C97A2E', '#B8452F', '#5B6472'];

export function ProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const { data: project, isLoading: projLoading } = useProject(id!);
  const { data: members } = useProjectMembers(id!);
  const { data: tasks } = useProjectTasks(id!);
  const { data: analytics } = useQuery({
    queryKey: ['project', id, 'analytics'],
    queryFn: () => getProjectAnalytics(id!),
    enabled: !!id,
  });

  if (projLoading) {
    return <div className="flex flex-col gap-4"><Skeleton className="h-10" /><Skeleton className="h-64" /></div>;
  }

  if (!project) {
    return <EmptyState title="Project not found" description="" actionLabel="Browse Projects" onAction={() => navigate('/explore')} />;
  }

  const myMembership: ProjectMembership | undefined = members?.find((m) => m.userId === currentUser?._id);
  const isOwner = project.ownerId === currentUser?._id;

  if (!myMembership && !isOwner) {
    return <EmptyState title="Access denied" description="You must be a member of this project to access the workspace." actionLabel="View Project" onAction={() => navigate(`/projects/${id}`)} />;
  }

  const verifiedTasks = tasks?.filter((t) => t.status === 'VERIFIED').length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  const upcomingDeadlines = tasks?.filter((t) => {
    if (!t.dueDate || t.status === 'VERIFIED') return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()) ?? [];

  const overviewContent = (
    <div className="flex flex-col gap-6">
      <Card>
        <h3 className="font-display text-base font-medium text-ink mb-3">Overview</h3>
        <p className="text-sm text-slate mb-4">{project.description}</p>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-slate"><Users size={14} /> {members?.length ?? 0} members</span>
          {project.estimatedDurationWeeks && (
            <span className="flex items-center gap-1.5 text-slate"><Clock size={14} /> {project.estimatedDurationWeeks} weeks</span>
          )}
        </div>
        <div className="mt-4">
          <RulerProgress value={verifiedTasks} max={Math.max(totalTasks, 1)} tone="moss" label={`${verifiedTasks} / ${totalTasks} tasks verified`} />
        </div>
      </Card>

      {members && members.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Team</h3>
          <div className="flex flex-wrap gap-3">
            {members.map((m) => (
              <Link key={m._id} to={`/students/${m.userId}`} className="flex items-center gap-2 hover:opacity-80">
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

      {upcomingDeadlines.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Upcoming Deadlines</h3>
          <div className="flex flex-col gap-2">
            {upcomingDeadlines.map((t) => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                <p className="text-sm text-ink">{t.title}</p>
                <span className="flex items-center gap-1 text-xs text-signal">
                  <Calendar size={12} /> {formatDate(t.dueDate!)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const tasksContent = (
    <div className="flex flex-col gap-4">
      {isOwner && (
        <div className="flex justify-end">
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setTaskModalOpen(true)}>New Task</Button>
        </div>
      )}
      {tasks ? (
        <TaskBoard
          tasks={tasks}
          projectId={id!}
          isOwner={isOwner}
          currentUserId={currentUser!._id}
        />
      ) : (
        <Skeleton className="h-64" />
      )}
      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projectId={id!}
        members={members ?? []}
      />
    </div>
  );

  const membersContent = (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-line">
            <th className="pb-2 text-xs text-slate font-medium">Member</th>
            <th className="pb-2 text-xs text-slate font-medium">Role</th>
            <th className="pb-2 text-xs text-slate font-medium">Tasks</th>
            <th className="pb-2 text-xs text-slate font-medium">On-time</th>
            <th className="pb-2 text-xs text-slate font-medium">XP Earned</th>
            <th className="pb-2 text-xs text-slate font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {(members ?? []).map((m) => (
            <tr key={m._id} className="border-b border-line last:border-0">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={m.user?.name ?? 'Member'} avatarUrl={m.user?.avatarUrl} size="sm" />
                  <Link to={`/students/${m.userId}`} className="text-sm text-ink hover:text-sky">{m.user?.name ?? 'Member'}</Link>
                </div>
              </td>
              <td className="py-3"><Badge variant={m.role === 'OWNER' ? 'signal' : 'slate'} size="sm">{m.role}</Badge></td>
              <td className="py-3 text-slate">{m.contributionStats.tasksVerified}/{m.contributionStats.tasksAssigned}</td>
              <td className="py-3 text-slate">{formatOnTimeRate(m.contributionStats.tasksCompleted, m.contributionStats.tasksCompletedOnTime)}</td>
              <td className="py-3 text-signal font-medium">{m.contributionStats.xpEarned}</td>
              <td className="py-3">
                <RulerProgress value={m.contributionStats.contributionScore} max={100} tone="sky" ticks={8} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const activityContent = (
    <div className="flex flex-col divide-y divide-line border border-line rounded">
      {tasks?.filter((t) => t.status === 'VERIFIED' || t.verifiedAt).slice(0, 20).map((t) => (
        <div key={t._id} className="px-4 py-3">
          <p className="text-sm text-ink">
            <span className="text-moss font-medium">✓</span> {t.title} verified
          </p>
          {t.verifiedAt && <p className="text-xs text-slate mt-0.5">{formatRelative(t.verifiedAt)}</p>}
        </div>
      )) ?? []}
    </div>
  );

  type ProjectAnalytics = {
    totalTasks: number;
    verifiedTasks: number;
    inProgressTasks: number;
    submittedTasks: number;
    todoTasks: number;
    completionRate: number;
    totalXpAwarded: number;
    onTimeRate: number;
    memberCount: number;
    taskStatusBreakdown: { status: string; count: number }[];
  };

  const analyticsContent = isOwner ? (
    <div className="flex flex-col gap-6">
      {analytics ? (() => {
        const a = analytics as ProjectAnalytics;
        return (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card padding="sm">
                <p className="text-2xl font-display font-medium text-ink">{a.completionRate}%</p>
                <p className="text-xs text-slate mt-1">Completion Rate</p>
              </Card>
              <Card padding="sm">
                <p className="text-2xl font-display font-medium text-ink">{a.verifiedTasks} / {a.totalTasks}</p>
                <p className="text-xs text-slate mt-1">Tasks Verified</p>
              </Card>
              <Card padding="sm">
                <p className="text-2xl font-display font-medium text-signal">{a.totalXpAwarded} XP</p>
                <p className="text-xs text-slate mt-1">Total XP Awarded</p>
              </Card>
              <Card padding="sm">
                <p className="text-2xl font-display font-medium text-ink">{a.onTimeRate > 0 ? `${a.onTimeRate}%` : '—'}</p>
                <p className="text-xs text-slate mt-1">On-Time Rate</p>
              </Card>
            </div>

            {/* Task status bar chart */}
            {a.totalTasks > 0 && (
              <Card padding="sm">
                <p className="text-sm font-medium text-ink mb-4">Task Status Breakdown</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={a.taskStatusBreakdown} barSize={32}>
                    <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', borderRadius: 4, fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {a.taskStatusBreakdown.map((entry, index) => (
                        <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {a.totalTasks === 0 && (
              <EmptyState title="No tasks yet" description="Create tasks to start seeing analytics." />
            )}
          </>
        );
      })() : (
        <Skeleton className="h-48" />
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xl font-display font-medium text-ink">
              {totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0}%
            </p>
            <p className="text-xs text-slate">Task completion rate</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-ink">{members?.length ?? 0}</p>
            <p className="text-xs text-slate">Team members</p>
          </div>
          <div>
            <p className="text-xl font-display font-medium text-ink">
              {project.targetEndDate ? formatDate(project.targetEndDate) : '—'}
            </p>
            <p className="text-xs text-slate">Target end date</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-medium text-ink">{project.title}</h2>
          <p className="text-sm text-slate">Workspace</p>
        </div>
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="sm">View Project Page</Button>
        </Link>
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', content: overviewContent },
          { id: 'tasks', label: 'Tasks', badge: tasks?.filter((t) => t.status === 'SUBMITTED').length, content: tasksContent },
          { id: 'members', label: 'Members', content: membersContent },
          { id: 'activity', label: 'Activity', content: activityContent },
          { id: 'analytics', label: 'Analytics', content: analyticsContent },
        ]}
      />
    </div>
  );
}
