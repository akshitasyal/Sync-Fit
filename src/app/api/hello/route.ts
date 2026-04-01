import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Meal from "@/models/Meal";

export async function GET() {
  await connectToDatabase();
  const count = await Meal.countDocuments();
  const vegans = await Meal.find({ dietType: "vegan" }).lean();
  const vegansIn = await Meal.find({ dietType: { $in: ["vegan"] } }).lean();

  return NextResponse.json({
    count,
    vegansCount: vegans.length,
    vegansInCount: vegansIn.length,
    sample: vegans.length > 0 ? vegans[0] : (await Meal.find().limit(1).lean())[0]
  });
}
