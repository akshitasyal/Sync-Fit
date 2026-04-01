import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  energyLevel?: "low" | "medium" | "high";
  sleepQuality?: "poor" | "average" | "good";
  goal?: "weight loss" | "maintenance" | "muscle gain";
  recommendations?: {
    bmi: number;
    recommendedCalories: number;
    dietType: string;
    workoutIntensity: string;
  };
  dietPreference?: string; // diet TYPE: Vegetarian | Non-Vegetarian | Vegan
  dietGoal?: string;       // macro GOAL: High-Protein | Low-Carb | Keto | Balanced Diet
  favoriteMeals?: mongoose.Types.ObjectId[];
  dislikedMeals?: mongoose.Types.ObjectId[];
  dislikedExercises?: mongoose.Types.ObjectId[];
  workoutFeedback?: "too-easy" | "perfect" | "too-hard";
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  isFastingMode?: boolean;
  selectedProgram?: "strength" | "weight-loss" | "cardio" | "adaptive" | "muscle-gain" | "beginner";
  programStartDate?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    energyLevel: { type: String, enum: ["low", "medium", "high"] },
    sleepQuality: { type: String, enum: ["poor", "average", "good"] },
    goal: { type: String, enum: ["weight loss", "maintenance", "muscle gain"] },
    recommendations: {
      bmi: { type: Number },
      recommendedCalories: { type: Number },
      dietType: { type: String },
      workoutIntensity: { type: String },
    },
    dietPreference: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Vegan"], default: "Non-Vegetarian" },
    dietGoal: { type: String, enum: ["Balanced Diet", "High-Protein", "Low-Carb", "Keto"], default: "Balanced Diet" },
    favoriteMeals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    dislikedMeals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    dislikedExercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
    workoutFeedback: { type: String, enum: ["too-easy", "perfect", "too-hard"], default: "perfect" },
    experienceLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    isFastingMode: { type: Boolean, default: false },
    selectedProgram: { type: String, enum: ["strength", "weight-loss", "cardio", "adaptive", "muscle-gain", "beginner"], default: null },
    programStartDate: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
