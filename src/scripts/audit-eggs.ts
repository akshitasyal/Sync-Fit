import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });

import Meal from "../models/Meal";

async function audit() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri);

  console.log("🔍 Auditing database for eggs...");

  const eggs = await Meal.find({
    $or: [
      { name: { $regex: "egg", $options: "i" } },
      { ingredients: { $regex: "egg", $options: "i" } }
    ]
  }).lean();

  console.log(`Found ${eggs.length} meals with egg-related content:`);
  
  for (const m of eggs) {
    console.log(` - [${m.dietType}] ${m.name} | Ingredients: ${m.ingredients.join(", ")}`);
  }

  process.exit(0);
}

audit().catch(console.error);
