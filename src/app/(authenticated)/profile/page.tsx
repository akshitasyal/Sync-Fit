"use client";

import { useStore } from "@/store/useStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserCircleIcon, FireIcon, MoonIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const profileData = useStore();
  const { setProfileData } = profileData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: profileData.age,
          height: profileData.height,
          weight: profileData.weight,
          energyLevel: profileData.energyLevel,
          sleepQuality: profileData.sleepQuality,
          goal: profileData.goal,
          dietPreference: profileData.dietPreference,
          experienceLevel: profileData.experienceLevel
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process recommendations");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Build Your Profile</h1>
        <p className="text-slate-400">Provide your physiological data so our Fuzzy Logic Engine can calibrate your blueprint.</p>
      </div>

      <div className="w-full max-w-3xl glass-panel-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-xl">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <UserCircleIcon className="w-4 h-4 text-emerald-400" /> Age
              </label>
              <input type="number" required min="12" max="100"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.age || ""} 
                onChange={(e) => setProfileData({ age: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Goal</label>
              <select required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.goal} 
                onChange={(e) => setProfileData({ goal: e.target.value })}
              >
                <option value="weight loss">Weight Loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="muscle gain">Muscle Gain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Height (cm)</label>
              <input type="number" required min="100" max="250"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.height || ""} 
                onChange={(e) => setProfileData({ height: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
              <input type="number" required min="30" max="300"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.weight || ""} 
                onChange={(e) => setProfileData({ weight: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FireIcon className="w-4 h-4 text-amber-400" /> Daily Energy Level
              </label>
              <select required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.energyLevel} 
                onChange={(e) => setProfileData({ energyLevel: e.target.value })}
              >
                <option value="low">Low (Sedentary, quickly fatigued)</option>
                <option value="medium">Medium (Moderate activity)</option>
                <option value="high">High (Highly active, energetic)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <MoonIcon className="w-4 h-4 text-blue-400" /> Sleep Quality
              </label>
              <select required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.sleepQuality} 
                onChange={(e) => setProfileData({ sleepQuality: e.target.value })}
              >
                <option value="poor">Poor (0-5 hours, broken)</option>
                <option value="average">Average (6-7 hours)</option>
                <option value="good">Good (8+ hours, restful)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Diet Preference Requirements</label>
              <select required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.dietPreference || "Balanced Diet"} 
                onChange={(e) => setProfileData({ dietPreference: e.target.value })}
              >
                <option value="Balanced Diet">Balanced Diet (All Macros)</option>
                <option value="Vegetarian">Strictly Vegetarian</option>
                <option value="Vegan">100% Vegan</option>
                <option value="High-Protein">High-Protein (+180g pro)</option>
                <option value="Low-Carb">Low-Carb Logic (-100g carb)</option>
                <option value="Keto">Ketogenic Profile</option>
                <option value="Non-Vegetarian">Carnivorous / Non-Vegetarian</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Experience Level</label>
              <select required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                value={profileData.experienceLevel} 
                onChange={(e) => setProfileData({ experienceLevel: e.target.value })}
              >
                <option value="beginner">Beginner (New to training)</option>
                <option value="intermediate">Intermediate (1-2 years exp)</option>
                <option value="advanced">Advanced (3+ years / Athlete)</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || !profileData.age || !profileData.height || !profileData.weight}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 text-sm font-bold rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Calibrating..." : "Generate AI Blueprint"} <ArrowRightIcon className="w-5 h-5"/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
