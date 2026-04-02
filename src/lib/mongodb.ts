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

async function connectToDatabase(retryCount = 3): Promise<typeof mongoose> {
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
      serverSelectionTimeoutMS: 30_000, // Increased to 30s to handle DNS SRV sluggishness
      connectTimeoutMS: 20_000,         // 20s for the initial connection phase
      socketTimeoutMS: 45_000,          // 45s for long operations
      waitQueueTimeoutMS: 10_000        // 10s wait for a connection from the pool
    };

    const attemptConnection = async (attempt: number): Promise<typeof mongoose> => {
      try {
        console.log(`[mongodb] 📡 Connecting to MongoDB (Attempt ${attempt}/${retryCount})...`);
        const m = await mongoose.connect(MONGODB_URI, opts);
        console.log("[mongodb] ✅ MongoDB connected successfully");
        return m;
      } catch (err: any) {
        console.error(`[mongodb] ❌ Attempt ${attempt} failed:`, err.message);

        if (attempt < retryCount) {
          const delay = 2000 * attempt; // Cumulative backoff: 2s, 4s...
          console.log(`[mongodb] ⏳ Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return attemptConnection(attempt + 1);
        }

        throw err;
      }
    };

    cached.promise = attemptConnection(1).catch((err) => {
      cached.promise = null; // Reset so the next call retries from scratch
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
