import mongoose, { Schema } from "mongoose";
import { IMeal } from "@/types/meal";

const MealSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["cutting", "maintenance", "bulking"] },
    dietType: { type: String, enum: ["vegan", "vegetarian", "non-vegetarian"], required: true, index: true },
    tags: [{ type: String }],
    category: { type: String, enum: ["breakfast", "lunch", "dinner", "snack", "pre-workout", "post-workout", "fasting"] },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    ingredients: [{ type: String }],
    preparationSteps: [{ type: String }],
    imageUrl: { type: String },
    isFastingMeal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent incorrect meal insertion for vegans and vegetarians
MealSchema.pre("save", function (this: any) {
  if ((this.dietType === "vegan" || this.dietType === "vegetarian") && this.ingredients && this.ingredients.length > 0) {
    const nonVegKeywords = ["chicken", "meat", "fish", "salmon", "beef", "pork", "lamb", "mutton", "turkey", "shrimp", "tuna", "prawn", "bacon"];
    
    // Vegans only
    const veganDisallowed = ["dairy", "cheese", "yogurt", "milk", "egg", "honey", "ghee", "butter", "curd", "paneer"];
    
    // Vegetarians only (allow dairy, disallow eggs)
    const vegDisallowed = ["egg"];

    const lowercaseIngredients = this.ingredients.map((i: string) => i.toLowerCase());

    for (const ingredient of lowercaseIngredients) {
      // 1. Check for meat (DISALLOWED FOR BOTH)
      for (const keyword of nonVegKeywords) {
        if (ingredient.includes(keyword)) {
          throw new Error(`Validation Error: ${this.dietType} meal cannot contain meat: '${keyword}'. Found in ingredient '${ingredient}'`);
        }
      }

      // 2. Check for eggs (DISALLOWED FOR BOTH)
      if (ingredient.includes("egg") && !ingredient.includes("eggplant")) {
        throw new Error(`Validation Error: ${this.dietType} meal cannot contain eggs. Found in ingredient '${ingredient}'`);
      }

      // 3. Check for dairy (DISALLOWED FOR VEGAN ONLY)
      if (this.dietType === "vegan") {
        for (const keyword of veganDisallowed) {
          if (ingredient.includes(keyword)) {
            // Check for plant milks exception
            if (keyword === "milk" && (ingredient.includes("almond") || ingredient.includes("coconut") || ingredient.includes("soy") || ingredient.includes("oat"))) {
              continue;
            }
            throw new Error(`Validation Error: Vegan meal cannot contain animal/dairy product: '${keyword}'. Found in ingredient '${ingredient}'`);
          }
        }
      }
    }
  }
});

export default mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);
