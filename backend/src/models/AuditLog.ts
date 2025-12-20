import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  previousStatus: string;
  newStatus: string;
  timestamp: Date;
}

const auditLogSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, default: 'STATUS_UPDATE' },
  previousStatus: { type: String },
  newStatus: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);