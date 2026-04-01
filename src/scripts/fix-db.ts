import * as dotenv from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const fixDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for fixing indexes...");
    
    const db = mongoose.connection.db;
    if (db) {
        try {
            await db.collection("mealplans").dropIndex("userEmail_1_date_1");
            console.log("Successfully dropped legacy userEmail_1_date_1 index.");
        } catch (e: any) {
            console.log("Index might not exist or already dropped:", e.message);
        }
    }
  } catch (error) {
    console.error("Failed to fix DB:", error);
  } finally {
    process.exit(0);
  }
};

fixDatabase();
