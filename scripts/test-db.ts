import dn from "dotenv";
import path from "path";
import mongoose from "mongoose";

// 1. Load context from .env.local
dn.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log("🚀 Starting MongoDB Connection Test...");
  console.log(`📍 URI: ${MONGODB_URI ? "FOUND (Masked)" : "NOT FOUND"}`);

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing from .env.local");
    process.exit(1);
  }

  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    family: 4,
    serverSelectionTimeoutMS: 30_000,
    connectTimeoutMS: 20_000,
    socketTimeoutMS: 45_000,
  };

  try {
    console.log("📡 Attempting to connect to Atlas SRV...");
    const start = Date.now();
    await mongoose.connect(MONGODB_URI, opts);
    const end = Date.now();

    console.log(`✅ Success! Connected in ${end - start}ms`);
    console.log("📁 Database name:", mongoose.connection.name);

    await mongoose.disconnect();
    console.log("👋 Disconnected correctly.");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Connection failed!");
    console.error("Error Code:", err.code);
    console.error("Syscall:", err.syscall);
    console.error("Message:", err.message);

    if (err.code === 'ETIMEOUT') {
      console.log("\n💡 TIP: querySrv ETIMEOUT usually means your DNS is struggling to resolve Atlas SRV records.");
      console.log("👉 Try switching your DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).");
    }

    process.exit(1);
  }
}

testConnection();
