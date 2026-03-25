import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import User from "@/models/User";
import UserStats from "@/models/UserStats";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const today = new Date().toISOString().split("T")[0];
    const log = await DailyLog.findOne({ userEmail: session.user.email, date: today }).lean();

    return NextResponse.json(log || { mealsConsumed: [], totalCalories: 0 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, calories, protein, carbs, fats } = await req.json();
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const targetCalories = user.recommendations?.recommendedCalories || 2000;

    let log = await DailyLog.findOne({ userEmail: session.user.email, date: today });

    if (!log) {
      log = new DailyLog({
        userEmail: session.user.email,
        date: today,
        mealsConsumed: [],
        totalCalories: 0,
        targetCalories
      });
    }

    log.mealsConsumed.push({ name, calories, protein, carbs, fats });
    log.totalCalories += Number(calories);
    await log.save();

    // Gamification: Update points for logging a meal (+5 points)
    let stats = await UserStats.findOne({ userEmail: session.user.email });
    if (!stats) {
      stats = new UserStats({ userEmail: session.user.email, points: 0, level: 1, streak: 0, badges: [] });
    }
    
    // Streak Logic
    const lastActive = stats.lastActiveDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (lastActive === today) {
      // Already active today, keep streak
    } else if (lastActive === yesterdayStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastActiveDate = today;
    stats.points += 5;
    
    // Badge Logic
    const newBadges = [...(stats.badges || [])];
    if (!newBadges.includes("First Meal")) {
      newBadges.push("First Meal");
    }
    if (stats.streak >= 3 && !newBadges.includes("Streak Starter")) {
      newBadges.push("Streak Starter");
    }
    if (Math.abs(log.totalCalories - targetCalories) < (targetCalories * 0.05) && !newBadges.includes("Calorie King")) {
      newBadges.push("Calorie King");
    }
    stats.badges = newBadges;

    // Level up check (every 100 points)
    const newLevel = Math.floor(stats.points / 100) + 1;
    if (newLevel > stats.level) stats.level = newLevel;
    
    await stats.save();

    return NextResponse.json({ message: "Meal logged successfully", log, stats }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
