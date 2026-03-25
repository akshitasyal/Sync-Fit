import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import "@/models/Meal"; 

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Sort descending by weekStartDate to grab the newest structural configuration
    const mealPlan = await MealPlan.findOne({
      userEmail: session.user.email
    }).sort({ weekStartDate: -1 }).populate("days.meals.mealId").lean();

    if (!mealPlan) {
      return NextResponse.json({ message: "No plan found", data: null }, { status: 200 });
    }

    return NextResponse.json({ message: "Success", data: mealPlan }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
