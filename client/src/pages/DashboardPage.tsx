import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getStudentRecommendations, getStudentContributions, getStudentXpHistory } from '../api/students';
import { useProgression } from '../hooks/useProgression';
import { useNotifications } from '../hooks/useNotifications';
import { ProjectCard } from '../components/projects/ProjectCard';
import { LevelBadge } from '../components/progression/LevelBadge';
import { XPBar } from '../components/progression/XPBar';
import { CreditsIndicator } from '../components/progression/CreditsIndicator';
import { RulerProgress } from '../components/ui/RulerProgress';
import { NotificationList } from '../components/notifications/NotificationList';
import { SkeletonCard, Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { useNavigate, Link } from 'react-router-dom';
import { Star, CheckCircle } from 'lucide-react';
import { formatRelative, formatXP } from '../lib/formatters';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../lib/formatters';

export function DashboardPage() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const { data: progression, isLoading: progLoading } = useProgression();
  const { data: notificationsData } = useNotifications({ limit: 5 });

  const { data: recommendations, isLoading: recLoading } = useQuery({
    queryKey: ['student', currentUser?._id, 'recommendations'],
    queryFn: () => getStudentRecommendations(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  const { data: contributions, isLoading: contribLoading } = useQuery({
    queryKey: ['student', currentUser?._id, 'contributions'],
    queryFn: () => getStudentContributions(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  const { data: xpHistory } = useQuery({
    queryKey: ['student', currentUser?._id, 'xp-history'],
    queryFn: () => getStudentXpHistory(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  const chartData = xpHistory?.slice(-30).map((e: { createdAt: string; amount: number }) => ({
    date: formatDate(e.createdAt),
    xp: e.amount,
  })) ?? [];

  const notifications = notificationsData?.items ?? [];

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-medium text-ink mb-1">
            Good {getGreeting()}, {currentUser?.name?.split(' ')[0] ?? ''}.
          </h2>
          <p className="text-sm text-slate">Here's your progress overview.</p>
        </div>

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-ink">Recommended for you</h3>
            <Link to="/explore" className="text-xs text-sky hover:underline">Browse all</Link>
          </div>
          {recLoading ? (
            <div className="grid gap-4">
              {[1,2,3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : !recommendations?.length ? (
            <EmptyState
              title="No recommendations yet"
              description="Complete your profile with skills and interests to get project recommendations."
              actionLabel="Edit Profile"
              onAction={() => navigate('/profile')}
            />
          ) : (
            <div className="grid gap-4">
              {recommendations.slice(0, 3).map((p: { _id: string }) => (
                <ProjectCard key={p._id} project={p as never} showMatch />
              ))}
            </div>
          )}
        </section>

        {/* Recent Contributions */}
        <section>
          <h3 className="text-sm font-medium text-ink mb-3">Recent Contributions</h3>
          {contribLoading ? (
            <div className="flex flex-col gap-2">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : !contributions?.length ? (
            <EmptyState title="No contributions yet" description="Join a project and complete verified tasks to see your contributions here." />
          ) : (
            <div className="flex flex-col divide-y divide-line border border-line rounded">
              {(contributions as Array<{ taskTitle?: string; projectTitle?: string; xpEarned?: number; createdAt: string }>).slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-ink">{c.taskTitle ?? 'Verified Task'}</p>
                    <p className="text-xs text-slate">{c.projectTitle ?? ''} · {formatRelative(c.createdAt)}</p>
                  </div>
                  {c.xpEarned && (
                    <span className="text-sm font-medium text-signal">+{c.xpEarned} XP</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* XP Chart */}
        {chartData.length > 0 && (
          <section>
            <h3 className="text-sm font-medium text-ink mb-3">XP Activity (last 30 days)</h3>
            <Card padding="sm">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', borderRadius: 4, fontSize: 12 }}
                    labelStyle={{ color: '#151A23' }}
                  />
                  <Line type="monotone" dataKey="xp" stroke="#C97A2E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">
        {/* Progression Panel */}
        <Card progression className="flex flex-col gap-4">
          {progLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-full" />
            </div>
          ) : progression ? (
            <>
              <div className="flex items-center gap-3">
                <LevelBadge level={progression.level} size="md" />
                <div>
                  <p className="text-xl font-display font-medium text-ink">{formatXP(progression.xp)} XP</p>
                  {currentUser?.reputation && (
                    <div className="flex items-center gap-1 text-xs text-slate">
                      <Star size={11} fill="currentColor" className="text-signal" />
                      {currentUser.reputation.averageRating.toFixed(1)}
                      <span>({currentUser.reputation.ratingCount})</span>
                    </div>
                  )}
                </div>
              </div>

              <XPBar xp={progression.xp} nextLevelXp={progression.nextLevelXp} animate />

              <CreditsIndicator credits={progression.projectCreationCredits} />

              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate uppercase tracking-wide">Active Projects</p>
                <RulerProgress
                  value={progression.activeProjectCount}
                  max={3}
                  tone="sky"
                  ticks={3}
                  label={`${progression.activeProjectCount} / 3 active projects`}
                />
              </div>

              {progression.unlockedCapabilities.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-slate uppercase tracking-wide">Unlocked</p>
                  {progression.unlockedCapabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-1.5 text-xs text-moss">
                      <CheckCircle size={12} /> {cap.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </Card>

        {/* Notifications preview */}
        {notifications.length > 0 && (
          <Card padding="sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate uppercase tracking-wide">Recent Notifications</p>
              <Link to="/notifications" className="text-xs text-sky hover:underline">View all</Link>
            </div>
            <NotificationList notifications={notifications.slice(0, 5)} compact />
          </Card>
        )}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
