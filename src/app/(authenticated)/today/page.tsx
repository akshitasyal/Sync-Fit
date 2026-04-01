"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") {
      fetchTodayData();
      fetchCalories();
    }
  }, [status]);

  const fetchCalories = async () => {
    try {
      const res = await fetch("/api/calories");
      const d = await res.json();
      setLoggedData(d);
    } catch (err) { console.error(err); }
  };

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [mealRes, workoutRes, userRes] = await Promise.all([
        fetch("/api/meal-plan"),
        fetch("/api/workout-plan"),
        fetch("/api/profile"),
      ]);
      const meals = await mealRes.json();
      const workouts = await workoutRes.json();
      const user = await userRes.json();
      setData({
        todayMeal: meals?.days?.find((d: any) => d.date === today),
        todayWorkout: workouts?.days?.find((d: any) => d.date === today),
        recommendations: user?.data?.recommendations,
        user: user?.data,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMeal.name, calories: parseInt(newMeal.calories) }),
      });
      if (res.ok) { setIsModalOpen(false); setNewMeal({ name: "", calories: "" }); fetchCalories(); }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading today's data…</p>
      </div>
    </div>
  );

  const { todayMeal, todayWorkout, recommendations } = data || {};
  const actualCalories = loggedData.totalCalories || 0;
  const targetCalories = recommendations?.recommendedCalories || 2000;
  const calorieProgress = Math.min(100, (actualCalories / targetCalories) * 100);

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Today's Focus
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 text-sm self-start sm:self-auto"
          >
            + Log Meal
          </button>
        </div>

        {/* Calorie Progress */}
        <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="space-y-3 flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Calorie Intake</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#111111]">{actualCalories}</span>
                <span className="text-gray-400 text-lg">/ {targetCalories} kcal</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c1ff00] rounded-full transition-all duration-1000"
                  style={{ width: `${calorieProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{Math.round(calorieProgress)}% of daily target</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-[#c1ff00]/5 border border-[#c1ff00]/20 p-4 rounded-2xl text-center">
                <span className="text-xl font-black text-[#111111]">{todayMeal?.totalProtein || 0}g</span>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">Protein</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-xl font-black text-[#111111]">{todayMeal?.totalCarbs || 0}g</span>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">Carbs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meals + Workout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Nutrition */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-[#111111] flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-400" /> Nutrition
              </h2>
              <Link href="/nutrition/meal-plan" className="text-xs font-bold text-gray-400 hover:text-[#111] flex items-center gap-1 transition-colors">
                View Plan <ChevronRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {todayMeal?.meals.map((m: any, i: number) => (
                <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#c1ff00]/10 border border-[#c1ff00]/20 flex items-center justify-center text-xs font-black text-[#111111] capitalize flex-shrink-0">
                    {m.slot[0]}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">{m.slot}</p>
                    <h4 className="text-sm font-bold text-[#111111] truncate">{m.mealId?.name}</h4>
                    <p className="text-xs text-gray-400">{m.mealId?.calories} kcal · {m.mealId?.protein}g protein</p>
                  </div>
                </div>
              ))}
              {!todayMeal && (
                <Link href="/nutrition/meal-plan" className="block p-6 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-sm text-gray-400 hover:border-[#c1ff00] hover:text-[#111] transition-all">
                  No meals scheduled — Generate your plan →
                </Link>
              )}
            </div>

            {/* Logged meals */}
            {loggedData.mealsConsumed?.length > 0 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recently Logged</p>
                {loggedData.mealsConsumed.map((m: any, i: number) => (
                  <div key={i} className="bg-[#c1ff00]/5 border border-[#c1ff00]/15 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{m.name}</p>
                      <p className="text-[10px] text-gray-400">{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className="text-sm font-black text-[#111111]">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Training */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-[#111111] flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-[#c1ff00]" /> Training
              </h2>
              <Link href="/training/workout" className="text-xs font-bold text-gray-400 hover:text-[#111] flex items-center gap-1 transition-colors">
                View Split <ChevronRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Today's Focus</p>
                  <h3 className="text-2xl font-black text-[#111111]">{todayWorkout?.focus || "Rest Day"}</h3>
                </div>
                {todayWorkout?.isCompleted && <CheckCircleSolid className="w-8 h-8 text-[#c1ff00]" />}
              </div>

              {todayWorkout?.exercises?.length > 0 && (
                <div className="space-y-2">
                  {todayWorkout.exercises.map((ex: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${ex.completed ? "bg-[#c1ff00]/5 border-[#c1ff00]/20" : "bg-gray-50 border-gray-100"}`}>
                      {ex.completed
                        ? <CheckCircleSolid className="w-4 h-4 text-[#111111] flex-shrink-0" />
                        : <CheckCircleIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                      <span className={`text-sm font-medium flex-grow ${ex.completed ? "text-gray-400 line-through" : "text-[#111111]"}`}>
                        {ex.exerciseId?.name}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded-lg uppercase">
                        {ex.sets}×{ex.reps}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!todayWorkout && (
                <p className="text-sm text-gray-400 italic">No training logged for today — enjoy your rest.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[30px] p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black text-[#111111]">Log Daily Intake</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogMeal} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meal Name</label>
                <input
                  type="text" required placeholder="e.g. Protein Shake"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#111111] placeholder-gray-300 focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] focus:outline-none transition-all text-sm"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calories (kcal)</label>
                <input
                  type="number" required placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#111111] placeholder-gray-300 focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] focus:outline-none transition-all text-sm"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)]"
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
