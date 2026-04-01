import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { evaluateFuzzyLogic } from "@/lib/fuzzyLogic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { age, height, weight, gender, energyLevel, sleepQuality, goal, dietPreference, experienceLevel } = data;

    if (!age || !height || !weight || !energyLevel || !sleepQuality || !goal) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    const fuzzyOutputs = evaluateFuzzyLogic({
      age: Number(age),
      bmi,
      energyLevel,
      sleepQuality,
      goal,
      experienceLevel: experienceLevel || "beginner"
    });

    await connectToDatabase();

    const userEmail = session.user?.email;
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        age, height, weight, gender, energyLevel, sleepQuality, goal, dietPreference, experienceLevel,
        recommendations: {
          bmi: parseFloat(bmi.toFixed(1)),
          recommendedCalories: fuzzyOutputs.recommendedCalories,
          dietType: fuzzyOutputs.dietType,
          workoutIntensity: fuzzyOutputs.workoutIntensity,
        }
      },
      { new: true }
    );

    // Track weight progress
    const { default: Progress } = await import("@/models/Progress");
    const todayDate = new Date().toISOString().split("T")[0];
    await Progress.findOneAndUpdate(
      { userEmail: session.user.email, date: todayDate },
      { weight: Number(weight) },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Analysis complete", data: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Recommendations logic error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
