import mongoose, { Schema } from "mongoose";
import { IShoppingList } from "@/types/meal";

const ShoppingListSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        category: { type: String, required: true },
        isChecked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ShoppingList || mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);
