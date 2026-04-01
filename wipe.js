const mongoose = require("mongoose");
const URI = "mongodb+srv://akshitasyal09:akshitasyal8@cluster0.vhrwss5.mongodb.net/syncfit?retryWrites=true&w=majority";

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
