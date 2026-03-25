import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import WorkoutPlan from "@/models/WorkoutPlan";
import { generateWeeklyWorkoutPlan } from "@/lib/workoutPlanner";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    // Get the most recent plan for the user
    const plan = await WorkoutPlan.findOne({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .populate("days.exercises.exerciseId")
      .lean();

    if (!plan) return NextResponse.json({ message: "No workout plan found" }, { status: 404 });

    return NextResponse.json(plan, { status: 200 });
  } catch (err: any) {
    console.error("GET WorkoutPlan error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const plan = await generateWeeklyWorkoutPlan(session.user.email as string);
    const populatedPlan = await WorkoutPlan.findById(plan._id).populate("days.exercises.exerciseId").lean();

    return NextResponse.json({ message: "Workout plan generated successfully", data: populatedPlan }, { status: 200 });
  } catch (err: any) {
    console.error("POST WorkoutPlan generation error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
