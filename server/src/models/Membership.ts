import mongoose, { Schema, Document } from 'mongoose';

export interface IContributionStats {
  tasksAssigned: number;
  tasksCompleted: number;
  tasksVerified: number;
  tasksCompletedOnTime: number;
  xpEarned: number;
  contributionScore: number;
}

export interface IMembership extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'OWNER' | 'CONTRIBUTOR';
  requestedRole?: string;
  status: 'ACTIVE' | 'LEFT' | 'REMOVED' | 'COMPLETED';
  contributionStats: IContributionStats;
  joinedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['OWNER', 'CONTRIBUTOR'], default: 'CONTRIBUTOR' },
    requestedRole: { type: String, default: '' },
    status: { type: String, enum: ['ACTIVE', 'LEFT', 'REMOVED', 'COMPLETED'], default: 'ACTIVE' },
    contributionStats: {
      tasksAssigned: { type: Number, default: 0 },
      tasksCompleted: { type: Number, default: 0 },
      tasksVerified: { type: Number, default: 0 },
      tasksCompletedOnTime: { type: Number, default: 0 },
      xpEarned: { type: Number, default: 0 },
      contributionScore: { type: Number, default: 0 },
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Membership = mongoose.model<IMembership>('Membership', MembershipSchema);
