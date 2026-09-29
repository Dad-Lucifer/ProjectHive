import mongoose, { Schema, Document } from 'mongoose';

export type JoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface IJoinRequest extends Document {
  projectId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  requestedRole?: string;
  message?: string;
  matchSnapshot: any;
  status: JoinRequestStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JoinRequestSchema = new Schema<IJoinRequest>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedRole: { type: String, default: '' },
    message: { type: String, default: '' },
    matchSnapshot: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'], default: 'PENDING' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const JoinRequest = mongoose.model<IJoinRequest>('JoinRequest', JoinRequestSchema);
