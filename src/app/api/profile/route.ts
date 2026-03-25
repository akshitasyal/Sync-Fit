import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean();
    
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: body },
      { new: true }
    ).lean();

    return NextResponse.json({ message: "Profile updated", data: updatedUser }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
