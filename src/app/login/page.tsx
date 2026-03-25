"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-8 glass-panel-dark p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center">
          <BoltIcon className="h-12 w-12 text-emerald-400 mb-2" />
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Log in to continue your fitness journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 text-center filter backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign up now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
