import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { workoutService } from "@/services/workoutService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const plan = await workoutService.getWorkoutPlan(session.user.email as string);
    if (!plan) return NextResponse.json({ message: "No workout plan found", data: null }, { status: 200 });

    return NextResponse.json({ message: "Success", data: plan }, { status: 200 });
  } catch (err: any) {
    console.error("GET WorkoutPlan error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const plan = await workoutService.generateWeeklyWorkoutPlan(session.user.email as string);
    // getWorkoutPlan also populates
    const populatedPlan = await workoutService.getWorkoutPlan(session.user.email as string);

    return NextResponse.json({ message: "Workout plan generated successfully", data: populatedPlan }, { status: 200 });
  } catch (err: any) {
    console.error("POST WorkoutPlan generation error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
