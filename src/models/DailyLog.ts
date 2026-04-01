import mongoose, { Schema } from "mongoose";
import { IDailyLog } from "@/types/user";

const DailyLogSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, index: true },
    date: { type: String, required: true },
    mealsConsumed: [
      {
        name: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number },
        carbs: { type: Number },
        fats: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    totalCalories: { type: Number, default: 0 },
    targetCalories: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.DailyLog || mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);
