import mongoose, { Schema, Document } from "mongoose";

export interface IShoppingListItem {
  name: string;
  quantity: number;
  category: string;
  isChecked: boolean;
}

export interface IShoppingList extends Document {
  userEmail: string;
  items: IShoppingListItem[];
}

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
