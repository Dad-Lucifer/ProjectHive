import type { Proficiency } from './user';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export interface ProjectRequirement {
  skillId: string;
  minimumProficiency: Proficiency;
  importance: 'REQUIRED' | 'PREFERRED';
}

export interface ProjectRole {
  name: string;
  description?: string;
  requiredSkills: string[];
}

export interface MatchScore {
  overallScore: number;
  skillScore: number;
  interestScore: number;
  experienceScore: number;
  availabilityScore: number;
  collaborationScore: number;
  reputationScore: number;
  workloadScore: number;
  reasons: string[];
  gaps: string[];
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  difficulty: Difficulty;
  techStack: string[];
  requirements: ProjectRequirement[];
  roles: ProjectRole[];
  ownerId: string;
  ownerName?: string;
  ownerAvatarUrl?: string;
  status: ProjectStatus;
  estimatedDurationWeeks?: number;
  startDate?: string;
  targetEndDate?: string;
  completedAt?: string;
  memberCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  matchScore?: MatchScore;
}
