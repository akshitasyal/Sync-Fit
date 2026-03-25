import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import WorkoutPlan from "@/models/WorkoutPlan";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { dayDate, exerciseId } = await req.json();

    await connectToDatabase();
    const plan = await WorkoutPlan.findOne({ userEmail: session.user.email, "days.date": dayDate });
    if (!plan) return NextResponse.json({ message: "Workout plan not found" }, { status: 404 });

    const day = plan.days.find((d: any) => d.date === dayDate);
    const exercise = day.exercises.find((ex: any) => ex.exerciseId.toString() === exerciseId);

    if (exercise) {
      exercise.completed = !exercise.completed;
      const previouslyCompleted = day.isCompleted;
      day.isCompleted = day.exercises.every((ex: any) => ex.completed);
      
      await plan.save();

      // Gamification Logic
      if (day.isCompleted && !previouslyCompleted) {
        const { default: UserStats } = await import("@/models/UserStats");
        let stats = await UserStats.findOne({ userEmail: session.user.email });
        if (!stats) {
          stats = new UserStats({ userEmail: session.user.email, points: 0, level: 1, streak: 0, badges: [] });
        }

        const today = new Date().toISOString().split("T")[0];
        const lastActive = stats.lastActiveDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastActive !== today) {
          if (lastActive === yesterdayStr) {
            stats.streak += 1;
          } else {
            stats.streak = 1;
          }
          stats.lastActiveDate = today;
        }

        stats.points += 20; // +20 for full workout completion
        
        // Badge: 7-Day Streak
        if (stats.streak >= 7 && !stats.badges.includes("7-Day Streak")) {
          stats.badges.push("7-Day Streak");
        }

        const newLevel = Math.floor(stats.points / 100) + 1;
        if (newLevel > stats.level) stats.level = newLevel;

        await stats.save();
        return NextResponse.json({ message: "Day completed! +20 points awarded.", data: plan, stats }, { status: 200 });
      }
      
      return NextResponse.json({ message: "Exercise status updated", data: plan }, { status: 200 });
    }

    return NextResponse.json({ message: "Exercise not found in plan" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
