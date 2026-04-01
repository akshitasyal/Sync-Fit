import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });
dotenv.config({ path: resolve(process.cwd(), ".env"), override: false });

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined.");
  process.exit(1);
}

import connectToDatabase from "../lib/mongodb";
import Meal from "../models/Meal";

const fastingMealsToSeed = [
  // ── Breakfast ──────────────────────────────────────────────────────────
  { name: "Sabudana Khichdi (Vrat Specials)", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 320, protein: 5, carbs: 64, fat: 8, ingredients: ["Sabudana", "Peanuts", "Green Chilies", "Cumin", "Ghee"], preparationSteps: ["Soak sabudana.", "Sauté cumin + chilies in ghee.", "Add peanuts + sabudana, cook until translucent."] },
  { name: "Singhare ki Puri", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "bulking", tags: ["Fasting", "Gluten-Free"], calories: 355, protein: 6, carbs: 52, fat: 14, ingredients: ["Water Chestnut Flour (Singhara)", "Potato", "Rock Salt", "Ghee"], preparationSteps: ["Knead flour with potato + salt.", "Roll and fry in ghee."] },
  { name: "Kuttu ka Chilla", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 280, protein: 7, carbs: 45, fat: 8, ingredients: ["Buckwheat Flour (Kuttu)", "Yogurt", "Rock Salt", "Green Chilies", "Ghee"], preparationSteps: ["Mix flour with yogurt and water.", "Cook thin pancakes on tawa."] },
  { name: "Banana & Almond Milk Smoothie", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 240, protein: 6, carbs: 32, fat: 9, ingredients: ["Banana", "Almond Milk", "Dates", "Cardamom"], preparationSteps: ["Blend banana, milk, and dates.", "Sprinkle cardamom."] },
  { name: "Makhana Porridge", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting", "High-Protein"], calories: 220, protein: 8, carbs: 28, fat: 8, ingredients: ["Fox Nuts (Makhana)", "Milk", "Almonds", "Saffron", "Honey"], preparationSteps: ["Roast and crush makhana.", "Boil in milk.", "Add almonds and honey."] },
  { name: "Papaya & Apple Bowl", dietType: "vegan", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 150, protein: 1, carbs: 38, fat: 0, ingredients: ["Papaya", "Apple", "Lemon Juice"], preparationSteps: ["Dice fruits.", "Sprinkle with lemon juice."] },
  { name: "Rajgira (Amaranth) Porridge", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "bulking", tags: ["Fasting", "High-Protein"], calories: 290, protein: 10, carbs: 48, fat: 6, ingredients: ["Rajgira Flour", "Milk", "Jaggery", "Cashews"], preparationSteps: ["Roast flour in ghee.", "Add milk and simmer.", "Sweeten with jaggery."] },

  // ── Lunch ──────────────────────────────────────────────────────────────
  { name: "Sama Rice Pulao", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 380, protein: 6, carbs: 70, fat: 8, ingredients: ["Sama (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Rock Salt", "Cumin"], preparationSteps: ["Roast sama rice.", "Add potatoes and spices.", "Cook with water."] },
  { name: "Kuttu Roti with Aloo Sabzi", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "bulking", tags: ["Fasting"], calories: 420, protein: 9, carbs: 68, fat: 12, ingredients: ["Buckwheat Flour", "Potatoes", "Rock Salt", "Ghee", "Cumin", "Tomato"], preparationSteps: ["Knead kuttu dough, make rotis.", "Prepare potato and tomato sabzi."] },
  { name: "Vrat ke Aloo & Curd", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 310, protein: 6, carbs: 45, fat: 10, ingredients: ["Potatoes", "Yogurt", "Cumin", "Rock Salt", "Ghee"], preparationSteps: ["Boil and sautéd potatoes in ghee with cumin.", "Serve with fresh curd."] },
  { name: "Sabudana Thalipeeth", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 350, protein: 6, carbs: 55, fat: 12, ingredients: ["Sabudana", "Mashed Potato", "Roasted Peanuts", "Green Chilies", "Ghee"], preparationSteps: ["Mix soaked sabudana with potato and crushed peanuts.", "Flatten on a tawa and roast."] },
  { name: "Singhara Kadhi with Sama Rice", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 390, protein: 8, carbs: 62, fat: 11, ingredients: ["Singhara Flour", "Yogurt", "Sama Rice", "Rock Salt", "Ghee", "Cumin"], preparationSteps: ["Make a thin batter of flour and yogurt.", "Simmer until thick.", "Serve with cooked sama rice."] },
  { name: "Makhana Curry with Kuttu Paratha", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "bulking", tags: ["Fasting"], calories: 450, protein: 12, carbs: 58, fat: 18, ingredients: ["Fox Nuts", "Tomato", "Cashew Paste", "Rock Salt", "Kuttu Flour", "Ghee"], preparationSteps: ["Prepare rich tomato cashew gravy for makhana.", "Serve with kuttu parathas."] },
  
  // ── Dinner ─────────────────────────────────────────────────────────────
  { name: "Dahi Aloo (Fasting)", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Gluten-Free"], calories: 290, protein: 8, carbs: 45, fat: 8, ingredients: ["Potatoes", "Yogurt", "Rock Salt", "Coriander", "Ghee"], preparationSteps: ["Boil and dice potatoes.", "Mix with beaten yogurt.", "Temper with cumin in ghee."] },
  { name: "Mashed Sweet Potato Bowl", dietType: "vegan", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 250, protein: 3, carbs: 58, fat: 1, ingredients: ["Sweet Potato", "Rock Salt", "Lime Juice", "Cumin Powder"], preparationSteps: ["Boil and mash sweet potatoes.", "Season with salt, cumin, and lime."] },
  { name: "Paneer & Tomato Sabzi (Vrat)", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "High-Protein"], calories: 340, protein: 18, carbs: 12, fat: 24, ingredients: ["Paneer", "Tomatoes", "Rock Salt", "Green Chilies", "Ghee"], preparationSteps: ["Sauté tomatoes until soft.", "Add paneer cubes and simmer."] },
  { name: "Samak Rice Khichdi", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 310, protein: 7, carbs: 55, fat: 6, ingredients: ["Sama Rice", "Carrots", "Peas", "Rock Salt", "Ghee", "Black Pepper"], preparationSteps: ["Cook rice with vegetables in a pressure cooker."] },
  { name: "Dry Fruit Milk", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 260, protein: 12, carbs: 22, fat: 14, ingredients: ["Milk", "Almonds", "Pistachios", "Dates", "Saffron"], preparationSteps: ["Blend soaked nuts.", "Boil with milk and dates."] },
  { name: "Lauki (Bottle Gourd) Sabzi", dietType: "vegan", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 150, protein: 3, carbs: 25, fat: 5, ingredients: ["Bottle Gourd", "Tomato", "Cummin", "Rock Salt", "Ghee"], preparationSteps: ["Dice lauiki.", "Sauté with tomato and cumin, pressure cook."] },

  // ── Snacks ─────────────────────────────────────────────────────────────
  { name: "Roasted Masala Makhana (Vrat)", dietType: "vegetarian", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 180, protein: 6, carbs: 20, fat: 8, ingredients: ["Fox Nuts (Makhana)", "Ghee", "Rock Salt", "Black Pepper"], preparationSteps: ["Dry roast makhana slowly in ghee.", "Toss with spices."] },
  { name: "Mixed Fruit Bowl", dietType: "vegan", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 120, protein: 1, carbs: 30, fat: 0, ingredients: ["Banana", "Apple", "Grapes", "Pomegranate"], preparationSteps: ["Dice all fruits and serve fresh."] },
  { name: "Rajgira Ladoo", dietType: "vegetarian", category: "snack", isFastingMeal: true, type: "bulking", tags: ["Fasting", "Gluten-Free"], calories: 240, protein: 5, carbs: 38, fat: 9, ingredients: ["Amaranth (Rajgira)", "Jaggery", "Ghee", "Cardamom"], preparationSteps: ["Pop amaranth.", "Mix with melted jaggery.", "Shape into ladoos."] },
  { name: "Sweet Potato Chaat", dietType: "vegan", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 190, protein: 4, carbs: 42, fat: 1, ingredients: ["Sweet Potato", "Rock Salt", "Cumin", "Lemon Juice", "Coriander"], preparationSteps: ["Boil and dice.", "Toss with lemon and rock salt."] },
  { name: "Handful of Almonds & Walnuts", dietType: "vegan", category: "snack", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Keto"], calories: 210, protein: 6, carbs: 8, fat: 18, ingredients: ["Almonds", "Walnuts"], preparationSteps: ["Serve raw or soaked."] },
  { name: "Banana Chips (Rock Salt)", dietType: "vegan", category: "snack", isFastingMeal: true, type: "bulking", tags: ["Fasting"], calories: 280, protein: 2, carbs: 35, fat: 14, ingredients: ["Raw Banana", "Coconut Oil", "Rock Salt"], preparationSteps: ["Slice banana ultra-thin.", "Deep fry in coconut oil.", "Season with rock salt."] },
];

const seedFastingMeals = async () => {
  try {
    await connectToDatabase();
    
    // Using upsert approach based on name
    let inserted = 0;
    
    for (const meal of fastingMealsToSeed) {
      const exists = await Meal.findOne({ name: meal.name });
      if (!exists) {
        await Meal.create(meal);
        inserted++;
      }
    }
    
    console.log(`✅ Seeded ${inserted} new fasting meals into the database.`);
    
    // Clean up any legacy fasting meals from previous seedings that didn't have isFastingMeal
    // This isn't strictly necessary since we query by isFastingMeal anyway, but good for hygiene
    const legacyUpdate = await Meal.updateMany(
      { tags: "Fasting", isFastingMeal: false }, 
      { $set: { isFastingMeal: true } }
    );
    console.log(`✅ Updated ${legacyUpdate.modifiedCount} legacy fasting meals with isFastingMeal flag.`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding fasting meals failed:", err);
    process.exit(1);
  }
};

seedFastingMeals();
