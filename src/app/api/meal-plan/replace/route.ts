import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import User from "@/models/User";
import Meal from "@/models/Meal";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { mealPlanId, dayDate, oldMealId, slot } = await req.json();

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean() as any;
    const dietPref = user.dietPreference || "Balanced Diet";

    const mp = await MealPlan.findById(mealPlanId);
    if (!mp) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (mp.userEmail !== session.user.email) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const categoryMatcher = slot === "snack" ? { $in: ["snack", "pre-workout", "post-workout"] } : slot;

    let candidates = await Meal.find({ dietType: dietPref, category: categoryMatcher, _id: { $ne: oldMealId } }).lean() as any[];
    
    if (candidates.length === 0) {
      candidates = await Meal.find({ _id: { $ne: oldMealId }, category: categoryMatcher }).lean() as any[];
      if (candidates.length === 0) return NextResponse.json({ message: "No absolute alternatives available" }, { status: 400 });
    }

    let newMeal;
    if (user.goal === "muscle gain") {
      candidates.sort((a, b) => b.protein - a.protein);
      const topCandidates = candidates.slice(0, 3);
      newMeal = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    } else {
      newMeal = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const dayObj = mp.days.find((d: any) => d.date === dayDate);
    if (!dayObj) return NextResponse.json({ message: "Day metric not found" }, { status: 404 });

    const targetIdx = dayObj.meals.findIndex((m: any) => m.mealId.toString() === oldMealId && m.slot === slot);
    if (targetIdx !== -1) {
       dayObj.meals[targetIdx].mealId = newMeal._id;
       await mp.save(); 
       
       const populatedMp = await MealPlan.findById(mealPlanId).populate("days.meals.mealId") as any;
       const popDay = populatedMp.days.find((d: any) => d.date === dayDate);
       let totalCals = 0, totalPro = 0, totalCarb = 0, totalFat = 0;
       popDay.meals.forEach((m: any) => {
         totalCals += m.mealId.calories;
         totalPro += m.mealId.protein;
         totalCarb += m.mealId.carbs;
         totalFat += m.mealId.fat;
       });
       
       popDay.totalCalories = totalCals;
       popDay.totalProtein = totalPro;
       popDay.totalCarbs = totalCarb;
       popDay.totalFat = totalFat;
       await populatedMp.save();

       return NextResponse.json({ message: "Meal replaced robustly", data: populatedMp }, { status: 200 });
    }

    return NextResponse.json({ message: "Algorithm constraint Error: Entry not found" }, { status: 404 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
