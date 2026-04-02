"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#020617] relative overflow-hidden font-sans">
      {/* ── Background Elements ── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#c1ff00]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-[#c1ff00]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 glass-panel-dark p-10 rounded-[40px] border border-white/5 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-[#c1ff00] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(193,255,0,0.4)]"
          >
            <BoltIcon className="h-8 w-8 text-black" />
          </motion.div>
          
          <h2 className="text-center text-4xl font-black text-white tracking-tighter">
            Create Account
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400 font-medium">
            Join the elite squad of performance
          </p>
        </div>
        
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl p-4 text-center overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-4">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] sm:text-sm transition-all placeholder:text-gray-600"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-4">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] sm:text-sm transition-all placeholder:text-gray-600"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-4">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] sm:text-sm transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 text-sm font-black rounded-2xl text-black bg-[#c1ff00] hover:bg-[#a9e000] focus:outline-none transition-all shadow-[0_8px_20px_rgba(193,255,0,0.25)] disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </motion.button>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 font-medium">
              Already a member?{" "}
              <Link href="/login" className="text-[#c1ff00] font-bold hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

