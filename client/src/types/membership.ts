export interface ContributionStats {
  tasksAssigned: number;
  tasksCompleted: number;
  tasksVerified: number;
  tasksCompletedOnTime: number;
  xpEarned: number;
  contributionScore: number;
}

export interface ProjectMembership {
  _id: string;
  projectId: string;
  userId: string;
  role: 'OWNER' | 'CONTRIBUTOR';
  requestedRole?: string;
  status: 'ACTIVE' | 'LEFT' | 'REMOVED' | 'COMPLETED';
  contributionStats: ContributionStats;
  joinedAt: string;
  user?: {
    _id: string;
    name: string;
    avatarUrl?: string;
    level: number;
    xp: number;
  };
}
