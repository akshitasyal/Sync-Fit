export const DIET_TYPES = ["Vegan", "Vegetarian", "Non-Vegetarian"] as const;
export type DietType = typeof DIET_TYPES[number];

export const DIET_GOALS = ["Balanced Diet", "High-Protein", "Low-Carb", "Keto"] as const;
export type DietGoal = typeof DIET_GOALS[number];

export const GOAL_TAG_MAP: Record<string, string> = {
  "high-protein": "High-Protein",
  "low-carb":     "Low-Carb",
  "keto":         "Keto",
  "balanced diet":"Balanced Diet",
};

export const FASTING_MEAL_TYPES = ["Sabudana Khichdi", "Fruits", "Dry Fruits", "Kuttu Roti", "Sweet Potato"];
