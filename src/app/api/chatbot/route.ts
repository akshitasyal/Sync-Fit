import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Meal from "@/models/Meal";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ reply: "Please log in so I can personalize your fitness advice!" }, { status: 401 });

    const { message } = await req.json();
    const query = message.toLowerCase();

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean() as any;
    
    if (!user || !user.recommendations) {
      return NextResponse.json({ reply: "I need your physiological data first! Please visit the Profile page to calibrate your engine." }, { status: 200 });
    }

    const recs = user.recommendations;

    if (query.includes("calorie") || query.includes("objective") || query.includes("target")) {
      return NextResponse.json({ reply: `Based on your goal to ${user.goal}, your daily AI-calibrated target is exactly ${recs.recommendedCalories} kcal.` }, { status: 200 });
    }
    
    if (query.includes("workout") || query.includes("exercise") || query.includes("train")) {
      return NextResponse.json({ reply: `Given your ${user.energyLevel} energy levels, your optimum workout intensity is ${recs.workoutIntensity.toUpperCase()}.` }, { status: 200 });
    }

    if (query.includes("meal") || query.includes("food") || query.includes("eat") || query.includes("suggest") || query.includes("hungry")) {
      const meals = await Meal.find({ type: recs.dietType }).lean() as any[];
      if (meals.length > 0) {
        const suggestion = meals[Math.floor(Math.random() * meals.length)];
        return NextResponse.json({ reply: `Since you are on a ${recs.dietType} diet, I highly recommend trying our **${suggestion.name}**! It packs ${suggestion.protein}g of protein for only ${suggestion.calories} kcal.` }, { status: 200 });
      }
      return NextResponse.json({ reply: `I recommend checking your Meal Plan dashboard! It has been pre-loaded with ${recs.dietType} recipes.` }, { status: 200 });
    }

    return NextResponse.json({ reply: `I'm your Sync-Fit Context Assistant. Ask me about your 'calories', 'workouts', or tell me you're 'hungry' for a meal suggestion tailored precisely to your ${recs.dietType} profile!` }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ reply: "I'm having trouble connecting to the logic engine right now. Try again later!" }, { status: 500 });
  }
}
