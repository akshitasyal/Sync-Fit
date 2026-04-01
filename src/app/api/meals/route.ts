import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Meal from "@/models/Meal";

function getHierarchicalDietFilter(dietPref: string): string[] {
  const normalized = dietPref.toLowerCase();
  
  if (normalized === "vegan") {
    return ["vegan"];
  }
  
  if (normalized === "vegetarian") {
    return ["vegan", "vegetarian"];
  }
  
  // Custom macros (Keto, High-Protein, Non-Vegetarian) get access to all base meal types
  // Note: Future macros could add explicit 'tags' filtering if requested via URL
  return ["vegan", "vegetarian", "non-vegetarian"];
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryDiet = searchParams.get("diet");
    const queryCategory = searchParams.get("category");

    await connectToDatabase();
    
    // @ts-ignore
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });
    
    const baseDiet = queryDiet || (user && user.dietPreference) || "non-vegetarian";
    const dietFilter = getHierarchicalDietFilter(baseDiet);
    
    const query: any = { dietType: { $in: dietFilter } };
    
    if (queryCategory) {
      query.category = queryCategory;
    }

    const meals = await Meal.find(query).lean();
    
    if (!meals || meals.length === 0) {
      return NextResponse.json({ message: "No meals available for selected diet" }, { status: 404 });
    }

    const grouped: Record<string, any[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
      "pre-workout": [],
      "post-workout": [],
      fasting: []
    };

    meals.forEach((m: any) => {
      const cat = m.category || "snack";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(m);
    });

    const cleanedResponse: Record<string, any[]> = {};
    for (const [k, v] of Object.entries(grouped)) {
      if (v.length > 0) cleanedResponse[k] = v;
    }

    return NextResponse.json(cleanedResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching meals" }, { status: 500 });
  }
}
