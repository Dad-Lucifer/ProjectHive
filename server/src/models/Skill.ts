import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category?: string;
  description?: string;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
