import mongoose, { Schema } from "mongoose";
import { IProgress } from "@/types/user";

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
