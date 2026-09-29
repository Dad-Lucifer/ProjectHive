export type TaskDifficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  xpReward: number;
  assignedTo?: string;
  createdBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationComment?: string;
  completedOnTime?: boolean;
}
