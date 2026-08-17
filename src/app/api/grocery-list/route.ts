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
      return NextResponse.json({ success: true, items: [], ingredientMap, ...ingredientMap }, { status: 200 });
    }

    const items = shoppingList.items || [];

    items.forEach((item: any) => {
      const cat = item.category || "Pantry & Others";
      if (!ingredientMap[cat]) {
        ingredientMap[cat] = [];
      }
      
      const displayName = item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name;
      ingredientMap[cat].push(displayName);
    });

    return NextResponse.json({
      success: true,
      items,
      ingredientMap,
      ...ingredientMap
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, quantity, unit, category, notes } = body;

    if (!name) {
      return NextResponse.json({ message: "Item name is required" }, { status: 400 });
    }

    await connectToDatabase();
    // @ts-ignore
    const userEmail = session.user.email;

    let shoppingList = await ShoppingList.findOne({ userEmail });
    if (!shoppingList) {
      shoppingList = new ShoppingList({
        userEmail,
        items: []
      });
    }

    const existingIndex = shoppingList.items.findIndex(
      (it: any) => it.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (existingIndex > -1) {
      shoppingList.items[existingIndex].quantity += Number(quantity) || 1;
      if (unit) shoppingList.items[existingIndex].unit = unit;
      if (category) shoppingList.items[existingIndex].category = category;
      if (notes) shoppingList.items[existingIndex].notes = notes;
    } else {
      shoppingList.items.push({
        name: name.trim(),
        quantity: Number(quantity) || 1,
        unit: unit || "units",
        category: category || "Pantry & Others",
        isChecked: false,
        alreadyHave: false,
        notes: notes || ""
      });
    }

    await shoppingList.save();

    return NextResponse.json({ success: true, data: shoppingList.items }, { status: 201 });
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
    // @ts-ignore
    const userEmail = session.user.email;

    let shoppingList = await ShoppingList.findOne({ userEmail });
    if (!shoppingList) {
      return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
    }

    // Bulk replace items
    if (Array.isArray(body.items)) {
      shoppingList.items = body.items;
      await shoppingList.save();
      return NextResponse.json({ success: true, data: shoppingList.items }, { status: 200 });
    }

    // Single item update
    const { name, isChecked, alreadyHave, quantity, unit } = body;
    if (!name) {
      return NextResponse.json({ message: "Item name is required" }, { status: 400 });
    }

    const item = shoppingList.items.find(
      (it: any) => it.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (item) {
      if (typeof isChecked === "boolean") item.isChecked = isChecked;
      if (typeof alreadyHave === "boolean") item.alreadyHave = alreadyHave;
      if (typeof quantity === "number") item.quantity = Math.max(1, quantity);
      if (unit) item.unit = unit;
      await shoppingList.save();
    }

    return NextResponse.json({ success: true, data: shoppingList.items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ message: "Item name is required" }, { status: 400 });
    }

    await connectToDatabase();
    // @ts-ignore
    const userEmail = session.user.email;

    const shoppingList = await ShoppingList.findOne({ userEmail });
    if (shoppingList) {
      shoppingList.items = shoppingList.items.filter(
        (it: any) => it.name.toLowerCase().trim() !== name.toLowerCase().trim()
      );
      await shoppingList.save();
    }

    return NextResponse.json({ success: true, data: shoppingList?.items || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
