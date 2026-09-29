import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { updateMe } from '../api/students';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { LevelBadge } from '../components/progression/LevelBadge';
import { XPBar } from '../components/progression/XPBar';
import { useProgression } from '../hooks/useProgression';
import { toast } from '../hooks/useToast';
import { extractError } from '../api/client';
import { getErrorMessage } from '../lib/errorCodes';
import { Star, X, Plus } from 'lucide-react';
import { getSkills } from '../api/skills';

export function ProfilePage() {
  const { currentUser } = useAuthStore();
  const qc = useQueryClient();
  const { data: progression } = useProgression();
  const { data: allSkills } = useQuery({ queryKey: ['skills'], queryFn: getSkills, staleTime: Infinity });

  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [college, setCollege] = useState(currentUser?.college ?? '');
  const [department, setDepartment] = useState(currentUser?.department ?? '');
  const [academicYear, setAcademicYear] = useState(currentUser?.academicYear ?? '');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(currentUser?.interests ?? []);
  const [saving, setSaving] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { bio: string; college: string; department: string; academicYear: string; interests: string[] }) => updateMe(data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['me'] });
      toast('success', 'Profile saved');
    },
    onError: (err) => {
      const { code, message } = extractError(err);
      toast('error', getErrorMessage(code, message));
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ bio, college, department, academicYear, interests });
  };

  const addInterest = () => {
    const t = interestInput.trim();
    if (t && !interests.includes(t)) setInterests([...interests, t]);
    setInterestInput('');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Header */}
      <Card className="flex items-start gap-4">
        <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="xl" />
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-medium text-ink">{currentUser.name}</h2>
          <p className="text-sm text-slate">{currentUser.email}</p>
          {progression && (
            <div className="flex items-center gap-3 mt-2">
              <LevelBadge level={progression.level} size="sm" />
              <span className="text-sm text-signal font-medium">{progression.xp.toLocaleString()} XP</span>
              {currentUser.reputation && (
                <div className="flex items-center gap-1 text-xs text-slate">
                  <Star size={11} fill="currentColor" className="text-signal" />
                  {currentUser.reputation.averageRating.toFixed(1)} ({currentUser.reputation.ratingCount})
                </div>
              )}
            </div>
          )}
          {progression && <XPBar xp={progression.xp} nextLevelXp={progression.nextLevelXp} className="mt-2" />}
        </div>
      </Card>

      {/* Edit form */}
      <Card>
        <h3 className="font-display text-base font-medium text-ink mb-4">Edit Profile</h3>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Textarea
            id="profile-bio"
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell others about yourself…"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input id="profile-college" label="College / University" value={college} onChange={(e) => setCollege(e.target.value)} />
            <Input id="profile-dept" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            <Input id="profile-year" label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g. 3rd Year" />
          </div>

          {/* Interests */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate uppercase tracking-wide">Interests</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 bg-paper border border-line rounded text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
                placeholder="Add an interest"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
              />
              <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} onClick={addInterest}>Add</Button>
            </div>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <Badge variant="sky">{t}</Badge>
                    <button type="button" onClick={() => setInterests(interests.filter((x) => x !== t))} className="text-slate hover:text-rust cursor-pointer"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" loading={mutation.isPending}>Save Changes</Button>
        </form>
      </Card>

      {/* Capabilities */}
      {currentUser.unlockedCapabilities.length > 0 && (
        <Card>
          <h3 className="font-display text-base font-medium text-ink mb-3">Unlocked Capabilities</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.unlockedCapabilities.map((cap) => (
              <Badge key={cap} variant="signal">{cap.replace(/_/g, ' ')}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
