import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { mealService } from "@/services/mealService";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const plan = await mealService.generateWeeklyMealPlan(session.user.email as string);
    return NextResponse.json({ message: "Weekly plan generated", data: plan }, { status: 200 });

  } catch (error: any) {
    // Known / expected errors — return 400 with user-friendly message
    const knownCodes = ["EMPTY_MEAL_POOL"];
    const knownMessages = ["Profile incomplete", "No meals in database"];

    if (knownCodes.includes(error?.code) || knownMessages.includes(error?.message)) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          hint: error.code === "EMPTY_MEAL_POOL"
            ? "Visit /api/seed-meals to populate the meals database."
            : undefined,
        },
        { status: 400 }
      );
    }

    // Unexpected error — log and return 500
    console.error("[/api/meal-plan/generate] Unexpected error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
