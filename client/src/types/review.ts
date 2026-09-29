export interface Review {
  _id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  reviewer?: { _id: string; name: string; avatarUrl?: string };
}
