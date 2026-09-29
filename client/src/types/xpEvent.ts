export interface XpEvent {
  _id: string;
  userId: string;
  amount: number;
  reason: string;
  taskId?: string;
  projectId?: string;
  createdAt: string;
}
