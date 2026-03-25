import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateWeeklyMealPlan } from "@/lib/mealPlanner";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const newPlan = await generateWeeklyMealPlan(session.user.email as string);
    return NextResponse.json({ message: "Weekly plan generated", data: newPlan }, { status: 200 });

  } catch (error: any) {
    if (error.message === "Profile incomplete" || error.message === "No meals in database") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("Meal Generation error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
