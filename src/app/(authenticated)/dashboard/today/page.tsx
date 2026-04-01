"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BoltIcon, 
  FireIcon, 
  CheckCircleIcon,
  CalendarIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function TodayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loggedData, setLoggedData] = useState<any>({ mealsConsumed: [], totalCalories: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "" });

  // Profile guard — redirect new users who haven't completed setup
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then(({ data }) => {
          if (!data?.recommendations) {
            router.replace("/onboarding/setup");
          }
        })
        .catch(() => {}); // fail-open: don't block if API errors
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTodayData();
      fetchCalories();
    }
  }, [status]);

  const fetchCalories = async () => {
    try {
      const res = await fetch("/api/calories");
      const d = await res.json();
      setLoggedData(d);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const [mealRes, workoutRes, userRes] = await Promise.all([
        fetch("/api/meal-plan"),
        fetch("/api/workout-plan"),
        fetch("/api/profile")
      ]);

      const mealBody = await mealRes.json();
      const workoutBody = await workoutRes.json();
      const userBody = await userRes.json();

      const meals = mealBody?.data;
      const workouts = workoutBody?.data;
      const user = userBody?.data;

      const todayMeal = meals?.days?.find((d: any) => d.date === today);
      const todayWorkout = workouts?.days?.find((d: any) => d.date === today);

      setData({ todayMeal, todayWorkout, recommendations: user?.recommendations, user });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") return (
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading your plan…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
      <div className="bg-red-50 border border-red-200 px-6 py-4 rounded-2xl text-red-600">{error}</div>
    </div>
  );

  const { todayMeal, todayWorkout, recommendations } = data || {};
  const actualCalories = loggedData.totalCalories || 0;
  const targetCalories = recommendations?.recommendedCalories || 2000;
  const calorieProgress = Math.min(100, (actualCalories / targetCalories) * 100);

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMeal.name, calories: parseInt(newMeal.calories) })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewMeal({ name: "", calories: "" });
        fetchCalories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const slotIcon: Record<string, string> = {
    breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎",
    "pre-workout": "⚡", "post-workout": "💪"
  };

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            {/* Label dot — matches landing page section labels */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Daily Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">Today's Focus</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm">
              <CalendarIcon className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(193,255,0,0.35)] active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <FireIcon className="w-4 h-4" />
            Log Meal
          </button>
        </div>

        {/* ── Calorie Progress Card ────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
            <div className="space-y-3 w-full md:flex-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Calorie Intake</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#111111]">{actualCalories}</span>
                <span className="text-gray-400 text-lg">/ {targetCalories} kcal</span>
              </div>
              {/* Lime progress bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c1ff00] rounded-full transition-all duration-1000"
                  style={{ width: `${calorieProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{calorieProgress.toFixed(0)}% of daily goal</p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              {[
                { label: "Protein", value: `${todayMeal?.totalProtein || 0}g`, color: "text-[#111111]" },
                { label: "Carbs", value: `${todayMeal?.totalCarbs || 0}g`, color: "text-[#111111]" },
                { label: "Fat", value: `${todayMeal?.totalFat || 0}g`, color: "text-[#111111]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 px-4 py-4 rounded-2xl text-center">
                  <p className="text-lg font-black text-[#111111]">{value}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two Column: Nutrition + Training ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Nutrition */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-400" />
                Nutrition
              </h2>
              <Link href="/nutrition/meal-plan" className="text-sm font-semibold text-[#111111] flex items-center gap-1 hover:gap-2 transition-all">
                Full Plan <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayMeal?.meals.map((m: any, i: number) => (
                <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-[#c1ff00]/10 flex items-center justify-center text-xl flex-shrink-0">
                    {slotIcon[m.slot] || "🍽️"}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{m.slot}</p>
                    <h4 className="text-[#111111] font-bold truncate">{m.mealId?.name}</h4>
                    <p className="text-gray-400 text-xs">{m.mealId?.calories} kcal · {m.mealId?.protein}g protein</p>
                  </div>
                </div>
              ))}

              {!todayMeal && (
                <Link href="/nutrition/meal-plan" className="block bg-white border border-dashed border-gray-200 p-6 rounded-2xl text-center text-gray-400 hover:border-[#c1ff00] hover:text-[#111] transition-all">
                  No meals scheduled.{" "}
                  <span className="font-bold text-[#111111] underline">Generate your plan →</span>
                </Link>
              )}
            </div>

            {/* Logged meals */}
            {loggedData.mealsConsumed?.length > 0 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manually Logged</p>
                {loggedData.mealsConsumed.map((m: any, i: number) => (
                  <div key={i} className="bg-[#c1ff00]/5 border border-[#c1ff00]/20 p-3.5 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-[#111111] font-bold text-sm">{m.name}</p>
                      <p className="text-gray-400 text-[10px]">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className="text-[#111111] font-black text-sm bg-[#c1ff00] px-3 py-1 rounded-lg">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Training */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-[#c1ff00]" />
                Training
              </h2>
              <Link href="/training/workout" className="text-sm font-semibold text-[#111111] flex items-center gap-1 hover:gap-2 transition-all">
                Full Split <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Today's Session</p>
                  <h3 className="text-2xl font-black text-[#111111]">{todayWorkout?.focus || "Rest Day"}</h3>
                </div>
                {todayWorkout?.isCompleted && (
                  <div className="bg-[#c1ff00] rounded-full p-1.5">
                    <CheckCircleSolid className="w-6 h-6 text-black" />
                  </div>
                )}
              </div>

              {todayWorkout?.exercises?.length > 0 && (
                <div className="space-y-2">
                  {todayWorkout.exercises.slice(0, 5).map((ex: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${ex.completed ? "bg-[#c1ff00]/10 border-[#c1ff00]/30" : "bg-gray-50 border-gray-100"}`}>
                      {ex.completed 
                        ? <CheckCircleSolid className="w-5 h-5 text-[#111111] flex-shrink-0" />
                        : <CheckCircleIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      }
                      <span className={`text-sm font-medium flex-1 ${ex.completed ? 'text-gray-400 line-through' : 'text-[#111111]'}`}>
                        {ex.exerciseId?.name}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">
                        {ex.sets}×{ex.reps}
                      </span>
                    </div>
                  ))}
                  {todayWorkout.exercises.length > 5 && (
                    <p className="text-xs text-gray-400 text-center pt-1">+{todayWorkout.exercises.length - 5} more exercises</p>
                  )}
                </div>
              )}

              {!todayWorkout && (
                <Link href="/training/workout" className="block text-center text-gray-400 text-sm py-4 border border-dashed border-gray-200 rounded-xl hover:border-[#c1ff00] hover:text-[#111] transition-all">
                  No workout found. <span className="font-bold text-[#111] underline">Generate plan →</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Log Meal Modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-600" />
            </button>
            <div className="mb-6">
              <div className="w-10 h-10 bg-[#c1ff00] rounded-xl flex items-center justify-center mb-4">
                <FireIcon className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-2xl font-black text-[#111111]">Log Daily Intake</h3>
              <p className="text-gray-400 text-sm mt-1">Track what you've eaten today</p>
            </div>
            <form onSubmit={handleLogMeal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Protein Shake"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#111111] placeholder-gray-300 focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] focus:outline-none transition-all"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calories (kcal)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#111111] placeholder-gray-300 focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] focus:outline-none transition-all"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-black py-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 mt-2"
              >
                Save Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
