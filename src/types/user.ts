import { Types } from "mongoose";

export interface IUser {
  _id: string;
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
  favoriteMeals?: string[];
  dislikedMeals?: string[];
  dislikedExercises?: string[];
  workoutFeedback?: "too-easy" | "perfect" | "too-hard";
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  isFastingMode?: boolean;
  selectedProgram?: "strength" | "weight-loss" | "cardio" | "adaptive" | "muscle-gain" | "beginner";
  programStartDate?: string;
}

export interface IUserStats {
  _id: string;
  userEmail: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  lastActiveDate?: string;
}

export interface IDailyLog {
  _id: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  mealsConsumed: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    timestamp: Date;
  }[];
  totalCalories: number;
  targetCalories: number;
}

export interface IProgress {
  _id: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  weight: number;
  caloricIntake?: number;
}
