import connectToDatabase from "@/lib/mongodb";
import ShoppingList from "@/models/ShoppingList";
import { IShoppingList } from "@/types/meal";

export const shoppingService = {
  getShoppingListByEmail: async (userEmail: string): Promise<Record<string, string[]>> => {
    await connectToDatabase();
    const shoppingList = await ShoppingList.findOne({ userEmail }).lean() as IShoppingList | null;
    
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
      return ingredientMap;
    }

    shoppingList.items.forEach((item) => {
      const cat = item.category || "Pantry & Others";
      if (!ingredientMap[cat]) {
        ingredientMap[cat] = [];
      }
      
      const displayName = item.quantity > 1 ? `${item.name} (x${item.quantity})` : item.name;
      ingredientMap[cat].push(displayName);
    });

    return ingredientMap;
  },
};
