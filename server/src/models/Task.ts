import mongoose, { Schema, Document } from 'mongoose';

export type TaskDifficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  xpReward: number;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  verificationComment?: string;
  completedOnTime?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'], default: 'BASIC' },
    xpReward: { type: Number, default: 50 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'TODO' },
    dueDate: { type: Date },
    submittedAt: { type: Date },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationComment: { type: String },
    completedOnTime: { type: Boolean },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
