import mongoose, { Schema } from "mongoose";
import { IMealPlan } from "@/types/meal";

const MealPlanSchema = new Schema(
  {
    userEmail: { type: String, required: true, index: true },
    weekStartDate: { type: String, required: true },
    days: [{
      date: { type: String, required: true },
      dayOfWeek: { type: String, required: true },
      meals: [
        {
          mealId: { type: Schema.Types.ObjectId, ref: "Meal", required: false },
          slot: { type: String, required: true },
        },
      ],
      totalCalories: { type: Number, default: 0 },
      totalProtein: { type: Number, default: 0 },
      totalCarbs: { type: Number, default: 0 },
      totalFat: { type: Number, default: 0 },
    }]
  },
  { timestamps: true }
);

// Ensure one weekly meal plan per user per week start date
MealPlanSchema.index({ userEmail: 1, weekStartDate: 1 }, { unique: true });

// Only clear the cached model in development so hot-reload picks up schema changes.
// In production this must NOT run — re-creating the model on every import causes
// OverwriteModelError and discards buffered Mongoose operations.
if (process.env.NODE_ENV !== "production" && mongoose.models.MealPlan) {
  delete mongoose.models.MealPlan;
}

export default mongoose.models.MealPlan || mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
