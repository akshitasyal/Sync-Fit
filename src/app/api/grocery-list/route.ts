import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import Meal from "@/models/Meal";

const categorizeIngredient = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("chicken") || n.includes("beef") || n.includes("turkey") || n.includes("fish") || n.includes("tofu") || n.includes("shrimp") || n.includes("salmon") || n.includes("egg")) return "Proteins";
  if (n.includes("spinach") || n.includes("broccoli") || n.includes("kale") || n.includes("pepper") || n.includes("onion") || n.includes("garlic") || n.includes("carrot") || n.includes("tomato") || n.includes("cucumber") || n.includes("lettuce")) return "Vegetables";
  if (n.includes("milk") || n.includes("cheese") || n.includes("yogurt") || n.includes("butter") || n.includes("curd") || n.includes("paneer")) return "Dairy";
  if (n.includes("rice") || n.includes("quinoa") || n.includes("oats") || n.includes("pasta") || n.includes("bread") || n.includes("potato") || n.includes("sweet potato") || n.includes("sabudana") || n.includes("kuttu") || n.includes("rajgira") || n.includes("singhara") || n.includes("samak")) return "Grains & Carbs";
  if (n.includes("oil") || n.includes("avocado") || n.includes("nut") || n.includes("seed") || n.includes("almond") || n.includes("walnut") || n.includes("makhana")) return "Fats & Nuts";
  if (n.includes("rock salt") || n.includes("sendha namak")) return "Pantry & Others";
  return "Pantry & Others";
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const plan = await MealPlan.findOne({ userEmail: session.user.email }).populate("days.meals.mealId").lean() as any;
    
    if (!plan) return NextResponse.json({ message: "No meal plan found" }, { status: 404 });

    const ingredientMap: Record<string, string[]> = {
      "Proteins": [],
      "Vegetables": [],
      "Grains & Carbs": [],
      "Dairy": [],
      "Fats & Nuts": [],
      "Pantry & Others": []
    };

    plan.days.forEach((day: any) => {
      day.meals.forEach((m: any) => {
        if (m.mealId && m.mealId.ingredients) {
          m.mealId.ingredients.forEach((ing: string) => {
            const category = categorizeIngredient(ing);
            if (!ingredientMap[category].includes(ing)) {
              ingredientMap[category].push(ing);
            }
          });
        }
      });
    });

    return NextResponse.json(ingredientMap, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
