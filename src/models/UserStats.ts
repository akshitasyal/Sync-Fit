import mongoose, { Schema } from "mongoose";
import { IUserStats } from "@/types/user";

const UserStatsSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    badges: [{ type: String }],
    lastActiveDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.UserStats || mongoose.model<IUserStats>("UserStats", UserStatsSchema);
