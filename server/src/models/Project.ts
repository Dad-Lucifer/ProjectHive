import mongoose, { Schema, Document } from 'mongoose';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export interface IProjectRequirement {
  skillId: string;
  minimumProficiency: string;
  importance: 'REQUIRED' | 'PREFERRED';
}

export interface IProjectRole {
  name: string;
  description?: string;
  requiredSkills: string[];
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  difficulty: Difficulty;
  techStack: string[];
  requirements: IProjectRequirement[];
  roles: IProjectRole[];
  ownerId: mongoose.Types.ObjectId;
  ownerName?: string;
  ownerAvatarUrl?: string;
  status: ProjectStatus;
  estimatedDurationWeeks?: number;
  startDate?: Date;
  targetEndDate?: Date;
  completedAt?: Date;
  memberCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    difficulty: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], default: 'BEGINNER' },
    techStack: [{ type: String }],
    requirements: [
      {
        skillId: String,
        minimumProficiency: String,
        importance: { type: String, enum: ['REQUIRED', 'PREFERRED'], default: 'REQUIRED' },
      },
    ],
    roles: [
      {
        name: String,
        description: String,
        requiredSkills: [String],
      },
    ],
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String },
    ownerAvatarUrl: { type: String },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED'], default: 'OPEN' },
    estimatedDurationWeeks: { type: Number, default: 4 },
    startDate: { type: Date },
    targetEndDate: { type: Date },
    completedAt: { type: Date },
    memberCount: { type: Number, default: 1 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
