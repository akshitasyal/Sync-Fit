require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const User = require("./src/models/User").default || require("./src/models/User");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOneAndUpdate(
    { email: "FastingUser2@test.com" },
    { $set: { isFastingMode: true } },
    { new: true }
  );
  console.log("Updated user:", user.email, "isFastingMode:", user.isFastingMode);
  process.exit(0);
}
run();
