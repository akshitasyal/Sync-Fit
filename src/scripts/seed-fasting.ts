import * as dotenv from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import Meal from "../models/Meal";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};

const fastingMeals = [
  // BREAKFAST
  {
    name: "Fruit Bowl with Nuts",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "breakfast",
    calories: 250,
    protein: 5,
    carbs: 45,
    fat: 8,
    ingredients: ["Banana", "Apple", "Pomegranate", "Almonds", "Walnuts"],
    preparationSteps: [
      "Chop all fruits into bite-sized pieces.",
      "Mix them in a bowl.",
      "Top with roughly chopped almonds and walnuts."
    ],
    imageUrl: ""
  },
  {
    name: "Sabudana Kheer",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "breakfast",
    calories: 320,
    protein: 6,
    carbs: 60,
    fat: 7,
    ingredients: ["Sabudana (Sago)", "Milk", "Cardamom", "Almonds", "Sugar/Jaggery"],
    preparationSteps: [
      "Soak sabudana in water for 2 hours.",
      "Boil milk in a thick bottom pan.",
      "Add soaked sabudana and cook until translucent.",
      "Add sugar/jaggery, cardamom powder, and nuts. Serve warm or cold."
    ],
    imageUrl: ""
  },
  {
    name: "Makhana Milk with Dates",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "breakfast",
    calories: 280,
    protein: 8,
    carbs: 40,
    fat: 10,
    ingredients: ["Makhana (Foxnuts)", "Milk", "Dates", "Saffron"],
    preparationSteps: [
      "Lightly roast makhana in a pan.",
      "Boil milk and add chopped dates and saffron.",
      "Add roasted makhana and simmer for 5 minutes."
    ],
    imageUrl: ""
  },
  {
    name: "Dry Fruits Mix and Apple",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "breakfast",
    calories: 220,
    protein: 4,
    carbs: 35,
    fat: 8,
    ingredients: ["Apple", "Cashews", "Raisins", "Pistachios"],
    preparationSteps: [
      "Slice the apple.",
      "Serve alongside a mix of dry fruits."
    ],
    imageUrl: ""
  },

  // LUNCH
  {
    name: "Sabudana Khichdi",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "lunch",
    calories: 450,
    protein: 6,
    carbs: 70,
    fat: 16,
    ingredients: ["Sabudana", "Potatoes", "Roasted Peanuts", "Green Chilies", "Cumin Seeds", "Ghee", "Sendha Namak (Rock Salt)"],
    preparationSteps: [
      "Soak sabudana overnight or for 4-5 hours.",
      "Heat ghee in a pan, add cumin seeds and chopped potatoes. Cook until tender.",
      "Add crushed roasted peanuts, green chilies, and soaked sabudana.",
      "Season with rock salt, mix well, and cook until sabudana is translucent."
    ],
    imageUrl: ""
  },
  {
    name: "Kuttu Puri with Aloo Sabzi",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "lunch",
    calories: 520,
    protein: 8,
    carbs: 75,
    fat: 20,
    ingredients: ["Kuttu Flour (Buckwheat)", "Potatoes", "Ghee", "Tomatoes", "Sendha Namak", "Cumin Seeds"],
    preparationSteps: [
      "Knead a dough using kuttu flour and mashed potatoes. Make small puris and deep fry in ghee.",
      "For sabzi: Heat ghee, add cumin and chopped tomatoes. Cook until soft.",
      "Add boiled potatoes and water. Simmer with rock salt for 10 mins."
    ],
    imageUrl: ""
  },
  {
    name: "Rajgira Roti with Curd",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "lunch",
    calories: 350,
    protein: 10,
    carbs: 55,
    fat: 8,
    ingredients: ["Rajgira Flour (Amaranth)", "Mashed Potatoes", "Sendha Namak", "Curd (Yogurt)"],
    preparationSteps: [
      "Mix rajgira flour with mashed potatoes and salt. Knead into a dough.",
      "Roll into thin rotis and cook on a tawa (griddle).",
      "Serve hot with fresh curd."
    ],
    imageUrl: ""
  },
  {
    name: "Sama Rice Khichdi",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "lunch",
    calories: 310,
    protein: 7,
    carbs: 50,
    fat: 9,
    ingredients: ["Sama Rice (Barnyard Millet)", "Potatoes", "Peanuts", "Ghee", "Cumin Seeds"],
    preparationSteps: [
      "Wash and soak sama rice for 20 mins.",
      "Heat ghee, add cumin seeds, potatoes, and peanuts. Sauté well.",
      "Add soaked sama rice, rock salt, and water. Cook until water is absorbed and rice is soft."
    ],
    imageUrl: ""
  },

  // DINNER
  {
    name: "Lauki Sabzi with Singhara Roti",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "dinner",
    calories: 280,
    protein: 6,
    carbs: 45,
    fat: 7,
    ingredients: ["Lauki (Bottle Gourd)", "Singhara Flour", "Ghee", "Sendha Namak", "Green Chilies"],
    preparationSteps: [
      "Cube the lauki. Heat ghee, add cumin and chilies, then add lauki and rock salt. Cook until tender.",
      "Knead singhara flour with water/potato. Roll into rotis and cook on a tawa.",
      "Serve hot."
    ],
    imageUrl: ""
  },
  {
    name: "Makhana Curry",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "dinner",
    calories: 320,
    protein: 8,
    carbs: 35,
    fat: 15,
    ingredients: ["Makhana", "Tomatoes", "Cashews", "Ghee", "Sendha Namak"],
    preparationSteps: [
      "Roast makhana lightly.",
      "Blend tomatoes and cashews into a paste. Heat ghee and cook the paste.",
      "Add water to make a gravy, season with rock salt, and add roasted makhana just before serving."
    ],
    imageUrl: ""
  },
  {
    name: "Sweet Potato Chaat",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "dinner",
    calories: 240,
    protein: 4,
    carbs: 55,
    fat: 1,
    ingredients: ["Sweet Potatoes", "Lemon Juice", "Sendha Namak", "Roasted Cumin Powder"],
    preparationSteps: [
      "Boil or roast sweet potatoes until tender.",
      "Peel and cube them into a bowl.",
      "Sprinkle salt, cumin powder, and lemon juice. Toss well."
    ],
    imageUrl: ""
  },
  {
    name: "Fasting Thali (Light Meal)",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Fasting"],
    category: "dinner",
    calories: 380,
    protein: 9,
    carbs: 65,
    fat: 12,
    ingredients: ["Paneer", "Tomatoes", "Sama Rice", "Curd", "Ghee"],
    preparationSteps: [
      "Prepare a simple paneer curry using tomatoes, ghee, and rock salt.",
      "Cook sama rice.",
      "Serve the paneer and rice with a side of plain curd."
    ],
    imageUrl: ""
  }
];

const seedFastingMeals = async () => {
  try {
    await connectToDatabase();
    
    // First, check if fasting meals already exist to avoid duplicates
    const count = await Meal.countDocuments({ dietType: "fasting" });
    if (count === 0) {
      console.log(`Inserting ${fastingMeals.length} fasting meals...`);
      await Meal.insertMany(fastingMeals);
      console.log("Fasting meals successfully added.");
    } else {
      console.log(`Fasting meals already exist (${count} found). Skipping insertion.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed fasting meals:", error);
    process.exit(1);
  }
};

seedFastingMeals();
