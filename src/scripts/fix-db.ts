// ── Load .env.local FIRST — must be before any import that reads process.env ──
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: false });
dotenv.config({ path: resolve(process.cwd(), ".env"), override: false }); // fallback

if (!process.env.MONGODB_URI) {
  console.error("[fix-db] ❌ MONGODB_URI is undefined. Check your .env.local file.");
  process.exit(1);
}

// ── Use shared connection lib (global cache, proper error handling) ──
import connectToDatabase from "../lib/mongodb";

const fixDatabase = async () => {
  try {
    const m = await connectToDatabase();
    const db = m.connection.db;

    if (db) {
      try {
        await db.collection("mealplans").dropIndex("userEmail_1_date_1");
        console.log("✅ Successfully dropped legacy userEmail_1_date_1 index.");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log("ℹ️  Index might not exist or already dropped:", msg);
      }
    } else {
      console.warn("⚠️  Could not access db — connection may not be ready.");
    }
  } catch (error) {
    console.error("❌ fix-db failed:", error);
  } finally {
    process.exit(0);
  }
};

fixDatabase();
