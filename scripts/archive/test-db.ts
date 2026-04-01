import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MealSchema = new mongoose.Schema({
  name: String,
  dietType: String,
  category: String,
  type: String,
  tags: [String]
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", MealSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected");
  const count = await Meal.countDocuments();
  console.log("Total meals:", count);
  
  const vegans = await Meal.find({ dietType: "vegan" }).lean();
  console.log("Vegan meals count:", vegans.length);

  const vegansIn = await Meal.find({ dietType: { $in: ["vegan"] } }).lean();
  console.log("Vegan meals ($in) count:", vegansIn.length);

  if (vegans.length > 0) {
    console.log("Sample vegan meal:", vegans[0]);
  } else {
    const all = await Meal.find().limit(2).lean();
    console.log("Sample any meal:", all);
  }
  process.exit(0);
}
run();
