import { useQuery } from '@tanstack/react-query';
import {
  getAnalyticsOverview, getProjectsByCategory, getPopularSkills,
  getXpTrends, getProjectParticipation
} from '../../api/analytics';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2C5C7A', '#3E6B52', '#C97A2E', '#B8452F', '#5B6472', '#4A6E8A', '#528564'];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card padding="md">
      <p className="text-2xl font-display font-medium text-ink">{value}</p>
      <p className="text-xs text-slate mt-1">{label}</p>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: getAnalyticsOverview,
  });
  const { data: byCategory } = useQuery({
    queryKey: ['analytics', 'by-category'],
    queryFn: getProjectsByCategory,
  });
  const { data: popularSkills } = useQuery({
    queryKey: ['analytics', 'popular-skills'],
    queryFn: getPopularSkills,
  });
  const { data: xpTrends } = useQuery({
    queryKey: ['analytics', 'xp-trends'],
    queryFn: getXpTrends,
  });
  const { data: participation } = useQuery({
    queryKey: ['analytics', 'participation'],
    queryFn: getProjectParticipation,
  });

  const ov = overview as Record<string, number> | undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Stat tiles */}
      {overviewLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : ov ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={ov.totalStudents ?? '—'} />
          <StatCard label="Total Projects" value={ov.totalProjects ?? '—'} />
          <StatCard label="Active Projects" value={ov.activeProjects ?? '—'} />
          <StatCard label="Completed Projects" value={ov.completedProjects ?? '—'} />
          <StatCard label="Verified Tasks" value={ov.totalVerifiedTasks ?? '—'} />
          <StatCard label="Total XP Awarded" value={ov.totalXpAwarded?.toLocaleString() ?? '—'} />
          <StatCard label="Request Accept Rate" value={ov.joinRequestAcceptanceRate != null ? `${Math.round(ov.joinRequestAcceptanceRate * 100)}%` : '—'} />
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Projects by Category */}
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-4">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCategory as Record<string, unknown>[] | undefined}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2C5C7A" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* XP Trends */}
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-4">XP Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={xpTrends as Record<string, unknown>[] | undefined}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', fontSize: 12 }} />
              <Line type="monotone" dataKey="xp" stroke="#C97A2E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Popular Skills */}
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-4">Popular Skills</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={popularSkills as Record<string, unknown>[] | undefined} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#5B6472' }} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', fontSize: 12 }} />
              <Bar dataKey="count" fill="#3E6B52" radius={[0,2,2,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Project Participation */}
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-4">Project Participation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={participation as Record<string, unknown>[] | undefined}
                dataKey="count"
                nameKey="status"
                cx="50%" cy="50%"
                outerRadius={70}
                label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
              >
                {(participation as Record<string, unknown>[] | undefined)?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#FBFAF7', border: '1px solid #E4E1D8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
