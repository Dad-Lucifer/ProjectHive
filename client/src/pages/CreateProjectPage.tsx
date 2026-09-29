import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useProgression } from '../hooks/useProgression';
import { useCreateProject } from '../hooks/useProjects';
import { CreationLockPanel } from '../components/progression/CreationLockPanel';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { getCategories } from '../api/categories';
import { getSkills } from '../api/skills';
import { toast } from '../hooks/useToast';
import { extractError } from '../api/client';
import { getErrorMessage } from '../lib/errorCodes';
import { X } from 'lucide-react';

export function CreateProjectPage() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const { data: progression, isLoading: progLoading } = useProgression();
  const mutation = useCreateProject();

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: getSkills, staleTime: Infinity });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [estimatedWeeks, setEstimatedWeeks] = useState('');
  const [error, setError] = useState('');

  if (progLoading || !progression || !currentUser) {
    return <div className="flex flex-col gap-3"><Skeleton className="h-32" /></div>;
  }

  // Check all four gating conditions
  const lockPanel = <CreationLockPanel user={currentUser} progression={progression} />;
  if (lockPanel) {
    // Check if we have a reason to show lock panel
    const { level, projectCreationCredits, activeProjectCount, ownedProjectCount } = progression;
    const isOwner = currentUser.unlockedCapabilities?.includes('PROJECT_OWNER');
    if (
      level < 5 ||
      projectCreationCredits === 0 ||
      activeProjectCount >= 3 ||
      (isOwner && ownedProjectCount > 0 && activeProjectCount <= 1)
    ) {
      return <CreationLockPanel user={currentUser} progression={progression} />;
    }
  }

  const addTech = (tech: string) => {
    const t = tech.trim();
    if (t && !techStack.includes(t)) setTechStack([...techStack, t]);
    setTechInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!categoryId) { setError('Please select a category.'); return; }

    try {
      const project = await mutation.mutateAsync({
        title, description, categoryId,
        difficulty: difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
        techStack,
        estimatedDurationWeeks: estimatedWeeks ? Number(estimatedWeeks) : undefined,
      });
      toast('success', 'Project created!');
      navigate(`/projects/${(project as { _id: string })._id}`);
    } catch (err) {
      const { code, message } = extractError(err);
      setError(getErrorMessage(code, message));
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input id="cp-title" label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea id="cp-desc" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
        <Select
          id="cp-category"
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Select category"
          options={(categories ?? []).map((c) => ({ value: c._id, label: c.name }))}
        />
        <Select
          id="cp-difficulty"
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          options={[
            { value: 'BEGINNER', label: 'Beginner' },
            { value: 'INTERMEDIATE', label: 'Intermediate' },
            { value: 'ADVANCED', label: 'Advanced' },
            { value: 'EXPERT', label: 'Expert' },
          ]}
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate uppercase tracking-wide">Tech Stack</label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 bg-paper border border-line rounded text-ink text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
              placeholder="Type a technology and press Enter"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); } }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => addTech(techInput)}>Add</Button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <Badge variant="slate">{t}</Badge>
                  <button type="button" onClick={() => setTechStack(techStack.filter((x) => x !== t))} className="text-slate hover:text-rust cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <Input id="cp-weeks" label="Estimated Duration (weeks)" type="number" min={1} value={estimatedWeeks} onChange={(e) => setEstimatedWeeks(e.target.value)} />
        {error && <p className="text-sm text-rust">{error}</p>}
        <Button type="submit" loading={mutation.isPending}>Create Project</Button>
      </form>
    </div>
  );
}
