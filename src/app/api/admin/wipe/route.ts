import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Meal from "@/models/Meal";
import MealPlan from "@/models/MealPlan";
import ShoppingList from "@/models/ShoppingList";

export async function GET() {
  try {
    await connectToDatabase();
    
    const meals = await Meal.deleteMany({});
    const plans = await MealPlan.deleteMany({});
    const lists = await ShoppingList.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: "☢️ TOTAL NUCLEAR WIPE COMPLETE",
      deleted: {
        meals: meals.deletedCount,
        plans: plans.deletedCount,
        lists: lists.deletedCount
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
