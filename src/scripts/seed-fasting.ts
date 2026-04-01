// ── Load .env.local FIRST — must be before any import that reads process.env ──
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });
dotenv.config({ path: resolve(process.cwd(), ".env"), override: false }); // fallback

if (!process.env.MONGODB_URI) {
  console.error("[seed-fasting] ❌ MONGODB_URI is undefined. Check your .env.local file.");
  process.exit(1);
}

// ── Use shared connection lib (global cache, proper error handling) ──
import connectToDatabase from "../lib/mongodb";
import Meal from "../models/Meal";

// ──────────────────────────────────────────────────────────────────────────────
// ALL meals MUST have isFastingMeal: true  ← this is THE fix
// Covers vegetarian + vegan, all slots (breakfast/lunch/dinner/snack)
// ──────────────────────────────────────────────────────────────────────────────
const fastingMeals = [
  // ── VEGETARIAN  Breakfast ─────────────────────────────────────────────────
  {
    name: "Fruit Bowl with Nuts",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "breakfast",
    calories: 250, protein: 5, carbs: 45, fat: 8,
    ingredients: ["Banana", "Apple", "Pomegranate", "Almonds", "Walnuts"],
    preparationSteps: ["Chop all fruits.", "Mix in bowl.", "Top with chopped almonds and walnuts."],
  },
  {
    name: "Sabudana Kheer",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "breakfast",
    calories: 320, protein: 6, carbs: 60, fat: 7,
    ingredients: ["Sabudana (Sago)", "Milk", "Cardamom", "Almonds", "Jaggery"],
    preparationSteps: ["Soak sabudana 2 hrs.", "Boil milk, add sabudana.", "Add jaggery, cardamom, nuts. Serve warm."],
  },
  {
    name: "Makhana Milk with Dates",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "breakfast",
    calories: 280, protein: 8, carbs: 40, fat: 10,
    ingredients: ["Makhana (Foxnuts)", "Milk", "Dates", "Saffron"],
    preparationSteps: ["Lightly roast makhana.", "Boil milk with dates and saffron.", "Add makhana, simmer 5 min."],
  },
  {
    name: "Dry Fruits Mix and Apple",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "breakfast",
    calories: 220, protein: 4, carbs: 35, fat: 8,
    ingredients: ["Apple", "Cashews", "Raisins", "Pistachios"],
    preparationSteps: ["Slice the apple.", "Serve alongside a mix of dry fruits."],
  },
  {
    name: "Sabudana Khichdi (Vrat Specials)",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "breakfast",
    calories: 320, protein: 5, carbs: 64, fat: 8,
    ingredients: ["Sabudana", "Peanuts", "Green Chilies", "Cumin", "Ghee"],
    preparationSteps: ["Soak sabudana.", "Sauté cumin + chilies in ghee.", "Add peanuts + sabudana. Cook until translucent."],
  },
  {
    name: "Kuttu ka Chilla",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "breakfast",
    calories: 280, protein: 7, carbs: 45, fat: 8,
    ingredients: ["Buckwheat Flour (Kuttu)", "Yogurt", "Rock Salt", "Green Chilies", "Ghee"],
    preparationSteps: ["Mix flour with yogurt and water.", "Cook thin pancakes on tawa."],
  },
  {
    name: "Rajgira (Amaranth) Porridge",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "High-Protein"], category: "breakfast",
    calories: 290, protein: 10, carbs: 48, fat: 6,
    ingredients: ["Rajgira Flour", "Milk", "Jaggery", "Cashews"],
    preparationSteps: ["Roast flour in ghee.", "Add milk and simmer.", "Sweeten with jaggery."],
  },
  {
    name: "Singhare ki Puri",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "breakfast",
    calories: 355, protein: 6, carbs: 52, fat: 14,
    ingredients: ["Water Chestnut Flour (Singhara)", "Potato", "Rock Salt", "Ghee"],
    preparationSteps: ["Knead flour with potato + salt.", "Roll and fry in ghee."],
  },
  {
    name: "Makhana Porridge",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "High-Protein"], category: "breakfast",
    calories: 220, protein: 8, carbs: 28, fat: 8,
    ingredients: ["Makhana (Foxnuts)", "Milk", "Almonds", "Saffron", "Honey"],
    preparationSteps: ["Roast and crush makhana.", "Boil in milk.", "Add almonds and honey."],
  },

  // ── VEGAN  Breakfast ──────────────────────────────────────────────────────
  {
    name: "Papaya and Apple Bowl",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "breakfast",
    calories: 150, protein: 1, carbs: 38, fat: 0,
    ingredients: ["Papaya", "Apple", "Lemon Juice"],
    preparationSteps: ["Dice fruits.", "Sprinkle with lemon juice."],
  },
  {
    name: "Coconut Water and Banana Bowl",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "breakfast",
    calories: 170, protein: 2, carbs: 40, fat: 0,
    ingredients: ["Coconut Water", "Banana", "Chia Seeds", "Pomegranate"],
    preparationSteps: ["Slice banana into bowl.", "Pour coconut water.", "Top with chia and pomegranate."],
  },
  {
    name: "Sabudana Tikki Vegan",
    type: "maintenance", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "breakfast",
    calories: 280, protein: 4, carbs: 52, fat: 7,
    ingredients: ["Sabudana", "Boiled Potato", "Rock Salt", "Cumin", "Coconut Oil"],
    preparationSteps: ["Mix soaked sabudana with mashed potato and rock salt.", "Shape into flat tikkis and pan-fry in coconut oil."],
  },
  {
    name: "Mango and Chia Parfait",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting"], category: "breakfast",
    calories: 185, protein: 3, carbs: 38, fat: 4,
    ingredients: ["Mango", "Chia Seeds", "Coconut Milk", "Pomegranate Seeds"],
    preparationSteps: ["Make chia pudding with coconut milk overnight.", "Layer with mango and pomegranate."],
  },

  // ── VEGETARIAN  Lunch ─────────────────────────────────────────────────────
  {
    name: "Sabudana Khichdi",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 450, protein: 6, carbs: 70, fat: 16,
    ingredients: ["Sabudana", "Potatoes", "Roasted Peanuts", "Green Chilies", "Cumin Seeds", "Ghee", "Rock Salt"],
    preparationSteps: ["Soak sabudana overnight.", "Heat ghee, add cumin+potatoes.", "Add peanuts, chilies, sabudana. Season with rock salt."],
  },
  {
    name: "Kuttu Puri with Aloo Sabzi",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 520, protein: 8, carbs: 75, fat: 20,
    ingredients: ["Kuttu Flour (Buckwheat)", "Potatoes", "Ghee", "Tomatoes", "Rock Salt", "Cumin Seeds"],
    preparationSteps: ["Knead kuttu dough, fry puris in ghee.", "Make aloo sabzi with tomatoes and cumin."],
  },
  {
    name: "Rajgira Roti with Curd",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 350, protein: 10, carbs: 55, fat: 8,
    ingredients: ["Rajgira Flour (Amaranth)", "Mashed Potatoes", "Rock Salt", "Yogurt"],
    preparationSteps: ["Mix rajgira flour with mashed potatoes and salt.", "Roll and cook rotis on tawa.", "Serve with curd."],
  },
  {
    name: "Sama Rice Khichdi",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 310, protein: 7, carbs: 50, fat: 9,
    ingredients: ["Sama Rice (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Cumin Seeds"],
    preparationSteps: ["Soak sama rice 20 min.", "Heat ghee, add cumin+potatoes+peanuts.", "Add rice and water. Cook until soft."],
  },
  {
    name: "Kuttu Roti with Aloo Sabzi",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 420, protein: 9, carbs: 68, fat: 12,
    ingredients: ["Buckwheat Flour", "Potatoes", "Rock Salt", "Ghee", "Cumin", "Tomato"],
    preparationSteps: ["Knead kuttu dough, make rotis.", "Prepare potato and tomato sabzi."],
  },
  {
    name: "Makhana Curry with Kuttu Paratha",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "lunch",
    calories: 450, protein: 12, carbs: 58, fat: 18,
    ingredients: ["Fox Nuts (Makhana)", "Tomato", "Cashew Paste", "Rock Salt", "Kuttu Flour", "Ghee"],
    preparationSteps: ["Prepare rich tomato cashew gravy for makhana.", "Serve with kuttu parathas."],
  },
  {
    name: "Sama Rice Pulao",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "lunch",
    calories: 380, protein: 6, carbs: 70, fat: 8,
    ingredients: ["Sama (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Rock Salt", "Cumin"],
    preparationSteps: ["Roast sama rice.", "Add potatoes and spices.", "Cook with water."],
  },

  // ── VEGAN  Lunch ─────────────────────────────────────────────────────────
  {
    name: "Sweet Potato and Peanut Curry",
    type: "maintenance", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "lunch",
    calories: 340, protein: 8, carbs: 52, fat: 11,
    ingredients: ["Sweet Potato", "Peanuts", "Coconut Milk", "Cumin", "Rock Salt", "Coriander"],
    preparationSteps: ["Cube and boil sweet potatoes.", "Make gravy with roasted peanuts and coconut milk.", "Simmer together."],
  },
  {
    name: "Vegan Sama Rice Khichdi",
    type: "maintenance", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "lunch",
    calories: 290, protein: 5, carbs: 58, fat: 5,
    ingredients: ["Sama (Barnyard Millet)", "Pumpkin", "Rock Salt", "Coconut Oil", "Cumin"],
    preparationSteps: ["Cook sama with diced pumpkin in coconut oil.", "Season with rock salt and cumin."],
  },
  {
    name: "Raw Banana Sabzi",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "lunch",
    calories: 210, protein: 3, carbs: 38, fat: 5,
    ingredients: ["Raw Banana", "Coconut Oil", "Rock Salt", "Cumin", "Green Chilies"],
    preparationSteps: ["Slice raw banana thinly.", "Sauté with coconut oil, cumin, and green chilies.", "Cook on low flame until tender."],
  },

  // ── VEGETARIAN  Dinner ────────────────────────────────────────────────────
  {
    name: "Lauki Sabzi with Singhara Roti",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "dinner",
    calories: 280, protein: 6, carbs: 45, fat: 7,
    ingredients: ["Lauki (Bottle Gourd)", "Singhara Flour", "Ghee", "Rock Salt", "Green Chilies"],
    preparationSteps: ["Cook lauki with cumin and chilies in ghee.", "Knead singhara flour, roll rotis and cook."],
  },
  {
    name: "Makhana Curry",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "dinner",
    calories: 320, protein: 8, carbs: 35, fat: 15,
    ingredients: ["Makhana (Foxnuts)", "Tomatoes", "Cashews", "Ghee", "Rock Salt"],
    preparationSteps: ["Roast makhana lightly.", "Blend tomatoes and cashews into paste.", "Cook paste in ghee, make gravy, add makhana."],
  },
  {
    name: "Sweet Potato Chaat",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "dinner",
    calories: 240, protein: 4, carbs: 55, fat: 1,
    ingredients: ["Sweet Potatoes", "Lemon Juice", "Rock Salt", "Roasted Cumin Powder"],
    preparationSteps: ["Boil sweet potatoes.", "Cube and toss with salt, cumin, lemon juice."],
  },
  {
    name: "Fasting Thali Light Meal",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "dinner",
    calories: 380, protein: 9, carbs: 65, fat: 12,
    ingredients: ["Paneer", "Tomatoes", "Sama Rice", "Yogurt", "Ghee"],
    preparationSteps: ["Prepare paneer curry with tomatoes and ghee.", "Cook sama rice.", "Serve with plain curd."],
  },
  {
    name: "Dahi Aloo Fasting",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "dinner",
    calories: 290, protein: 8, carbs: 45, fat: 8,
    ingredients: ["Potatoes", "Yogurt", "Rock Salt", "Coriander", "Ghee"],
    preparationSteps: ["Boil and dice potatoes.", "Mix with beaten yogurt.", "Temper with cumin in ghee."],
  },
  {
    name: "Paneer and Tomato Sabzi Vrat",
    type: "maintenance", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "High-Protein"], category: "dinner",
    calories: 340, protein: 18, carbs: 12, fat: 24,
    ingredients: ["Paneer", "Tomatoes", "Rock Salt", "Green Chilies", "Ghee"],
    preparationSteps: ["Sauté tomatoes until soft.", "Add paneer cubes and simmer."],
  },
  {
    name: "Dry Fruit Milk",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting"], category: "dinner",
    calories: 260, protein: 12, carbs: 22, fat: 14,
    ingredients: ["Milk", "Almonds", "Pistachios", "Dates", "Saffron"],
    preparationSteps: ["Blend soaked nuts.", "Boil with milk and dates."],
  },

  // ── VEGAN  Dinner ────────────────────────────────────────────────────────
  {
    name: "Mashed Sweet Potato Bowl",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "dinner",
    calories: 250, protein: 3, carbs: 58, fat: 1,
    ingredients: ["Sweet Potato", "Rock Salt", "Lime Juice", "Cumin Powder"],
    preparationSteps: ["Boil and mash sweet potatoes.", "Season with salt, cumin, and lime."],
  },
  {
    name: "Lauki Bottle Gourd Sabzi",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "dinner",
    calories: 150, protein: 3, carbs: 25, fat: 5,
    ingredients: ["Bottle Gourd", "Tomato", "Cumin", "Rock Salt", "Coconut Oil"],
    preparationSteps: ["Dice lauki.", "Sauté with tomato and cumin in coconut oil.", "Pressure cook until soft."],
  },
  {
    name: "Vegan Makhana Coconut Soup",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "dinner",
    calories: 180, protein: 5, carbs: 22, fat: 8,
    ingredients: ["Makhana (Foxnuts)", "Coconut Milk", "Ginger", "Rock Salt", "Black Pepper"],
    preparationSteps: ["Roast makhana lightly.", "Blend coconut milk with ginger.", "Simmer makhana in coconut broth."],
  },

  // ── Snacks (vegetarian + vegan) ───────────────────────────────────────────
  {
    name: "Roasted Masala Makhana Vrat",
    type: "cutting", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Low-Carb"], category: "snack",
    calories: 180, protein: 6, carbs: 20, fat: 8,
    ingredients: ["Fox Nuts (Makhana)", "Ghee", "Rock Salt", "Black Pepper"],
    preparationSteps: ["Dry roast makhana in ghee.", "Toss with spices."],
  },
  {
    name: "Mixed Fruit Bowl Fasting",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting"], category: "snack",
    calories: 120, protein: 1, carbs: 30, fat: 0,
    ingredients: ["Banana", "Apple", "Grapes", "Pomegranate"],
    preparationSteps: ["Dice all fruits and serve fresh."],
  },
  {
    name: "Rajgira Ladoo",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "Gluten-Free"], category: "snack",
    calories: 240, protein: 5, carbs: 38, fat: 9,
    ingredients: ["Amaranth (Rajgira)", "Jaggery", "Ghee", "Cardamom"],
    preparationSteps: ["Pop amaranth.", "Mix with melted jaggery.", "Shape into ladoos."],
  },
  {
    name: "Sweet Potato Chaat Snack",
    type: "cutting", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting"], category: "snack",
    calories: 190, protein: 4, carbs: 42, fat: 1,
    ingredients: ["Sweet Potato", "Rock Salt", "Cumin", "Lemon Juice", "Coriander"],
    preparationSteps: ["Boil and dice.", "Toss with lemon and rock salt."],
  },
  {
    name: "Almonds and Walnuts Mix",
    type: "maintenance", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting", "Keto"], category: "snack",
    calories: 210, protein: 6, carbs: 8, fat: 18,
    ingredients: ["Almonds", "Walnuts"],
    preparationSteps: ["Serve raw or soaked overnight."],
  },
  {
    name: "Banana Chips Rock Salt",
    type: "bulking", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting"], category: "snack",
    calories: 280, protein: 2, carbs: 35, fat: 14,
    ingredients: ["Raw Banana", "Coconut Oil", "Rock Salt"],
    preparationSteps: ["Slice banana ultra-thin.", "Deep fry in coconut oil.", "Season with rock salt."],
  },
  {
    name: "Vrat Peanut Chikki",
    type: "bulking", dietType: "vegetarian", isFastingMeal: true,
    tags: ["Fasting", "High-Protein"], category: "snack",
    calories: 265, protein: 8, carbs: 30, fat: 13,
    ingredients: ["Peanuts", "Jaggery", "Rock Salt", "Ghee"],
    preparationSteps: ["Roast peanuts.", "Melt jaggery with ghee.", "Mix and press into slabs, cut when cooled."],
  },
  {
    name: "Dry Fig and Almond Trail Mix",
    type: "maintenance", dietType: "vegan", isFastingMeal: true,
    tags: ["Fasting"], category: "snack",
    calories: 220, protein: 5, carbs: 28, fat: 11,
    ingredients: ["Dried Figs", "Almonds", "Cashews", "Pumpkin Seeds"],
    preparationSteps: ["Mix all ingredients.", "Serve in portion bowls."],
  },
];

