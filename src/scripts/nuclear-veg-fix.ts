import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });

import Meal from "../models/Meal";
import MealPlan from "../models/MealPlan"; // Assuming this is the model name for plans

// Import the verified meal data from the source arrays
// (Copying them here directly to ensure this script is self-contained and atomic)

const vegetarianMeals = [
  { name: "Paneer Paratha",                      dietType: "vegetarian", category: "breakfast", type: "maintenance", tags: ["High-Protein","Balanced Diet"], calories: 410, protein: 18, carbs: 46, fat: 16, ingredients: ["Wheat Flour","Paneer","Ghee","Spices"],                           preparationSteps: ["Grate paneer + mix with spices.","Stuff into dough.","Cook on tawa with ghee."] },
  { name: "Greek Yogurt with Honey & Walnuts",   dietType: "vegetarian", category: "breakfast", type: "cutting",     tags: ["High-Protein","Keto"],           calories: 285, protein: 20, carbs: 22, fat: 14, ingredients: ["Greek Yogurt","Honey","Walnuts"],                                 preparationSteps: ["Serve yogurt.","Drizzle honey.","Top with walnuts."] },
  { name: "Besan Chilla",                        dietType: "vegetarian", category: "breakfast", type: "maintenance", tags: ["High-Protein","Low-Carb"], calories: 310, protein: 18, carbs: 35,  fat: 10, ingredients: ["Chickpea Flour","Spinach","Tomatoes","Onion","Ghee"],           preparationSteps: ["Mix flour with water & veg.","Cook on tawa with ghee.","Fold and serve."] },
  { name: "Idli Sambar",                         dietType: "vegetarian", category: "breakfast", type: "maintenance", tags: ["Balanced Diet"],                 calories: 355, protein: 12, carbs: 66, fat: 4,  ingredients: ["Rice","Urad Dal","Toor Dal","Mixed Vegetables","Tamarind"],        preparationSteps: ["Steam idli batter.","Cook sambar.","Serve together."] },
  { name: "Cheese Tomato Toast",                 dietType: "vegetarian", category: "breakfast", type: "bulking",     tags: ["Balanced Diet"],                 calories: 425, protein: 16, carbs: 46, fat: 18, ingredients: ["Whole Wheat Bread","Cheddar Cheese","Tomatoes","Butter"],          preparationSteps: ["Butter bread.","Add cheese + tomato.","Grill until melted."] },
  { name: "Paneer Bhurji with Paratha",          dietType: "vegetarian", category: "breakfast", type: "bulking",     tags: ["High-Protein","Balanced Diet"],  calories: 440, protein: 22, carbs: 44, fat: 18, ingredients: ["Paneer","Onion","Tomato","Spices","Whole Wheat Paratha","Ghee"], preparationSteps: ["Scramble paneer with onion + tomato + spices.","Serve with hot paratha."] },
  { name: "Masala Dosa",                         dietType: "vegetarian", category: "breakfast", type: "maintenance", tags: ["Balanced Diet"],                 calories: 365, protein: 10, carbs: 62, fat: 10, ingredients: ["Rice","Urad Dal","Potato","Turmeric","Mustard Seeds","Oil"],        preparationSteps: ["Ferment batter.","Spread on tawa.","Fill with potato masala + fold."] },
  { name: "Moong Dal Cheela",                    dietType: "vegetarian", category: "breakfast", type: "cutting",     tags: ["High-Protein","Balanced Diet"],  calories: 280, protein: 16, carbs: 38, fat: 8,  ingredients: ["Yellow Lentils","Onion","Coriander","Spices","Ghee"],             preparationSteps: ["Blend soaked lentils.","Cook thin crepes.","Serve with chutney."] },
  { name: "Eggless Banana Oat Pancakes",         dietType: "vegetarian", category: "breakfast", type: "bulking",     tags: ["Balanced Diet"],                 calories: 380, protein: 10, carbs: 62, fat: 12, ingredients: ["Banana","Rolled Oats","Milk","Honey","Butter"],                   preparationSteps: ["Blend oats, milk, banana.","Cook small pancakes in butter.","Drizzle honey."] },
  { name: "Vermicelli Upma",                     dietType: "vegetarian", category: "breakfast", type: "maintenance", tags: ["Balanced Diet"],                 calories: 320, protein: 8,  carbs: 52, fat: 8,  ingredients: ["Roasted Vermicelli","Vegetables","Mustard Seeds","Curry Leaves","Ghee"], preparationSteps: ["Sauté seeds + veggies in ghee.","Add water + vermicelli.","Cook until absorbed."] },
  { name: "Palak Paneer with Roti",              dietType: "vegetarian", category: "lunch",      type: "maintenance", tags: ["High-Protein","Balanced Diet"], calories: 455, protein: 22, carbs: 46, fat: 20, ingredients: ["Spinach","Paneer","Garlic","Spices","Whole Wheat Flour","Ghee"], preparationSteps: ["Purée blanched spinach.","Cook with spices + paneer.","Serve with roti."] },
  { name: "Vegetable Biryani with Raita",       dietType: "vegetarian", category: "lunch",      type: "bulking",     tags: ["Balanced Diet"],                calories: 555, protein: 14, carbs: 82, fat: 18, ingredients: ["Basmati Rice","Mixed Vegetables","Yogurt","Spices","Ghee"],        preparationSteps: ["Cook rice with spices + veg.","Serve with raita."] },
  { name: "Caprese Salad",                       dietType: "vegetarian", category: "lunch",      type: "cutting",     tags: ["Keto","Low-Carb"],               calories: 305, protein: 18, carbs: 8,  fat: 22, ingredients: ["Mozzarella Cheese","Tomatoes","Basil","Balsamic Glaze","Olive Oil"],preparationSteps: ["Layer mozzarella + tomatoes.","Tuck in basil.","Drizzle oil + balsamic."] },
  { name: "Mushroom Risotto",                    dietType: "vegetarian", category: "lunch",      type: "bulking",     tags: ["Balanced Diet"],                calories: 505, protein: 14, carbs: 70, fat: 18, ingredients: ["Arborio Rice","Mushrooms","Parmesan Cheese","Vegetable Broth","Butter"], preparationSteps: ["Sauté mushrooms.","Add broth gradually to rice.","Finish with butter + parmesan."] },
  { name: "Vegetarian Black Bean Burger",        dietType: "vegetarian", category: "lunch",      type: "maintenance", tags: ["High-Protein","Balanced Diet"], calories: 485, protein: 20, carbs: 62, fat: 15, ingredients: ["Black Bean Patty","Whole Wheat Bun","Cheddar Cheese","Lettuce","Tomato"], preparationSteps: ["Grill patty.","Assemble with bun + toppings."] },
  { name: "Chole Bhature",                       dietType: "vegetarian", category: "lunch",      type: "bulking",     tags: ["Balanced Diet"],                calories: 620, protein: 18, carbs: 88, fat: 24, ingredients: ["Chickpeas","Maida","Yogurt","Spices","Oil"],                       preparationSteps: ["Cook chole masala.","Deep-fry bhature.","Serve together."] },
  { name: "Cheese & Veggie Quesadilla",          dietType: "vegetarian", category: "lunch",      type: "maintenance", tags: ["High-Protein","Balanced Diet"], calories: 455, protein: 18, carbs: 46, fat: 22, ingredients: ["Flour Tortilla","Cheddar Cheese","Bell Peppers","Corn","Sour Cream"], preparationSteps: ["Fill half tortilla with cheese + veg.","Cook on tawa till golden.","Serve with sour cream."] },
  { name: "Tomato Soup with Garlic Bread",       dietType: "vegetarian", category: "lunch",      type: "cutting",     tags: ["Balanced Diet"],                calories: 310, protein: 8,  carbs: 44, fat: 12, ingredients: ["Tomatoes","Vegetable Broth","Cream","Garlic Bread","Butter"],       preparationSteps: ["Simmer tomatoes in broth.","Blend smooth.","Swirl cream, serve with garlic bread."] },
  { name: "Tofu & Veg Fried Rice",               dietType: "vegetarian", category: "lunch",      type: "maintenance", tags: ["Balanced Diet"],                calories: 420, protein: 16, carbs: 58, fat: 14, ingredients: ["Cooked Rice","Firm Tofu","Mixed Vegetables","Soy Sauce","Sesame Oil"], preparationSteps: ["Sauté tofu chunks.","Add rice + veg + soy sauce.","Stir-fry on high heat."] },
  { name: "Paneer Tikka Salad",                  dietType: "vegetarian", category: "lunch",      type: "cutting",     tags: ["High-Protein","Low-Carb","Keto"], calories: 335, protein: 26, carbs: 12, fat: 22, ingredients: ["Paneer","Lettuce","Cherry Tomatoes","Cucumber","Lemon Dressing"], preparationSteps: ["Grill marinated paneer.","Toss salad.","Top with grilled paneer + lemon dressing."] },
  { name: "Vegetable Korma with Naan",           dietType: "vegetarian", category: "dinner",     type: "bulking",     tags: ["Balanced Diet"],                calories: 605, protein: 16, carbs: 86, fat: 22, ingredients: ["Mixed Vegetables","Cream","Cashews","Naan","Spices"],            preparationSteps: ["Cook veg in creamy cashew gravy.","Serve with garlic naan."] },
  { name: "Stuffed Bell Peppers",                dietType: "vegetarian", category: "dinner",     type: "maintenance", tags: ["Higher-Protein","Balanced Diet"], calories: 355, protein: 18, carbs: 46, fat: 12, ingredients: ["Bell Peppers","Quinoa","Black Beans","Cheddar Cheese","Tomato Sauce"], preparationSteps: ["Halve + deseed peppers.","Stuff with quinoa mix.","Top with cheese + bake."] },
  { name: "Veggie Pita Pizza",                   dietType: "vegetarian", category: "dinner",     type: "cutting",     tags: ["Low-Carb"],                      calories: 325, protein: 16, carbs: 40, fat: 12, ingredients: ["Whole Wheat Pita","Mozzarella Cheese","Tomato Sauce","Vegetables"],       preparationSteps: ["Spread sauce on pita.","Add cheese + toppings.","Bake until cheese melts."] },
  { name: "Malai Kofta",                         dietType: "vegetarian", category: "dinner",     type: "bulking",     tags: ["Balanced Diet"],                calories: 555, protein: 14, carbs: 62, fat: 28, ingredients: ["Paneer","Potatoes","Cream","Cashews","Spices"],                    preparationSteps: ["Make koftas + fry.","Simmer in creamy tomato gravy."] },
  { name: "Vegetarian Peanut Noodles",           dietType: "vegetarian", category: "dinner",     type: "maintenance", tags: ["Balanced Diet"],                calories: 450, protein: 16, carbs: 62, fat: 16, ingredients: ["Rice Noodles","Tofu","Peanut Butter","Bean Sprouts","Soy Sauce"],   preparationSteps: ["Stir-fry noodles with peanut sauce.","Add crispy tofu.","Mix in sprouts."] },
  { name: "Paneer Tikka",                        dietType: "vegetarian", category: "dinner",     type: "cutting",     tags: ["High-Protein","Keto","Low-Carb"], calories: 380, protein: 28, carbs: 10, fat: 26, ingredients: ["Paneer","Yogurt","Spices","Bell Peppers","Onion"],                preparationSteps: ["Marinate paneer in spiced yogurt.","Grill on skewers with veg."] },
  { name: "Shahi Paneer with Rice",              dietType: "vegetarian", category: "dinner",     type: "bulking",     tags: ["High-Protein","Balanced Diet"], calories: 540, protein: 22, carbs: 60, fat: 24, ingredients: ["Paneer","Cream","Cashews","Tomato","Spices","Basmati Rice"],       preparationSteps: ["Prepare rich tomato-cashew gravy.","Add paneer cubes.","Serve with basmati."] },
  { name: "Cottage Cheese & Veg Bake",           dietType: "vegetarian", category: "dinner",     type: "cutting",     tags: ["High-Protein","Low-Carb"],       calories: 300, protein: 24, carbs: 14, fat: 16, ingredients: ["Cottage Cheese","Zucchini","Bell Peppers","Tomato","Herbs"],       preparationSteps: ["Layer veg + cottage cheese in baking dish.","Season with herbs.","Bake 25 min."] },
  { name: "Dal Makhani with Garlic Naan",        dietType: "vegetarian", category: "dinner",     type: "bulking",     tags: ["High-Protein","Balanced Diet"], calories: 580, protein: 20, carbs: 78, fat: 22, ingredients: ["Black Lentils","Kidney Beans","Butter","Cream","Garlic Naan"],      preparationSteps: ["Slow-cook lentils + beans with butter.","Finish with cream.","Serve with naan."] },
  { name: "Pasta Arrabbiata",                    dietType: "vegetarian", category: "dinner",     type: "maintenance", tags: ["Balanced Diet"],                calories: 430, protein: 14, carbs: 72, fat: 12, ingredients: ["Penne Pasta","Crushed Tomatoes","Red Chili","Garlic","Olive Oil"],   preparationSteps: ["Cook pasta al dente.","Simmer spicy tomato sauce.","Toss pasta in sauce."] },
  { name: "Fruit & Nut Yogurt Bowl",             dietType: "vegetarian", category: "snack",      type: "maintenance", tags: ["Balanced Diet"],                calories: 220, protein: 12, carbs: 28, fat: 8,  ingredients: ["Greek Yogurt","Mixed Fruits","Almonds","Honey"],                  preparationSteps: ["Layer yogurt with fruits.","Top with almonds.","Drizzle honey."] },
  { name: "Roasted Masala Makhana",              dietType: "vegetarian", category: "snack",      type: "maintenance", tags: ["High-Protein", "Low-Carb"],     calories: 210, protein: 8,  carbs: 26, fat: 10, ingredients: ["Fox Nuts","Ghee","Turmeric","Black Pepper"],                       preparationSteps: ["Roast makhana in ghee slowly.","Toss with spices until crunchy."] },
  { name: "Spiced Cucumber & Carrot Sticks",     dietType: "vegetarian", category: "snack",      type: "cutting",     tags: ["Keto","Low-Carb"],               calories: 110, protein: 4,  carbs: 18,  fat: 2,  ingredients: ["Cucumber","Carrot","Chaat Masala","Lemon"],                      preparationSteps: ["Slice veggies into sticks.","Sprinkle chaat masala & lemon juice."] },
  { name: "Paneer Cubes with Mint Chutney",      dietType: "vegetarian", category: "snack",      type: "cutting",     tags: ["High-Protein","Keto"],           calories: 200, protein: 16, carbs: 4,  fat: 14, ingredients: ["Paneer","Mint","Coriander","Green Chilies","Lemon"],               preparationSteps: ["Cut paneer into cubes.","Blend chutney ingredients.","Serve together."] },
];

async function nuclearFix() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
  await mongoose.connect(uri);

  console.log("🚀 Starting Nuclear Fix...");

  // 1. Wipe all current meal plans (they reference old meal IDs)
  const planResult = await MealPlan.deleteMany({});
  console.log(`🗑️ Deleted ${planResult.deletedCount} stale meal plans.`);

  // 2. Wipe all vegetarian meals
  const mealResult = await Meal.deleteMany({ dietType: "vegetarian" });
  console.log(`🗑️ Deleted ${mealResult.deletedCount} vegetarian meals.`);

  // 3. Re-seed clean vegetarian meals
  let inserted = 0;
  for (const meal of vegetarianMeals) {
    await Meal.create(meal);
    inserted++;
  }
  console.log(`✅ Re-seeded ${inserted} clean vegetarian meals.`);

  console.log("🏁 Nuclear Fix Complete. Users must now regenerate their plans.");
  process.exit(0);
}

nuclearFix().catch(console.error);
