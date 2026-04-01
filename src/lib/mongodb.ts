import mongoose from "mongoose";

// ── Global connection cache ───────────────────────────────────────────────
// `global` persists across Next.js hot reloads; a module-level `let` does not.
// Scripts also benefit from this — reusing the connection if called twice.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.__mongoose_cache ?? (global.__mongoose_cache = { conn: null, promise: null });

async function connectToDatabase(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "[mongodb] ❌ MONGODB_URI is not defined.\n" +
      "  → Next.js  : add MONGODB_URI to .env.local in the project root\n" +
      "  → Scripts  : load .env.local via dotenv BEFORE importing this module\n" +
      "  → Vercel   : add MONGODB_URI to your project Environment Variables"
    );
  }

  // Return cached connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if none is already in-flight
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      family: 4,                        // Force IPv4 — prevents ECONNREFUSED on some systems
      serverSelectionTimeoutMS: 10_000, // 10 s to find a primary
      socketTimeoutMS: 45_000,          // 45 s for long operations
    };

    console.log("[mongodb] 📡 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("[mongodb] ✅ MongoDB connected successfully");
        return m;
      })
      .catch((err) => {
        console.error("[mongodb] ❌ MongoDB connection failed:", err.message);
        cached.promise = null; // Reset so the next call retries
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
