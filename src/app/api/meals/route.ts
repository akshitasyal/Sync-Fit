import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Meal from "@/models/Meal";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // @ts-ignore
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });
    
    if (!user || !user.recommendations) {
      // Return maintenance meals as fallback
      const meals = await Meal.find({ type: "maintenance" });
      return NextResponse.json(meals, { status: 200 });
    }

    const { dietType } = user.recommendations;
    const meals = await Meal.find({ type: dietType });
    
    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching meals" }, { status: 500 });
  }
}
