import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { mealId } = await req.json();
    if (!mealId) return NextResponse.json({ message: "Missing ID constraint" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }) as any;
    
    if(!user.favoriteMeals) user.favoriteMeals = [];

    const idx = user.favoriteMeals.indexOf(mealId);
    if (idx !== -1) {
      user.favoriteMeals.splice(idx, 1);
    } else {
      user.favoriteMeals.push(mealId);
    }
    
    await user.save();
    return NextResponse.json({ message: "Favorites synced", favorites: user.favoriteMeals }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
