export type Proficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface UserSkill {
  skillId: string;
  proficiency: Proficiency;
  yearsExperience: number;
}

export interface Availability {
  day: number;
  startMinutes: number;
  endMinutes: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  bio?: string;
  avatarUrl?: string;
  college?: string;
  department?: string;
  academicYear?: string;
  interests: string[];
  skills: UserSkill[];
  availability: Availability[];
  level: number;
  xp: number;
  reputation: { averageRating: number; ratingCount: number };
  projectCreationCredits: number;
  ownedProjectCount: number;
  completedProjectCount: number;
  activeProjectCount: number;
  unlockedCapabilities: string[];
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
}
