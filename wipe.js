require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error("❌ MONGODB_URI is missing from environment variables (.env.local)");
  process.exit(1);
}

async function totalWipe() {
  try {
    await mongoose.connect(URI);
    console.log("✅ CONNECTED to MongoDB for final wipe");

    // 1. Wipe everything
    const mResult = await mongoose.connection.collection("meals").deleteMany({});
    console.log(`🗑️ Deleted ${mResult.deletedCount} meals.`);

    const pResult = await mongoose.connection.collection("mealplans").deleteMany({});
    console.log(`🗑️ Deleted ${pResult.deletedCount} plans.`);

    const sResult = await mongoose.connection.collection("shoppinglists").deleteMany({});
    console.log(`🗑️ Deleted ${sResult.deletedCount} lists.`);

    console.log("🏁 WIPE COMPLETE. ALL PURE.");
    process.exit(0);
  } catch (e) {
    console.error("❌ FAILED:", e.message);
    process.exit(1);
  }
}

totalWipe();
