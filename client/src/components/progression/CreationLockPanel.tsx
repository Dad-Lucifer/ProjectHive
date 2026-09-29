import { Lock, Zap, FolderKanban, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { nextCreationUnlockLevel } from '../../lib/levelMath';
import type { User } from '../../types/user';
import type { ProgressionData } from '../../api/progression';

interface CreationLockPanelProps {
  user: User;
  progression: ProgressionData;
}

export function CreationLockPanel({ user, progression }: CreationLockPanelProps) {
  const navigate = useNavigate();
  const { level, projectCreationCredits, activeProjectCount } = progression;
  const { unlockedCapabilities } = user;
  const isOwner = unlockedCapabilities?.includes('PROJECT_OWNER');

  // Gate 1: below level 5
  if (level < 5) {
    return (
      <Card className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-slate flex-shrink-0" />
            <h2 className="text-lg font-display font-medium text-ink">Project Creation Locked</h2>
          </div>
          <p className="text-sm text-slate">
            Reach Level 5 by contributing to projects and completing verified tasks.
          </p>
          <p className="text-xs text-slate">Current level: <span className="font-medium text-ink">{level}</span></p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/explore')}>
            Explore Projects
          </Button>
        </div>
      </Card>
    );
  }

  // Gate 2: no credits
  if (projectCreationCredits === 0) {
    const nextUnlock = nextCreationUnlockLevel(level);
    return (
      <Card className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-slate flex-shrink-0" />
            <h2 className="text-lg font-display font-medium text-ink">No project creation credit available.</h2>
          </div>
          <p className="text-sm text-slate">
            Next unlock: <span className="font-medium text-ink">Level {nextUnlock}</span>
          </p>
        </div>
      </Card>
    );
  }

  // Gate 3: too many active projects
  if (activeProjectCount >= 3) {
    return (
      <Card className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FolderKanban size={20} className="text-slate flex-shrink-0" />
            <h2 className="text-lg font-display font-medium text-ink">Project creation temporarily unavailable.</h2>
          </div>
          <p className="text-sm text-slate">You already participate in 3 active projects.</p>
        </div>
      </Card>
    );
  }

  // Gate 4: owner contribution required
  if (isOwner && progression.ownedProjectCount > 0 && activeProjectCount <= 1) {
    return (
      <Card className="max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-slate flex-shrink-0" />
            <h2 className="text-lg font-display font-medium text-ink">Contributor requirement not met.</h2>
          </div>
          <p className="text-sm text-slate">
            As a Project Owner, you must actively contribute to at least one other project before starting another project.
          </p>
        </div>
      </Card>
    );
  }

  return null;
}