const seedFastingMeals = async () => {
  try {
    await connectToDatabase();

    let inserted = 0;
    let skipped = 0;
    let flagFixed = 0;

    // Step 1 — Seed new meals (all have isFastingMeal: true)
    for (const meal of fastingMeals) {
      const exists = await Meal.findOne({ name: meal.name }).lean();
      if (exists) {
        skipped++;
        // Ensure the flag is set even on existing records
        const updated = await Meal.updateOne(
          { _id: (exists as any)._id, isFastingMeal: { $ne: true } },
          { $set: { isFastingMeal: true } }
        );
        if (updated.modifiedCount > 0) flagFixed++;
        continue;
      }
      await Meal.create(meal);
      inserted++;
    }

    // Step 2 — Repair any OTHER meals in DB tagged "Fasting" but missing the flag
    const repaired = await Meal.updateMany(
      { tags: { $in: ["Fasting"] }, isFastingMeal: { $ne: true } },
      { $set: { isFastingMeal: true } }
    );
    flagFixed += repaired.modifiedCount;

    const totalFasting = await Meal.countDocuments({ isFastingMeal: true });

    console.log("\n╔══════════════════════════════════════════╗");
    console.log("║   Sync-Fit Fasting Seeder  ✅           ║");
    console.log("╚══════════════════════════════════════════╝");
    console.log(`Total meals in seed list : ${fastingMeals.length}`);
    console.log(`Newly inserted           : ${inserted}`);
    console.log(`Already existed (skipped): ${skipped}`);
    console.log(`isFastingMeal flag fixed : ${flagFixed}`);
    console.log(`Total fasting meals in DB: ${totalFasting}`);

    if (totalFasting === 0) {
      console.error("⚠️  WARNING: 0 fasting meals in DB after seeding. Check for Mongoose validation errors above.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ seed-fasting failed:", error);
    process.exit(1);
  }
};

seedFastingMeals();
