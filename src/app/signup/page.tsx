"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/login?registered=true");
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 glass-panel-dark p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center">
          <BoltIcon className="h-12 w-12 text-emerald-400 mb-2" />
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Intelligent fitness planning awaits
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 text-center filter backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
