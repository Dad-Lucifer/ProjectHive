import mongoose, { Schema, Document } from 'mongoose';

export type Proficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface IUserSkill {
  skillId: string;
  proficiency: Proficiency;
  yearsExperience: number;
}

export interface IAvailability {
  day: number;
  startMinutes: number;
  endMinutes: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'ADMIN';
  bio?: string;
  avatarUrl?: string;
  college?: string;
  department?: string;
  academicYear?: string;
  interests: string[];
  skills: IUserSkill[];
  availability: IAvailability[];
  level: number;
  xp: number;
  reputation: { averageRating: number; ratingCount: number };
  projectCreationCredits: number;
  ownedProjectCount: number;
  completedProjectCount: number;
  activeProjectCount: number;
  unlockedCapabilities: string[];
  suspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    college: { type: String, default: '' },
    department: { type: String, default: '' },
    academicYear: { type: String, default: '' },
    interests: [{ type: String }],
    skills: [
      {
        skillId: String,
        proficiency: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], default: 'BEGINNER' },
        yearsExperience: { type: Number, default: 0 },
      },
    ],
    availability: [
      {
        day: Number,
        startMinutes: Number,
        endMinutes: Number,
      },
    ],
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    reputation: {
      averageRating: { type: Number, default: 5.0 },
      ratingCount: { type: Number, default: 0 },
    },
    projectCreationCredits: { type: Number, default: 0 },
    ownedProjectCount: { type: Number, default: 0 },
    completedProjectCount: { type: Number, default: 0 },
    activeProjectCount: { type: Number, default: 0 },
    unlockedCapabilities: [{ type: String }],
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
