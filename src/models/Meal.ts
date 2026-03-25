import mongoose, { Schema, Document } from "mongoose";

export interface IMeal extends Document {
  name: string;
  type: "cutting" | "maintenance" | "bulking";
  dietType: string[]; // ["Vegetarian", "Vegan", "High-Protein", "Low-Carb", "Keto", "Balanced Diet", "Non-Vegetarian"]
  category: "breakfast" | "lunch" | "dinner" | "snack" | "pre-workout" | "post-workout";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  preparationSteps: string[];
  imageUrl?: string;
}

const MealSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["cutting", "maintenance", "bulking"], required: true },
    dietType: [{ type: String, required: true }],
    category: { type: String, enum: ["breakfast", "lunch", "dinner", "snack", "pre-workout", "post-workout"], required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    ingredients: [{ type: String }],
    preparationSteps: [{ type: String }],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);
