import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  userEmail: string;
  weekStartDate: string; // YYYY-MM-DD representing Monday
  days: {
    date: string;
    dayOfWeek: string;
    meals: {
      mealId?: mongoose.Types.ObjectId;
      slot: string; // "breakfast", "lunch", "dinner", "snack"
    }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
}

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

// Clear the model if it exists to pick up schema changes during development
if (mongoose.models.MealPlan) {
  delete mongoose.models.MealPlan;
}

export default mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
