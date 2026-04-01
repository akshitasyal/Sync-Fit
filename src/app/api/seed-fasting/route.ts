import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Meal from "@/models/Meal";

// ─── 38 fasting meals — vegetarian + vegan, all categories ───────────────────
const fastingMealsToSeed = [
  // VEGETARIAN Breakfast
  { name: "Fruit Bowl with Nuts", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 250, protein: 5, carbs: 45, fat: 8, ingredients: ["Banana", "Apple", "Pomegranate", "Almonds", "Walnuts"], preparationSteps: ["Chop all fruits.", "Mix in bowl.", "Top with almonds and walnuts."] },
  { name: "Sabudana Kheer", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 320, protein: 6, carbs: 60, fat: 7, ingredients: ["Sabudana (Sago)", "Milk", "Cardamom", "Almonds", "Jaggery"], preparationSteps: ["Soak sabudana 2 hrs.", "Boil milk, add sabudana.", "Add jaggery, cardamom, nuts. Serve warm."] },
  { name: "Makhana Milk with Dates", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 280, protein: 8, carbs: 40, fat: 10, ingredients: ["Makhana (Foxnuts)", "Milk", "Dates", "Saffron"], preparationSteps: ["Lightly roast makhana.", "Boil milk with dates and saffron.", "Add makhana, simmer 5 min."] },
  { name: "Dry Fruits Mix and Apple", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 220, protein: 4, carbs: 35, fat: 8, ingredients: ["Apple", "Cashews", "Raisins", "Pistachios"], preparationSteps: ["Slice the apple.", "Serve alongside a mix of dry fruits."] },
  { name: "Sabudana Khichdi Vrat Special", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 320, protein: 5, carbs: 64, fat: 8, ingredients: ["Sabudana", "Peanuts", "Green Chilies", "Cumin", "Ghee"], preparationSteps: ["Soak sabudana.", "Sauté cumin + chilies in ghee.", "Add peanuts + sabudana. Cook until translucent."] },
  { name: "Kuttu ka Chilla", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 280, protein: 7, carbs: 45, fat: 8, ingredients: ["Buckwheat Flour (Kuttu)", "Yogurt", "Rock Salt", "Green Chilies", "Ghee"], preparationSteps: ["Mix flour with yogurt and water.", "Cook thin pancakes on tawa."] },
  { name: "Rajgira Amaranth Porridge", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "bulking", tags: ["Fasting", "High-Protein"], calories: 290, protein: 10, carbs: 48, fat: 6, ingredients: ["Rajgira Flour", "Milk", "Jaggery", "Cashews"], preparationSteps: ["Roast flour in ghee.", "Add milk and simmer.", "Sweeten with jaggery."] },
  { name: "Singhare ki Puri", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "bulking", tags: ["Fasting", "Gluten-Free"], calories: 355, protein: 6, carbs: 52, fat: 14, ingredients: ["Water Chestnut Flour (Singhara)", "Potato", "Rock Salt", "Ghee"], preparationSteps: ["Knead flour with potato + salt.", "Roll and fry in ghee."] },
  { name: "Makhana Porridge", dietType: "vegetarian", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting", "High-Protein"], calories: 220, protein: 8, carbs: 28, fat: 8, ingredients: ["Makhana (Foxnuts)", "Milk", "Almonds", "Saffron", "Honey"], preparationSteps: ["Roast and crush makhana.", "Boil in milk.", "Add almonds and honey."] },
  // VEGAN Breakfast
  { name: "Papaya and Apple Bowl", dietType: "vegan", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 150, protein: 1, carbs: 38, fat: 0, ingredients: ["Papaya", "Apple", "Lemon Juice"], preparationSteps: ["Dice fruits.", "Sprinkle with lemon juice."] },
  { name: "Coconut Water and Banana Bowl", dietType: "vegan", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 170, protein: 2, carbs: 40, fat: 0, ingredients: ["Coconut Water", "Banana", "Chia Seeds", "Pomegranate"], preparationSteps: ["Slice banana into bowl.", "Pour coconut water.", "Top with chia and pomegranate."] },
  { name: "Sabudana Tikki Vegan", dietType: "vegan", category: "breakfast", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 280, protein: 4, carbs: 52, fat: 7, ingredients: ["Sabudana", "Boiled Potato", "Rock Salt", "Cumin", "Coconut Oil"], preparationSteps: ["Mix soaked sabudana with mashed potato and rock salt.", "Shape into flat tikkis and pan-fry in coconut oil."] },
  { name: "Mango and Chia Parfait", dietType: "vegan", category: "breakfast", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 185, protein: 3, carbs: 38, fat: 4, ingredients: ["Mango", "Chia Seeds", "Coconut Milk", "Pomegranate Seeds"], preparationSteps: ["Make chia pudding with coconut milk overnight.", "Layer with mango and pomegranate."] },
  // VEGETARIAN Lunch
  { name: "Sabudana Khichdi Lunch", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 450, protein: 6, carbs: 70, fat: 16, ingredients: ["Sabudana", "Potatoes", "Roasted Peanuts", "Green Chilies", "Cumin Seeds", "Ghee", "Rock Salt"], preparationSteps: ["Soak sabudana overnight.", "Heat ghee, add cumin + potatoes.", "Add peanuts, chilies, sabudana. Season with rock salt."] },
  { name: "Kuttu Puri with Aloo Sabzi", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 520, protein: 8, carbs: 75, fat: 20, ingredients: ["Kuttu Flour (Buckwheat)", "Potatoes", "Ghee", "Tomatoes", "Rock Salt", "Cumin Seeds"], preparationSteps: ["Knead kuttu dough, fry puris in ghee.", "Make aloo sabzi with tomatoes and cumin."] },
  { name: "Rajgira Roti with Curd", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 350, protein: 10, carbs: 55, fat: 8, ingredients: ["Rajgira Flour (Amaranth)", "Mashed Potatoes", "Rock Salt", "Yogurt"], preparationSteps: ["Mix rajgira flour with mashed potatoes and salt.", "Roll and cook rotis on tawa.", "Serve with curd."] },
  { name: "Sama Rice Khichdi Lunch", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 310, protein: 7, carbs: 50, fat: 9, ingredients: ["Sama Rice (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Cumin Seeds"], preparationSteps: ["Soak sama rice 20 min.", "Heat ghee, add cumin + potatoes + peanuts.", "Add rice and water. Cook until soft."] },
  { name: "Kuttu Roti with Aloo Sabzi", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "bulking", tags: ["Fasting"], calories: 420, protein: 9, carbs: 68, fat: 12, ingredients: ["Buckwheat Flour", "Potatoes", "Rock Salt", "Ghee", "Cumin", "Tomato"], preparationSteps: ["Knead kuttu dough, make rotis.", "Prepare potato and tomato sabzi."] },
  { name: "Makhana Curry with Kuttu Paratha", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "bulking", tags: ["Fasting"], calories: 450, protein: 12, carbs: 58, fat: 18, ingredients: ["Fox Nuts (Makhana)", "Tomato", "Cashew Paste", "Rock Salt", "Kuttu Flour", "Ghee"], preparationSteps: ["Prepare rich tomato cashew gravy for makhana.", "Serve with kuttu parathas."] },
  { name: "Sama Rice Pulao", dietType: "vegetarian", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 380, protein: 6, carbs: 70, fat: 8, ingredients: ["Sama (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Rock Salt", "Cumin"], preparationSteps: ["Roast sama rice.", "Add potatoes and spices.", "Cook with water."] },
  // VEGAN Lunch
  { name: "Sweet Potato and Peanut Curry", dietType: "vegan", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 340, protein: 8, carbs: 52, fat: 11, ingredients: ["Sweet Potato", "Peanuts", "Coconut Milk", "Cumin", "Rock Salt", "Coriander"], preparationSteps: ["Cube and boil sweet potatoes.", "Make gravy with roasted peanuts and coconut milk.", "Simmer together."] },
  { name: "Vegan Sama Rice Khichdi", dietType: "vegan", category: "lunch", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Gluten-Free"], calories: 290, protein: 5, carbs: 58, fat: 5, ingredients: ["Sama (Barnyard Millet)", "Pumpkin", "Rock Salt", "Coconut Oil", "Cumin"], preparationSteps: ["Cook sama with diced pumpkin in coconut oil.", "Season with rock salt and cumin."] },
  { name: "Raw Banana Sabzi", dietType: "vegan", category: "lunch", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 210, protein: 3, carbs: 38, fat: 5, ingredients: ["Raw Banana", "Coconut Oil", "Rock Salt", "Cumin", "Green Chilies"], preparationSteps: ["Slice raw banana thinly.", "Sauté with coconut oil, cumin, and green chilies.", "Cook on low flame until tender."] },
  // VEGETARIAN Dinner
  { name: "Lauki Sabzi with Singhara Roti", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 280, protein: 6, carbs: 45, fat: 7, ingredients: ["Lauki (Bottle Gourd)", "Singhara Flour", "Ghee", "Rock Salt", "Green Chilies"], preparationSteps: ["Cook lauki with cumin and chilies in ghee.", "Knead singhara flour, roll rotis and cook."] },
  { name: "Makhana Curry Dinner", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 320, protein: 8, carbs: 35, fat: 15, ingredients: ["Makhana (Foxnuts)", "Tomatoes", "Cashews", "Ghee", "Rock Salt"], preparationSteps: ["Roast makhana lightly.", "Blend tomatoes and cashews into paste.", "Cook paste in ghee, make gravy, add makhana."] },
  { name: "Sweet Potato Chaat Dinner", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 240, protein: 4, carbs: 55, fat: 1, ingredients: ["Sweet Potatoes", "Lemon Juice", "Rock Salt", "Roasted Cumin Powder"], preparationSteps: ["Boil sweet potatoes.", "Cube and toss with salt, cumin, lemon juice."] },
  { name: "Fasting Thali Light Meal", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 380, protein: 9, carbs: 65, fat: 12, ingredients: ["Paneer", "Tomatoes", "Sama Rice", "Yogurt", "Ghee"], preparationSteps: ["Prepare paneer curry with tomatoes and ghee.", "Cook sama rice.", "Serve with plain curd."] },
  { name: "Dahi Aloo Fasting Dinner", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Gluten-Free"], calories: 290, protein: 8, carbs: 45, fat: 8, ingredients: ["Potatoes", "Yogurt", "Rock Salt", "Coriander", "Ghee"], preparationSteps: ["Boil and dice potatoes.", "Mix with beaten yogurt.", "Temper with cumin in ghee."] },
  { name: "Paneer and Tomato Sabzi Vrat", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "High-Protein"], calories: 340, protein: 18, carbs: 12, fat: 24, ingredients: ["Paneer", "Tomatoes", "Rock Salt", "Green Chilies", "Ghee"], preparationSteps: ["Sauté tomatoes until soft.", "Add paneer cubes and simmer."] },
  { name: "Dry Fruit Milk", dietType: "vegetarian", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 260, protein: 12, carbs: 22, fat: 14, ingredients: ["Milk", "Almonds", "Pistachios", "Dates", "Saffron"], preparationSteps: ["Blend soaked nuts.", "Boil with milk and dates."] },
  // VEGAN Dinner
  { name: "Mashed Sweet Potato Bowl", dietType: "vegan", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 250, protein: 3, carbs: 58, fat: 1, ingredients: ["Sweet Potato", "Rock Salt", "Lime Juice", "Cumin Powder"], preparationSteps: ["Boil and mash sweet potatoes.", "Season with salt, cumin, and lime."] },
  { name: "Lauki Bottle Gourd Sabzi Vegan", dietType: "vegan", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 150, protein: 3, carbs: 25, fat: 5, ingredients: ["Bottle Gourd", "Tomato", "Cumin", "Rock Salt", "Coconut Oil"], preparationSteps: ["Dice lauki.", "Sauté with tomato and cumin in coconut oil.", "Pressure cook until soft."] },
  { name: "Vegan Makhana Coconut Soup", dietType: "vegan", category: "dinner", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 180, protein: 5, carbs: 22, fat: 8, ingredients: ["Makhana (Foxnuts)", "Coconut Milk", "Ginger", "Rock Salt", "Black Pepper"], preparationSteps: ["Roast makhana lightly.", "Blend coconut milk with ginger.", "Simmer makhana in coconut broth."] },
  // Snacks
  { name: "Roasted Masala Makhana Vrat", dietType: "vegetarian", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting", "Low-Carb"], calories: 180, protein: 6, carbs: 20, fat: 8, ingredients: ["Fox Nuts (Makhana)", "Ghee", "Rock Salt", "Black Pepper"], preparationSteps: ["Dry roast makhana in ghee.", "Toss with spices."] },
  { name: "Mixed Fruit Bowl Fasting", dietType: "vegan", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 120, protein: 1, carbs: 30, fat: 0, ingredients: ["Banana", "Apple", "Grapes", "Pomegranate"], preparationSteps: ["Dice all fruits and serve fresh."] },
  { name: "Rajgira Ladoo", dietType: "vegetarian", category: "snack", isFastingMeal: true, type: "bulking", tags: ["Fasting", "Gluten-Free"], calories: 240, protein: 5, carbs: 38, fat: 9, ingredients: ["Amaranth (Rajgira)", "Jaggery", "Ghee", "Cardamom"], preparationSteps: ["Pop amaranth.", "Mix with melted jaggery.", "Shape into ladoos."] },
  { name: "Sweet Potato Chaat Snack", dietType: "vegan", category: "snack", isFastingMeal: true, type: "cutting", tags: ["Fasting"], calories: 190, protein: 4, carbs: 42, fat: 1, ingredients: ["Sweet Potato", "Rock Salt", "Cumin", "Lemon Juice", "Coriander"], preparationSteps: ["Boil and dice.", "Toss with lemon and rock salt."] },
  { name: "Almonds and Walnuts Mix", dietType: "vegan", category: "snack", isFastingMeal: true, type: "maintenance", tags: ["Fasting", "Keto"], calories: 210, protein: 6, carbs: 8, fat: 18, ingredients: ["Almonds", "Walnuts"], preparationSteps: ["Serve raw or soaked overnight."] },
  { name: "Vrat Peanut Chikki", dietType: "vegetarian", category: "snack", isFastingMeal: true, type: "bulking", tags: ["Fasting", "High-Protein"], calories: 265, protein: 8, carbs: 30, fat: 13, ingredients: ["Peanuts", "Jaggery", "Rock Salt", "Ghee"], preparationSteps: ["Roast peanuts.", "Melt jaggery with ghee.", "Mix and press into slabs, cut when cooled."] },
  { name: "Dry Fig and Almond Trail Mix", dietType: "vegan", category: "snack", isFastingMeal: true, type: "maintenance", tags: ["Fasting"], calories: 220, protein: 5, carbs: 28, fat: 11, ingredients: ["Dried Figs", "Almonds", "Cashews", "Pumpkin Seeds"], preparationSteps: ["Mix all ingredients.", "Serve in portion bowls."] },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Use the raw native MongoDB collection to bypass ALL Mongoose strict-mode filtering
    // This guarantees isFastingMeal is written even if there's a schema cache mismatch
    const db = mongoose.connection.db;
    if (!db) throw new Error("No database connection");
    const collection = db.collection("meals");

    let inserted = 0;
    let skipped = 0;

    // Step 1 — Insert new fasting meals (direct insertOne to bypass pre-save hook issues)
    for (const meal of fastingMealsToSeed) {
      const existing = await collection.findOne({ name: meal.name });
      if (existing) {
        skipped++;
        continue;
      }
      // insertOne via Meal model (triggers schema validation but isFastingMeal is in schema)
      await Meal.create(meal);
      inserted++;
    }

    // Step 2 — CRITICAL: use raw native driver to force-set isFastingMeal on ALL fasting-tagged meals
    // This bypasses Mongoose strict mode that may be stripping the field
    const repairResult = await collection.updateMany(
      { tags: { $in: ["Fasting"] }, isFastingMeal: { $ne: true } },
      { $set: { isFastingMeal: true } }
    );

    // Step 3 — Count using native driver too (avoids any model-level interference)
    const totalFasting = await collection.countDocuments({ isFastingMeal: true });
    const totalTaggedFasting = await collection.countDocuments({ tags: { $in: ["Fasting"] } });

    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted} new meals, skipped ${skipped} duplicates. Native repair: ${repairResult.modifiedCount} docs updated. Fasting meals in DB: ${totalFasting} (tagged: ${totalTaggedFasting}).`,
      inserted,
      skipped,
      repaired: repairResult.modifiedCount,
      totalFastingMeals: totalFasting,
      totalTaggedFasting,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
