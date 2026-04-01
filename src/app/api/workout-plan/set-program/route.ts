import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import WorkoutPlan from "@/models/WorkoutPlan";
import { generateWeeklyWorkoutPlan } from "@/lib/workoutPlanner";

const VALID_PROGRAMS = ["strength", "weight-loss", "cardio", "adaptive", "muscle-gain", "beginner"];

// PATCH /api/workout-plan/set-program
// Body: { program: string }
// Updates user.selectedProgram and regenerates the weekly workout plan
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { program } = body;

    if (!program || !VALID_PROGRAMS.includes(program)) {
      return NextResponse.json(
        { message: `Invalid program. Must be one of: ${VALID_PROGRAMS.join(", ")}` },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1 — Update user profile
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          selectedProgram: program,
          programStartDate: new Date().toISOString().split("T")[0],
        },
      }
    );

    // 2 — Delete current week's plan so we generate fresh
    const weekStartDate = new Date().toISOString().split("T")[0];
    await WorkoutPlan.deleteOne({ userEmail: session.user.email, weekStartDate });

    // 3 — Generate new plan for the chosen program
    const newPlan = await generateWeeklyWorkoutPlan(session.user.email, program);
    const populated = await WorkoutPlan.findById(newPlan._id)
      .populate("days.exercises.exerciseId")
      .lean();

    return NextResponse.json(
      { message: `Program set to "${program}" and new plan generated.`, data: populated, program },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("set-program error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
