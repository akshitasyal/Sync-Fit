import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import UserStats from "@/models/UserStats";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    // @ts-ignore
    const userEmail = session.user.email;

    let stats = await UserStats.findOne({ userEmail }).lean();
    if (!stats) {
      stats = await UserStats.create({
        userEmail,
        points: 25,
        level: 1,
        streak: 1,
        badges: ["First Step"],
        lastActiveDate: new Date().toISOString().split("T")[0]
      });
    }

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
