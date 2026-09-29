import mongoose, { Schema, Document } from 'mongoose';

export interface IXpEvent extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  taskId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const XpEventSchema = new Schema<IXpEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

export const XpEvent = mongoose.model<IXpEvent>('XpEvent', XpEventSchema);
