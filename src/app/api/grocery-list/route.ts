import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import ShoppingList from "@/models/ShoppingList";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // @ts-ignore
    const userEmail = session.user.email;
    const shoppingList = await ShoppingList.findOne({ userEmail }).lean() as any;
    
    const ingredientMap: Record<string, string[]> = {
      "Proteins": [],
      "Vegetables": [],
      "Grains & Carbs": [],
      "Dairy": [],
      "Fats & Oils": [],
      "Fruits": [],
      "Pantry & Others": []
    };

    if (!shoppingList) {
      return NextResponse.json(ingredientMap, { status: 200 });
    }

    shoppingList.items.forEach((item: any) => {
      const cat = item.category || "Pantry & Others";
      if (!ingredientMap[cat]) {
        ingredientMap[cat] = [];
      }
      
      const displayName = item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name;
      ingredientMap[cat].push(displayName);
    });

    return NextResponse.json(ingredientMap, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

