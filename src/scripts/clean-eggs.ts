// ── Load .env.local FIRST — before any import that reads process.env ──
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });
dotenv.config({ path: resolve(process.cwd(), ".env"), override: false }); // fallback

if (!process.env.MONGODB_URI) {
  console.error("[clean-eggs] ❌ MONGODB_URI is undefined. Check your .env.local file.");
  process.exit(1);
}

import connectToDatabase from "../lib/mongodb";
import Meal from "../models/Meal";

async function cleanEggs() {
  await connectToDatabase();

  const res = await Meal.deleteMany({
    dietType: "vegetarian",
    ingredients: { $regex: "\\begg(s)?\\b", $options: "i" },
  });

  console.log(`✅ Deleted ${res.deletedCount} vegetarian meals containing eggs from MongoDB.`);
  process.exit(0);
}

cleanEggs().catch((err) => {
  console.error("❌ clean-eggs failed:", err.message);
  process.exit(1);
});
