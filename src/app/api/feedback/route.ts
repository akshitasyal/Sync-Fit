import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { type, targetId, feedback } = await req.json(); // type: 'meal' | 'exercise' | 'workout-intensity'

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (type === 'meal') {
      if (feedback === 'dislike') {
        if (!user.dislikedMeals.includes(targetId)) {
          user.dislikedMeals.push(targetId);
        }
      } else if (feedback === 'like') {
        user.dislikedMeals = user.dislikedMeals.filter((id: any) => id.toString() !== targetId);
      }
    } else if (type === 'exercise') {
      if (feedback === 'dislike') {
        if (!user.dislikedExercises.includes(targetId)) {
          user.dislikedExercises.push(targetId);
        }
      } else if (feedback === 'like') {
        user.dislikedExercises = user.dislikedExercises.filter((id: any) => id.toString() !== targetId);
      }
    } else if (type === 'workout-intensity') {
      user.workoutFeedback = feedback; // too-easy, perfect, too-hard
    }

    await user.save();
    return NextResponse.json({ message: "Feedback saved successfully", user }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
