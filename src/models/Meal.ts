import mongoose, { Schema, Document } from "mongoose";

export interface IMeal extends Document {
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
}

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
  },
  { timestamps: true }
);

// Prevent incorrect meal insertion for vegans
MealSchema.pre("save", function (this: any, next: any) {
  if (this.dietType === "vegan" && this.ingredients && this.ingredients.length > 0) {
    const nonVeganKeywords = ["dairy", "milk", "cheese", "yogurt", "egg", "chicken", "meat", "fish", "samonl"];
    const lowercaseIngredients = this.ingredients.map((i: string) => i.toLowerCase());

    for (const ingredient of lowercaseIngredients) {
      for (const keyword of nonVeganKeywords) {
        // Check for exact word matches or close matches
        if (ingredient.includes(keyword)) {
          return next(new Error(`Validation Error: Vegan meal cannot contain animal product keyword: '${keyword}' found in ingredient '${ingredient}'`));
        }
      }
    }
  }
  next();
});

export default mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);
