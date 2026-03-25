import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userEmail: string;
  date: string; // YYYY-MM-DD
  weight: number;
  caloricIntake?: number;
}

const ProgressSchema = new Schema(
  {
    userEmail: { type: String, required: true, index: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
    caloricIntake: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure one progress entry per user per day
ProgressSchema.index({ userEmail: 1, date: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model<IProgress>("Progress", ProgressSchema);
