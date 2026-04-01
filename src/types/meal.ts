import { Types } from "mongoose";

export interface IMeal {
  _id: string;
  name: string;
  type?: "cutting" | "maintenance" | "bulking" | string;
  dietType: "vegan" | "vegetarian" | "non-vegetarian";
  tags?: string[];
  category?: "breakfast" | "lunch" | "dinner" | "snack" | "pre-workout" | "post-workout" | "fasting";
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: string[];
  preparationSteps?: string[];
  imageUrl?: string;
  isFastingMeal?: boolean;
}

export interface IMealPlan {
  _id: string;
  userEmail: string;
  weekStartDate: string; // YYYY-MM-DD representing Monday
  days: {
    date: string;
    dayOfWeek: string;
    meals: {
      mealId: IMeal | string;
      slot: string; // "breakfast", "lunch", "dinner", "snack"
    }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
}

export interface IShoppingListItem {
  name: string;
  quantity: number;
  category: string;
  isChecked: boolean;
}

export interface IShoppingList {
  _id: string;
  userEmail: string;
  items: IShoppingListItem[];
}
