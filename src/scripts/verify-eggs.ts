import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });

import Meal from "../models/Meal";

async function verify() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri);

  const eggs = await Meal.find({
    dietType: "vegetarian",
    ingredients: { $regex: "\\begg(s)?\\b", $options: "i" }
  });

  if (eggs.length > 0) {
    console.log("❌ CRITICAL: Found", eggs.length, "veg meals with eggs:");
    eggs.forEach(e => console.log(` - ${e.name} (Ingredients: ${e.ingredients.join(", ")})`));
  } else {
    console.log("✅ SUCCESS: No vegetarian meals with eggs found in the database.");
  }
  process.exit(0);
}

verify().catch(console.error);
