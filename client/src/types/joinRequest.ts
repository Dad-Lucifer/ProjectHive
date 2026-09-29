import type { MatchScore } from './project';

export type JoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface JoinRequest {
  _id: string;
  projectId: string;
  applicantId: string;
  requestedRole?: string;
  message?: string;
  matchSnapshot: MatchScore;
  status: JoinRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  applicant?: {
    _id: string;
    name: string;
    avatarUrl?: string;
    level: number;
    xp: number;
    completedProjectCount: number;
    activeProjectCount: number;
    reputation: { averageRating: number; ratingCount: number };
    skills: Array<{ skillId: string; proficiency: string; yearsExperience: number }>;
  };
}
