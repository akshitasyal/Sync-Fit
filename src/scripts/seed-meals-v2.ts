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

const v2Meals = [
  // ------------------------- VEGAN BREAKFAST (5) -------------------------
  {
    name: "Tofu Scramble",
    type: "maintenance",
    dietType: "vegan",
    tags: ["High-Protein", "Low-Carb"],
    category: "breakfast",
    calories: 250, protein: 20, carbs: 8, fat: 15,
    ingredients: ["Firm Tofu", "Spinach", "Turmeric", "Onion", "Olive Oil"],
    preparationSteps: ["Crumble tofu.", "Saute onions and spinach in olive oil.", "Add tofu and turmeric, cook for 5 mins."]
  },
  {
    name: "Vegan Sabudana Khichdi",
    type: "cutting",
    dietType: "vegan",
    tags: ["Gluten-Free", "Fasting"],
    category: "breakfast",
    calories: 320, protein: 4, carbs: 65, fat: 10,
    ingredients: ["Sabudana", "Peanuts", "Green Chilies", "Cumin Seeds", "Coconut Oil"],
    preparationSteps: ["Soak sabudana overnight.", "Heat coconut oil, add cumin and chilies.", "Add peanuts and sabudana, cook until translucent."]
  },
  {
    name: "Chia Seed Pudding",
    type: "maintenance",
    dietType: "vegan",
    tags: ["Keto", "Low-Carb"],
    category: "breakfast",
    calories: 200, protein: 6, carbs: 12, fat: 14,
    ingredients: ["Chia Seeds", "Almond Milk", "Maple Syrup", "Berries"],
    preparationSteps: ["Mix chia seeds and almond milk.", "Refrigerate overnight.", "Top with berries and syrup."]
  },
  {
    name: "Oatmeal with Almond Milk",
    type: "bulking",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "breakfast",
    calories: 350, protein: 10, carbs: 60, fat: 8,
    ingredients: ["Rolled Oats", "Almond Milk", "Banana", "Walnuts"],
    preparationSteps: ["Cook oats in almond milk.", "Top with sliced banana and walnuts."]
  },
  {
    name: "Poha",
    type: "cutting",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "breakfast",
    calories: 280, protein: 5, carbs: 55, fat: 6,
    ingredients: ["Flattened Rice", "Peanuts", "Onion", "Turmeric", "Mustard Seeds", "Vegetable Oil"],
    preparationSteps: ["Wash poha and drain.", "Saute mustard seeds, onion, peanuts in oil.", "Mix in poha and turmeric."]
  },

  // ------------------------- VEGAN LUNCH (5) -------------------------
  {
    name: "Quinoa and Black Bean Salad",
    type: "maintenance",
    dietType: "vegan",
    tags: ["High-Protein", "Balanced Diet"],
    category: "lunch",
    calories: 400, protein: 15, carbs: 55, fat: 12,
    ingredients: ["Quinoa", "Black Beans", "Corn", "Bell Pepper", "Lime Juice"],
    preparationSteps: ["Cook quinoa.", "Mix with rinsed black beans, corn, and chopped peppers.", "Dress with lime juice."]
  },
  {
    name: "Dal Tadka with Roti",
    type: "bulking",
    dietType: "vegan",
    tags: ["High-Protein"],
    category: "lunch",
    calories: 450, protein: 18, carbs: 65, fat: 10,
    ingredients: ["Yellow Lentils", "Wheat Flour", "Tomato", "Garlic", "Coconut Oil"],
    preparationSteps: ["Boil lentils.", "Prepare tadka with garlic and tomato in coconut oil.", "Serve with roti made from wheat flour."]
  },
  {
    name: "Vegan Chickpea Curry (Chana Masala)",
    type: "maintenance",
    dietType: "vegan",
    tags: ["High-Protein", "Balanced Diet"],
    category: "lunch",
    calories: 380, protein: 16, carbs: 50, fat: 12,
    ingredients: ["Chickpeas", "Tomato Puree", "Onion", "Garam Masala", "Coconut Milk"],
    preparationSteps: ["Saute diced onions until golden.", "Add tomato puree and spices.", "Add chickpeas and coconut milk, simmer for 15 mins."]
  },
  {
    name: "Grilled Portobello Mushroom Wrap",
    type: "cutting",
    dietType: "vegan",
    tags: ["Low-Carb"],
    category: "lunch",
    calories: 300, protein: 8, carbs: 40, fat: 10,
    ingredients: ["Portobello Mushroom", "Whole Wheat Wrap", "Hummus", "Spinach"],
    preparationSteps: ["Grill the mushroom.", "Spread hummus on the wrap.", "Add mushroom and spinach, then roll."]
  },
  {
    name: "Lentil Soup with Sourdough Bread",
    type: "maintenance",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "lunch",
    calories: 350, protein: 18, carbs: 55, fat: 5,
    ingredients: ["Brown Lentils", "Carrots", "Celery", "Vegetable Broth", "Sourdough Bread"],
    preparationSteps: ["Simmer lentils, carrots, and celery in broth.", "Serve hot with a slice of sourdough."]
  },

  // ------------------------- VEGAN DINNER (5) -------------------------
  {
    name: "Vegan Palak Tofu",
    type: "cutting",
    dietType: "vegan",
    tags: ["High-Protein", "Keto"],
    category: "dinner",
    calories: 320, protein: 22, carbs: 15, fat: 18,
    ingredients: ["Spinach", "Firm Tofu", "Onion", "Garlic", "Spices", "Coconut Milk"],
    preparationSteps: ["Blanch and puree spinach.", "Saute garlic and onion, add puree.", "Add spices, coconut milk, and cubed tofu."]
  },
  {
    name: "Stir-fried Vegetables with Brown Rice",
    type: "maintenance",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 380, protein: 10, carbs: 65, fat: 8,
    ingredients: ["Broccoli", "Bell Peppers", "Soy Sauce", "Sesame Oil", "Brown Rice"],
    preparationSteps: ["Cook brown rice.", "Stir-fry vegetables in sesame oil with soy sauce.", "Serve vegetables over rice."]
  },
  {
    name: "Vegan Eggplant Parmesan",
    type: "bulking",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 450, protein: 12, carbs: 55, fat: 18,
    ingredients: ["Eggplant", "Marinara Sauce", "Vegan Mozzarella", "Almond Flour"],
    preparationSteps: ["Bread eggplant slices with almond flour.", "Bake until crispy.", "Layer with marinara and vegan cheese, bake again."]
  },
  {
    name: "Sweet Potato and Black Bean Enchiladas",
    type: "maintenance",
    dietType: "vegan",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 420, protein: 14, carbs: 70, fat: 10,
    ingredients: ["Sweet Potato", "Black Beans", "Enchilada Sauce", "Corn Tortillas"],
    preparationSteps: ["Roast sweet potatoes.", "Mash with black beans.", "Fill tortillas, top with sauce, and bake."]
  },
  {
    name: "Vegan Zucchini Noodles with Pesto",
    type: "cutting",
    dietType: "vegan",
    tags: ["Low-Carb", "Keto"],
    category: "dinner",
    calories: 250, protein: 6, carbs: 12, fat: 20,
    ingredients: ["Zucchini", "Basil", "Pine Nuts", "Olive Oil", "Nutritional Yeast"],
    preparationSteps: ["Spiralize zucchini.", "Blend basil, pine nuts, oil, and yeast into pesto.", "Toss noodles with pesto."]
  },


  // ------------------------- VEGETARIAN BREAKFAST (5) -------------------------
  {
    name: "Paneer Paratha",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["High-Protein", "Balanced Diet"],
    category: "breakfast",
    calories: 400, protein: 18, carbs: 45, fat: 15,
    ingredients: ["Wheat Flour", "Paneer", "Ghee", "Spices", "Coriander"],
    preparationSteps: ["Grate paneer and mix with spices.", "Stuff into wheat dough and roll.", "Cook on a pan with ghee."]
  },
  {
    name: "Greek Yogurt with Honey and Walnuts",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["High-Protein", "Keto"],
    category: "breakfast",
    calories: 280, protein: 20, carbs: 20, fat: 15,
    ingredients: ["Greek Yogurt", "Honey", "Walnuts"],
    preparationSteps: ["Serve Greek yogurt in a bowl.", "Drizzle with honey and top with walnuts."]
  },
  {
    name: "Vegetarian Omelette",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["High-Protein", "Keto"],
    category: "breakfast",
    calories: 320, protein: 22, carbs: 5, fat: 20,
    ingredients: ["Eggs", "Cheese", "Spinach", "Tomatoes", "Butter"],
    preparationSteps: ["Whisk eggs.", "Cook in butter, adding spinach, tomatoes, and cheese.", "Fold and serve."]
  },
  {
    name: "Idli Sambar",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "breakfast",
    calories: 350, protein: 12, carbs: 65, fat: 4,
    ingredients: ["Rice", "Urad Dal", "Toor Dal", "Vegetables", "Tamarind"],
    preparationSteps: ["Steam idli batter.", "Cook lentils with vegetables and tamarind for sambar.", "Serve together."]
  },
  {
    name: "Cheese and Tomato Toast",
    type: "bulking",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "breakfast",
    calories: 420, protein: 16, carbs: 45, fat: 18,
    ingredients: ["Whole Wheat Bread", "Cheddar Cheese", "Tomatoes", "Butter"],
    preparationSteps: ["Butter the bread.", "Add cheese and sliced tomato.", "Grill until cheese melts."]
  },

  // ------------------------- VEGETARIAN LUNCH (5) -------------------------
  {
    name: "Palak Paneer with Roti",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["High-Protein", "Balanced Diet"],
    category: "lunch",
    calories: 450, protein: 22, carbs: 45, fat: 20,
    ingredients: ["Spinach", "Paneer", "Garlic", "Spices", "Wheat Flour", "Ghee"],
    preparationSteps: ["Puree blanched spinach.", "Cook with spices and paneer cubes.", "Serve with fresh roti."]
  },
  {
    name: "Vegetable Biryani with Raita",
    type: "bulking",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "lunch",
    calories: 550, protein: 14, carbs: 80, fat: 18,
    ingredients: ["Basmati Rice", "Mixed Vegetables", "Yogurt", "Spices", "Ghee"],
    preparationSteps: ["Cook rice with spices and vegetables.", "Serve with yogurt raita."]
  },
  {
    name: "Caprese Salad",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Keto", "Low-Carb"],
    category: "lunch",
    calories: 300, protein: 18, carbs: 8, fat: 22,
    ingredients: ["Mozzarella Cheese", "Tomatoes", "Basil", "Balsamic Glaze", "Olive Oil"],
    preparationSteps: ["Slice mozzarella and tomatoes.", "Layer alternating slices, tuck in basil leaves.", "Drizzle with olive oil and glaze."]
  },
  {
    name: "Mushroom Risotto",
    type: "bulking",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "lunch",
    calories: 500, protein: 12, carbs: 70, fat: 18,
    ingredients: ["Arborio Rice", "Mushrooms", "Parmesan Cheese", "Vegetable Broth", "Butter"],
    preparationSteps: ["Sauté mushrooms.", "Gradually add broth to rice, stirring constantly.", "Finish with butter, parmesan, and mushrooms."]
  },
  {
    name: "Vegetarian Black Bean Burger",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["High-Protein", "Balanced Diet"],
    category: "lunch",
    calories: 480, protein: 20, carbs: 60, fat: 15,
    ingredients: ["Black Bean Patty", "Whole Wheat Bun", "Cheese", "Lettuce", "Tomato"],
    preparationSteps: ["Grill patty.", "Assemble burger with bun, cheese, and veggies."]
  },

  // ------------------------- VEGETARIAN DINNER (5) -------------------------
  {
    name: "Vegetable Korma with Naan",
    type: "bulking",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 600, protein: 16, carbs: 85, fat: 20,
    ingredients: ["Mixed Vegetables", "Cream", "Cashews", "Naan Bread", "Spices"],
    preparationSteps: ["Cook vegetables in a creamy cashew and spice gravy.", "Serve with garlic naan."]
  },
  {
    name: "Stuffed Bell Peppers",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Balanced Diet", "High-Protein"],
    category: "dinner",
    calories: 350, protein: 18, carbs: 45, fat: 12,
    ingredients: ["Bell Peppers", "Quinoa", "Black Beans", "Cheddar Cheese", "Tomato Sauce"],
    preparationSteps: ["Halve bell peppers.", "Stuff with cooked quinoa, beans, and sauce.", "Top with cheese and bake."]
  },
  {
    name: "Vegetarian Pad Thai",
    type: "maintenance",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 450, protein: 15, carbs: 65, fat: 14,
    ingredients: ["Rice Noodles", "Eggs", "Peanuts", "Bean Sprouts", "Tamarind Sauce"],
    preparationSteps: ["Stir fry noodles with sauce.", "Push aside, scramble eggs.", "Mix in sprouts and peanuts."]
  },
  {
    name: "Cauliflower Crust Pizza",
    type: "cutting",
    dietType: "vegetarian",
    tags: ["Keto", "Low-Carb"],
    category: "dinner",
    calories: 320, protein: 22, carbs: 15, fat: 18,
    ingredients: ["Cauliflower", "Eggs", "Mozzarella Cheese", "Tomato Sauce", "Vegetables"],
    preparationSteps: ["Pulse cauliflower and mix with egg and cheese.", "Bake crust.", "Add toppings and bake until cheese melts."]
  },
  {
    name: "Malai Kofta",
    type: "bulking",
    dietType: "vegetarian",
    tags: ["Balanced Diet"],
    category: "dinner",
    calories: 550, protein: 14, carbs: 60, fat: 28,
    ingredients: ["Paneer", "Potatoes", "Cream", "Cashews", "Spices"],
    preparationSteps: ["Make koftas with paneer and potatoes, deep fry.", "Simmer in a rich, creamy tomato gravy."]
  }
];

const seedV2Meals = async () => {
  try {
    await connectToDatabase();
    
    // Drop existing meals
    await Meal.deleteMany({});
    console.log("Cleared existing meals collection.");

    console.log(`Inserting ${v2Meals.length} v2 validated meals...`);
    await Meal.insertMany(v2Meals);
    console.log("V2 Meals successfully added!");

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed meals:", error);
    process.exit(1);
  }
};

seedV2Meals();
