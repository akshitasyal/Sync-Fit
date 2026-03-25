import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Meal from "@/models/Meal";

const vratMeals = [
  {
    name: "Sabudana Khichdi",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian"],
    category: "breakfast",
    calories: 350,
    protein: 5,
    carbs: 65,
    fat: 10,
    ingredients: ["Sabudana (Sago)", "Peanuts", "Green Chillies", "Curry Leaves", "Sendha Namak (Rock Salt)", "Ghee"],
    preparationSteps: ["Soak Sabudana for 4 hours", "Roast and crush peanuts", "Sauté chillies and curry leaves in ghee", "Add sabudana, peanuts and salt", "Cook until translucent"]
  },
  {
    name: "Kuttu Ki Puri with Aloo Zeera",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian"],
    category: "lunch",
    calories: 450,
    protein: 8,
    carbs: 55,
    fat: 22,
    ingredients: ["Kuttu Atta (Buckwheat flour)", "Boiled Potatoes", "Cumin Seeds", "Sendha Namak", "Green Chillies", "Oil"],
    preparationSteps: ["Knead Kuttu atta with mashed potatoes", "Make small balls and fry as puris", "Sauté potatoes with cumin and salt for Aloo Zeera"]
  },
  {
    name: "Singhara Halwa",
    type: "bulking",
    dietType: ["Fasting", "Vegetarian"],
    category: "snack",
    calories: 280,
    protein: 3,
    carbs: 45,
    fat: 12,
    ingredients: ["Singhara Atta (Water Chestnut flour)", "Sugar/Jaggery", "Ghee", "Cardamom", "Nuts"],
    preparationSteps: ["Roast flour in ghee until fragrant", "Add warm water and sugar", "Stir until thick", "Garnish with nuts"]
  },
  {
    name: "Makhana Kheer",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian"],
    category: "dinner",
    calories: 320,
    protein: 10,
    carbs: 40,
    fat: 14,
    ingredients: ["Makhana (Fox Nuts)", "Milk", "Sugar", "Saffron", "Cardamom"],
    preparationSteps: ["Roast makhana in ghee and crush slightly", "Boil milk and reduce", "Add makhana and sugar", "Simmer until creamy"]
  },
  {
    name: "Fruit & Nut Bowl",
    type: "cutting",
    dietType: ["Fasting", "Vegetarian", "Vegan"],
    category: "snack",
    calories: 200,
    protein: 4,
    carbs: 35,
    fat: 6,
    ingredients: ["Apple", "Banana", "Pomegranate", "Walnuts", "Almonds"],
    preparationSteps: ["Chop fruits into equal sizes", "Toss with crushed nuts", "Optional: sprinkle some Sendha Namak and lemon"]
  },
  {
    name: "Rajgira Paratha",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian"],
    category: "breakfast",
    calories: 310,
    protein: 7,
    carbs: 48,
    fat: 10,
    ingredients: ["Rajgira Atta (Amaranth flour)", "Mashed Potatoes", "Green Chillies", "Sendha Namak"],
    preparationSteps: ["Mix flour and potato to form dough", "Roll out parathas", "Cook on griddle with ghee"]
  },
  {
    name: "Vrat Wali Paneer Curry",
    type: "bulking",
    dietType: ["Fasting", "Vegetarian"],
    category: "lunch",
    calories: 380,
    protein: 18,
    carbs: 12,
    fat: 28,
    ingredients: ["Paneer", "Tomato Puree", "Ginger", "Green Chillies", "Cumin", "Cream/Malai", "Sendha Namak"],
    preparationSteps: ["Sauté cumin and ginger", "Add tomato puree and cook", "Add paneer cubes and salt", "Finish with a splash of cream"]
  },
  {
    name: "Baked Sweet Potato Wedges",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian", "Vegan"],
    category: "snack",
    calories: 180,
    protein: 2,
    carbs: 42,
    fat: 1,
    ingredients: ["Sweet Potato", "Black Pepper", "Sendha Namak", "Lemon Juice"],
    preparationSteps: ["Slice potatoes into wedges", "Season with salt and pepper", "Bake at 200°C until crispy", "Drizzle with lemon"]
  },
  {
    name: "Samak Rice Khichdi",
    type: "maintenance",
    dietType: ["Fasting", "Vegetarian"],
    category: "dinner",
    calories: 290,
    protein: 6,
    carbs: 52,
    fat: 7,
    ingredients: ["Samak Rice (Barnyard Millet)", "Potatoes", "Ginger", "Curry Leaves", "Ghee"],
    preparationSteps: ["Wash Samak rice", "Sauté potatoes and ginger in ghee", "Add rice and water (1:2 ratio)", "Pressure cook or simmer until soft"]
  },
  {
    name: "Cucumber Raita (Fasting Style)",
    type: "cutting",
    dietType: ["Fasting", "Vegetarian"],
    category: "snack",
    calories: 120,
    protein: 6,
    carbs: 8,
    fat: 7,
    ingredients: ["Curd (Yogurt)", "Grated Cucumber", "Roasted Cumin Powder", "Sendha Namak"],
    preparationSteps: ["Whisk curd until smooth", "Mix in cucumber and spices", "Serve chilled"]
  }
];

export async function POST() {
  try {
    await connectToDatabase();
    
    // Clear existing fasting meals to avoid duplicates (optional but safer for seeding)
    // await Meal.deleteMany({ dietType: "Fasting" });
    
    const count = await Meal.countDocuments({ dietType: "Fasting" });
    if (count > 0) {
        return NextResponse.json({ message: "Fasting meals already exist", count }, { status: 200 });
    }

    const created = await Meal.insertMany(vratMeals);
    return NextResponse.json({ message: "Vrat meals seeded successfully", count: created.length }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
