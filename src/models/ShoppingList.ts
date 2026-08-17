import mongoose, { Schema } from "mongoose";
import { IShoppingList } from "@/types/meal";

const ShoppingListSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: "units" },
        category: { type: String, required: true },
        isChecked: { type: Boolean, default: false },
        alreadyHave: { type: Boolean, default: false },
        notes: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ShoppingList || mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);
