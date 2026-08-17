"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BoltIcon,
  FireIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  SparklesIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  PlayIcon,
  TrophyIcon,
  CheckIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, CheckIcon as CheckSolid } from "@heroicons/react/24/solid";
import FastingToggle from "./FastingToggle";
import { getMealImage } from "@/constants/mealImages";
import { IMeal } from "@/types/meal";

interface ExerciseItem {
  exerciseId: {
    _id: string;
    name: string;
    targetMuscle?: string;
    equipment?: string;
  };
  sets: number;
  reps: string;
  weight?: string;
  completed?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Primary Data State
  const [data, setData] = useState<any>(null);
  const [loggedData, setLoggedData] = useState<any>({ mealsConsumed: [], totalCalories: 0 });
  const [userStats, setUserStats] = useState<any>({ streak: 3, points: 65, level: 1, badges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFasting, setIsFasting] = useState(false);

  // Date Navigation State
  const [selectedDateOffset, setSelectedDateOffset] = useState(0); // 0 = today, -1 = yesterday, etc.

  // Hydration State
  const [waterMl, setWaterMl] = useState(1250);
  const targetWaterMl = 2500;

  // Modals & Drawers
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<{ meal: IMeal; slot: string } | null>(null);
  const [replacingSlot, setReplacingSlot] = useState<{ slot: string; oldMeal: IMeal; mealPlanId: string } | null>(null);
  const [alternativeMeals, setAlternativeMeals] = useState<IMeal[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [isWorkoutModeOpen, setIsWorkoutModeOpen] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState<number | null>(null);

  // Manual Log Form State
  const [manualMeal, setManualMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" });

  // Compute Active Date String
  const activeDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    return d.toISOString().split("T")[0];
  }, [selectedDateOffset]);

  const activeDateFormatted = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }, [selectedDateOffset]);

  // Profile guard & initial fetch
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then(({ data: user }) => {
          if (!user?.recommendations) {
            router.replace("/onboarding/setup");
          } else {
            setIsFasting(!!user?.isFastingMode);
          }
        })
        .catch(() => {});
    }
  }, [status, router]);

  // Load Hydration from localStorage
  useEffect(() => {
    if (session?.user?.email) {
      const savedWater = localStorage.getItem(`syncfit_water_${session.user.email}_${activeDate}`);
      if (savedWater) setWaterMl(parseInt(savedWater, 10));
      else setWaterMl(1250);
    }
  }, [session, activeDate]);

  const updateWater = (amount: number) => {
    setWaterMl((prev) => {
      const next = Math.max(0, Math.min(5000, prev + amount));
      if (session?.user?.email) {
        localStorage.setItem(`syncfit_water_${session.user.email}_${activeDate}`, next.toString());
      }
      return next;
    });
  };

  const fetchCalories = useCallback(async () => {
    try {
      const res = await fetch("/api/calories");
      const d = await res.json();
      setLoggedData(d || { mealsConsumed: [], totalCalories: 0 });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUserStats = useCallback(async () => {
    try {
      const res = await fetch("/api/user/stats");
      const d = await res.json();
      if (d.data) setUserStats(d.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [mealRes, workoutRes, userRes] = await Promise.all([
        fetch("/api/meal-plan"),
        fetch("/api/workout-plan"),
        fetch("/api/profile"),
      ]);

      const mealBody = await mealRes.json();
      const workoutBody = await workoutRes.json();
      const userBody = await userRes.json();

      const meals = mealBody?.data;
      const workouts = workoutBody?.data;
      const user = userBody?.data;

      // Find matching day for active date or fallback to first available
      const currentMealDay = meals?.days?.find((d: any) => d.date === activeDate) || meals?.days?.[0];
      const currentWorkoutDay = workouts?.days?.find((d: any) => d.date === activeDate) || workouts?.days?.[0];

      setIsFasting(!!user?.isFastingMode);
      setData({
        mealPlan: meals,
        workoutPlan: workouts,
        todayMeal: currentMealDay,
        todayWorkout: currentWorkoutDay,
        recommendations: user?.recommendations,
        user,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeDate]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
      fetchCalories();
      fetchUserStats();
    }
  }, [status, fetchDashboardData, fetchCalories, fetchUserStats]);

  // Fasting Toggle handler
  const handleFastingToggled = useCallback(
    async (newStatus: boolean) => {
      setIsFasting(newStatus);
      setTimeout(() => {
        fetchDashboardData();
      }, 1500);
    },
    [fetchDashboardData]
  );

  // Log manual meal
  const handleLogManualMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMeal.name || !manualMeal.calories) return;

    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: manualMeal.name,
          calories: parseInt(manualMeal.calories, 10),
          protein: parseInt(manualMeal.protein, 10) || 0,
          carbs: parseInt(manualMeal.carbs, 10) || 0,
          fats: parseInt(manualMeal.fats, 10) || 0,
        }),
      });
      if (res.ok) {
        setIsLogModalOpen(false);
        setManualMeal({ name: "", calories: "", protein: "", carbs: "", fats: "" });
        fetchCalories();
        fetchUserStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Log planned meal directly
  const handleQuickLogPlannedMeal = async (meal: IMeal) => {
    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fats: meal.fat || 0,
        }),
      });
      if (res.ok) {
        fetchCalories();
        fetchUserStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Exercise completion
  const handleToggleExercise = async (exerciseId: string) => {
    if (!data?.todayWorkout) return;
    try {
      const res = await fetch("/api/workout-plan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayDate: data.todayWorkout.date,
          exerciseId,
        }),
      });
      if (res.ok) {
        fetchDashboardData();
        fetchUserStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Meal Replacement picker
  const handleOpenReplaceMeal = async (slot: string, oldMeal: IMeal) => {
    if (!data?.mealPlan?._id) return;
    setReplacingSlot({ slot, oldMeal, mealPlanId: data.mealPlan._id });
    setLoadingAlternatives(true);

    try {
      const categoryParam = slot === "snack" ? "snack" : slot;
      const res = await fetch(`/api/meals?category=${categoryParam}`);
      if (res.ok) {
        const body = await res.json();
        const list = Array.isArray(body) ? body : body[categoryParam] || [];
        const filtered = list.filter((m: IMeal) => m._id !== oldMeal._id);
        setAlternativeMeals(filtered.slice(0, 8));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  // Execute Meal Replacement
  const handleSelectReplacement = async (newMeal: IMeal) => {
    if (!replacingSlot) return;
    try {
      const res = await fetch("/api/meal-plan/replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealPlanId: replacingSlot.mealPlanId,
          dayDate: data.todayMeal?.date || activeDate,
          oldMealId: replacingSlot.oldMeal._id,
          slot: replacingSlot.slot,
        }),
      });
      if (res.ok) {
        setReplacingSlot(null);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Rest Timer in Workout Mode
  useEffect(() => {
    let interval: any = null;
    if (workoutTimer !== null && workoutTimer > 0) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutTimer]);

  // Derived Calculations
  const { todayMeal, todayWorkout, recommendations, user } = data || {};
  const actualCalories = loggedData.totalCalories || 0;
  const targetCalories = recommendations?.recommendedCalories || user?.tdee || 2000;
  const remainingCalories = Math.max(0, targetCalories - actualCalories);
  const caloriePercent = Math.min(100, Math.round((actualCalories / targetCalories) * 100));

  // Macros Calculation from Logged Meals + Planned Meals
  const loggedProtein = useMemo(
    () => loggedData.mealsConsumed?.reduce((sum: number, m: any) => sum + (m.protein || 0), 0) || 0,
    [loggedData]
  );
  const loggedCarbs = useMemo(
    () => loggedData.mealsConsumed?.reduce((sum: number, m: any) => sum + (m.carbs || 0), 0) || 0,
    [loggedData]
  );
  const loggedFat = useMemo(
    () => loggedData.mealsConsumed?.reduce((sum: number, m: any) => sum + (m.fats || 0), 0) || 0,
    [loggedData]
  );

  const targetProtein = recommendations?.proteinGrams || Math.round((targetCalories * 0.3) / 4) || 120;
  const targetCarbs = recommendations?.carbsGrams || Math.round((targetCalories * 0.45) / 4) || 180;
  const targetFat = recommendations?.fatsGrams || Math.round((targetCalories * 0.25) / 9) || 50;

  // Workout metrics
  const totalExercises = todayWorkout?.exercises?.length || 0;
  const completedExercises = todayWorkout?.exercises?.filter((e: any) => e.completed)?.length || 0;
  const isWorkoutFinished = totalExercises > 0 && completedExercises === totalExercises;

  // Today's Goals (5 Goals dynamically computed)
  const isBreakfastLogged = loggedData.mealsConsumed?.some((m: any) =>
    m.name?.toLowerCase().includes("breakfast") || m.name?.toLowerCase().includes("egg") || m.name?.toLowerCase().includes("toast")
  );
  const isLunchLogged = loggedData.mealsConsumed?.some((m: any) =>
    m.name?.toLowerCase().includes("lunch") || m.name?.toLowerCase().includes("paneer") || m.name?.toLowerCase().includes("chicken")
  );
  const isDinnerLogged = loggedData.mealsConsumed?.some((m: any) =>
    m.name?.toLowerCase().includes("dinner") || m.name?.toLowerCase().includes("tofu") || m.name?.toLowerCase().includes("soup")
  );
  const isWaterGoalMet = waterMl >= 2000;

  const goalsList = [
    { label: "Log breakfast", isDone: isBreakfastLogged || actualCalories > 300 },
    { label: "Drink water (2L+)", isDone: isWaterGoalMet },
    { label: "Complete workout session", isDone: isWorkoutFinished },
    { label: "Log lunch", isDone: isLunchLogged || actualCalories > 800 },
    { label: "Log dinner", isDone: isDinnerLogged || actualCalories > 1400 },
  ];
  const completedGoalsCount = goalsList.filter((g) => g.isDone).length;

  // Dynamic Personalized Insight
  const dashboardInsight = useMemo(() => {
    if (actualCalories === 0) {
      return "Start your day with a high-protein breakfast to fuel muscle recovery and maintain steady energy.";
    }
    if (loggedProtein < targetProtein * 0.5 && actualCalories > targetCalories * 0.5) {
      return `You're ${targetProtein - loggedProtein}g short of your protein target today. Prioritize protein in your next meal.`;
    }
    if (caloriePercent >= 65 && caloriePercent < 100) {
      return `You've completed ${caloriePercent}% of your daily calorie goal. Great pacing for your ${user?.goal || "fitness"} journey!`;
    }
    if (caloriePercent >= 100) {
      return "Daily calorie target achieved! Focus on hydration and quality sleep for optimal recovery.";
    }
    return `You have ${remainingCalories} kcal remaining today. Choose nutrient-dense whole foods.`;
  }, [actualCalories, loggedProtein, targetProtein, targetCalories, caloriePercent, remainingCalories, user]);

  const slotMetaMap: Record<string, { label: string; icon: string }> = {
    breakfast: { label: "BREAKFAST", icon: "🌅" },
    lunch: { label: "LUNCH", icon: "☀️" },
    dinner: { label: "DINNER", icon: "🌙" },
    snack: { label: "SNACK", icon: "🍎" },
    "pre-workout": { label: "PRE-WORKOUT", icon: "⚡" },
    "post-workout": { label: "POST-WORKOUT", icon: "💪" },
  };

  if (loading || status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#fcfbf9] min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-gray-200 border-t-[#2d4a36] animate-spin" />
          <p className="text-gray-500 text-xs font-semibold tracking-wide">Syncing your daily command center…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#fcfbf9] p-6">
        <div className="bg-rose-50 border border-rose-200 px-6 py-4 rounded-2xl text-rose-700 text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#fcfbf9] text-[#1a1a1a] p-3.5 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">

        {/* ── 1. Page Header with Interactive Date & Actions ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pt-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#3d5a45]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a45]" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">DAILY OVERVIEW</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
              Today's Focus
            </h1>
            
            {/* Interactive Date Navigation */}
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mt-1">
              <button
                onClick={() => setSelectedDateOffset((prev) => prev - 1)}
                className="p-1 hover:bg-gray-200/60 rounded-md transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <span className="flex items-center gap-1.5 text-gray-700 font-bold">
                <CalendarIcon className="w-3.5 h-3.5 text-[#3d5a45]" />
                {activeDateFormatted}
              </span>
              <button
                onClick={() => setSelectedDateOffset((prev) => prev + 1)}
                className="p-1 hover:bg-gray-200/60 rounded-md transition-colors cursor-pointer"
                title="Next Day"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
              {selectedDateOffset !== 0 && (
                <button
                  onClick={() => setSelectedDateOffset(0)}
                  className="text-[10px] text-[#3d5a45] underline font-bold ml-1"
                >
                  Back to Today
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {/* Inline Fasting Toggle */}
            <FastingToggle initialStatus={isFasting} onToggle={handleFastingToggled} compact />

            {/* Quick Log Meal Button */}
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* ── Fasting Mode Banner (When Enabled) ── */}
        {isFasting && (
          <div className="bg-[#fef9eb] border border-[#f7e8b6] rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <span className="text-2xl">🌙</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-amber-900">Fasting Mode Active</h3>
                  <span className="bg-amber-200/80 text-amber-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                    Eating Window: 12:00 PM – 8:00 PM
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 font-medium mt-0.5">
                  Your daily meals are aligned with fasting guidelines. Next meal recommended in 2h 15m.
                </p>
              </div>
            </div>

            <Link
              href="/meal-plan"
              className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 flex-shrink-0"
            >
              <span>View Fasting Plan</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* ── 2. Primary Daily Summary / Calorie Card ── */}
        <div className="bg-white border border-[#edebe6] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Left: Calorie Consumption Gauge */}
            <div className="space-y-3 w-full lg:w-5/12">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  TODAY'S CALORIES
                </span>
                <span className="bg-[#edf3ee] text-[#2d4a36] text-[11px] font-black px-2.5 py-0.5 rounded-lg">
                  {remainingCalories} kcal remaining
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">{actualCalories}</span>
                <span className="text-gray-400 text-base sm:text-lg font-bold">/ {targetCalories} kcal</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3d5a45] rounded-full transition-all duration-500"
                    style={{ width: `${caloriePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-gray-400">
                  <span>{caloriePercent}% of daily goal</span>
                  <span>Target: {targetCalories} kcal</span>
                </div>
              </div>
            </div>

            {/* Right: 4 Macro Metrics (Protein, Carbs, Fat, Water) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full lg:w-7/12">
              {/* Protein */}
              <div className="bg-[#fcfbf9] border border-[#edebe6] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>PROTEIN</span>
                  <span>🍗</span>
                </div>
                <div className="my-1 sm:my-1.5">
                  <span className="text-base sm:text-lg font-black text-[#1a1a1a]">{loggedProtein}g</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold"> / {targetProtein}g</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2d4a36] rounded-full"
                    style={{ width: `${Math.min(100, (loggedProtein / targetProtein) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="bg-[#fcfbf9] border border-[#edebe6] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>CARBS</span>
                  <span>🌾</span>
                </div>
                <div className="my-1 sm:my-1.5">
                  <span className="text-base sm:text-lg font-black text-[#1a1a1a]">{loggedCarbs}g</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold"> / {targetCarbs}g</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d97706] rounded-full"
                    style={{ width: `${Math.min(100, (loggedCarbs / targetCarbs) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="bg-[#fcfbf9] border border-[#edebe6] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>FAT</span>
                  <span>💧</span>
                </div>
                <div className="my-1 sm:my-1.5">
                  <span className="text-base sm:text-lg font-black text-[#1a1a1a]">{loggedFat}g</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold"> / {targetFat}g</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9333ea] rounded-full"
                    style={{ width: `${Math.min(100, (loggedFat / targetFat) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Water */}
              <div className="bg-[#fcfbf9] border border-[#edebe6] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>WATER</span>
                  <span>🥛</span>
                </div>
                <div className="my-1 sm:my-1.5">
                  <span className="text-base sm:text-lg font-black text-[#1a1a1a]">{(waterMl / 1000).toFixed(1)}L</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold"> / {(targetWaterMl / 1000).toFixed(1)}L</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563eb] rounded-full"
                    style={{ width: `${Math.min(100, (waterMl / targetWaterMl) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="text-gray-500 font-medium">Nutritional macros updated dynamically from logged entries.</span>
            <Link
              href="/meal-plan"
              className="text-[#2d4a36] hover:underline font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>View Nutrition Breakdown</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ── 3. Quick Actions Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>＋</span>
            <span>Log Meal</span>
          </button>

          <button
            onClick={() => updateWater(250)}
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>💧</span>
            <span>Log Water (+250ml)</span>
          </button>

          <button
            onClick={() => setIsWorkoutModeOpen(true)}
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>🏋</span>
            <span>Start Workout</span>
          </button>

          <Link
            href="/meal-plan"
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <span>🔄</span>
            <span>Weekly Plan</span>
          </Link>

          <Link
            href="/grocery-list"
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <span>🛒</span>
            <span>Shopping List</span>
          </Link>

          <Link
            href="/meal-plan"
            className="bg-white hover:bg-gray-50 border border-[#edebe6] text-[#1a1a1a] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
          >
            <span>📊</span>
            <span>Macro Targets</span>
          </Link>
        </div>

        {/* ── 4. Main 2-Column Command Center Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT COLUMN: Nutrition & Today's Meals (7 cols) ── */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                <span>🍽️</span>
                <span>Today's Nutrition</span>
              </h2>
              <Link
                href="/meal-plan"
                className="text-xs font-bold text-[#2d4a36] hover:underline flex items-center gap-1"
              >
                <span>Full Plan</span>
                <span>→</span>
              </Link>
            </div>

            {/* Today's Meals List */}
            <div className="space-y-3.5">
              {todayMeal?.meals?.map((item: any, idx: number) => {
                const meal = typeof item.mealId === "object" ? (item.mealId as IMeal) : null;
                if (!meal) return null;

                const meta = slotMetaMap[item.slot] || { label: item.slot.toUpperCase(), icon: "🍽️" };
                const img = meal.imageUrl || getMealImage(meal.name, item.slot);
                const isLogged = loggedData.mealsConsumed?.some(
                  (m: any) => m.name.toLowerCase().trim() === meal.name.toLowerCase().trim()
                );

                return (
                  <div
                    key={idx}
                    className="bg-white border border-[#edebe6] hover:border-[#3d5a45]/40 rounded-3xl p-4 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                      {/* Food Photo */}
                      <div
                        onClick={() => setSelectedMealForDetail({ meal, slot: item.slot })}
                        className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={meal.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>

                      {/* Meal Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs">{meta.icon}</span>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            {meta.label}
                          </span>
                        </div>
                        <h4
                          onClick={() => setSelectedMealForDetail({ meal, slot: item.slot })}
                          className="font-bold text-sm text-[#1a1a1a] truncate hover:text-[#2d4a36] cursor-pointer"
                        >
                          {meal.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {meal.calories} kcal • <span className="text-gray-700">{meal.protein}g protein</span>
                        </p>
                      </div>
                    </div>

                    {/* Meal Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <button
                        onClick={() => handleOpenReplaceMeal(item.slot, meal)}
                        className="p-2 text-gray-400 hover:text-[#2d4a36] hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                        title="Replace this meal"
                      >
                        <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleQuickLogPlannedMeal(meal)}
                        disabled={isLogged}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                          isLogged
                            ? "bg-[#edf3ee] text-[#2d4a36] cursor-default"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        {isLogged ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Logged</span>
                          </>
                        ) : (
                          <>
                            <span>+ Log Meal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {(!todayMeal || !todayMeal.meals?.length) && (
                <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center space-y-2">
                  <p className="text-2xl">🥗</p>
                  <p className="font-bold text-[#1a1a1a]">No meals scheduled for this day.</p>
                  <Link href="/meal-plan" className="text-xs text-[#2d4a36] font-bold underline inline-block">
                    Generate 7-Day Meal Plan →
                  </Link>
                </div>
              )}
            </div>

            {/* Manually Logged Meals Section */}
            {loggedData.mealsConsumed?.length > 0 && (
              <div className="bg-white border border-[#edebe6] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Manually Logged Today ({loggedData.mealsConsumed.length})
                  </h3>
                  <span className="text-xs font-bold text-[#2d4a36]">{actualCalories} kcal total</span>
                </div>

                <div className="space-y-2">
                  {loggedData.mealsConsumed.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#1a1a1a]">{m.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(m.timestamp || Date.now()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="font-extrabold text-[#2d4a36] bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        {m.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Training, Hydration, Goals & Insight (5 cols) ── */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. Today's Training Card */}
            <div className="bg-white border border-[#edebe6] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏋️</span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      TODAY'S TRAINING
                    </span>
                    <h3 className="font-extrabold text-base text-[#1a1a1a]">
                      {todayWorkout?.focus || "Full Body Session"}
                    </h3>
                  </div>
                </div>

                <Link
                  href="/training/workout"
                  className="text-xs font-bold text-[#2d4a36] hover:underline"
                >
                  Full Split →
                </Link>
              </div>

              {/* Workout Progress Badge */}
              <div className="bg-[#fcfbf9] border border-gray-200/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-700">
                    {completedExercises} / {totalExercises} exercises completed
                  </p>
                  <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2d4a36] rounded-full transition-all duration-300"
                      style={{
                        width: `${totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsWorkoutModeOpen(true)}
                  className="bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <PlayIcon className="w-3.5 h-3.5" />
                  <span>Start</span>
                </button>
              </div>

              {/* Exercises List with check toggles */}
              {todayWorkout?.exercises?.length > 0 ? (
                <div className="space-y-2">
                  {todayWorkout.exercises.slice(0, 4).map((ex: ExerciseItem, i: number) => {
                    const exId = ex.exerciseId?._id || (ex as any)._id;
                    const isDone = !!ex.completed;

                    return (
                      <div
                        key={i}
                        onClick={() => handleToggleExercise(exId)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isDone
                            ? "bg-[#edf3ee]/40 border-[#3d5a45]/30 opacity-75"
                            : "bg-gray-50/50 border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center text-white transition-colors ${
                              isDone ? "bg-[#2d4a36] border-[#2d4a36]" : "border-gray-300 bg-white"
                            }`}
                          >
                            {isDone && <CheckSolid className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-xs font-bold truncate ${
                              isDone ? "text-gray-400 line-through" : "text-[#1a1a1a]"
                            }`}
                          >
                            {ex.exerciseId?.name || "Exercise"}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg flex-shrink-0">
                          {ex.sets} × {ex.reps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-400">Rest & Recovery Day scheduled.</p>
                </div>
              )}
            </div>

            {/* 2. Hydration Tracker Card */}
            <div className="bg-white border border-[#edebe6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    HYDRATION TRACKER
                  </span>
                </div>
                <span className="text-xs font-black text-[#2563eb]">
                  {(waterMl / 1000).toFixed(1)} / {(targetWaterMl / 1000).toFixed(1)} L
                </span>
              </div>

              {/* 8 Glasses Indicator */}
              <div className="grid grid-cols-8 gap-1 sm:gap-1.5">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const filled = waterMl >= (idx + 1) * 312;
                  return (
                    <button
                      key={idx}
                      onClick={() => setWaterMl((idx + 1) * 312)}
                      className={`h-7 sm:h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        filled
                          ? "bg-blue-500 border-blue-600 text-white shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-300 hover:border-blue-300"
                      }`}
                      title={`${(idx + 1) * 312} ml`}
                    >
                      <span className="text-xs">{filled ? "🥛" : "🥤"}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Add Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateWater(250)}
                  className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
                >
                  +250 ml
                </button>
                <button
                  onClick={() => updateWater(500)}
                  className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
                >
                  +500 ml
                </button>
              </div>
            </div>

            {/* 3. Today's Goals Card */}
            <div className="bg-white border border-[#edebe6] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  TODAY'S GOALS
                </span>
                <span className="text-xs font-black text-[#2d4a36]">
                  {completedGoalsCount} / {goalsList.length} completed
                </span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3d5a45] rounded-full transition-all duration-300"
                  style={{ width: `${(completedGoalsCount / goalsList.length) * 100}%` }}
                />
              </div>

              <div className="space-y-2 pt-1">
                {goalsList.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-white ${
                        g.isDone ? "bg-[#2d4a36] border-[#2d4a36]" : "border-gray-300 bg-white"
                      }`}
                    >
                      {g.isDone && <CheckSolid className="w-3 h-3" />}
                    </div>
                    <span className={`font-medium ${g.isDone ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {g.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SyncFit Insight Card */}
            <div className="bg-[#f7f9f6] border border-[#e2ece4] rounded-2xl sm:rounded-3xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#2d4a36] tracking-wider">
                <span>⚡</span>
                <span>SYNCFIT INSIGHT</span>
              </div>
              <p className="text-xs text-[#2d4a36] font-medium leading-relaxed">
                {dashboardInsight}
              </p>
              <Link
                href="/meal-plan"
                className="text-[11px] font-bold text-[#2d4a36] hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>View Suggestions</span>
                <span>→</span>
              </Link>
            </div>

            {/* 5. Streak Component */}
            <div className="bg-white border border-[#edebe6] rounded-2xl sm:rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg flex-shrink-0">
                  🔥
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1a1a1a]">
                    {userStats?.streak || 3} DAY STREAK
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">Keep active every day</p>
                </div>
              </div>

              {/* 7-Day Dots */}
              <div className="flex gap-1 self-end sm:self-auto">
                {["M", "T", "W", "T", "F", "S", "S"].map((dayLetter, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-bold text-gray-400">{dayLetter}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx < (userStats?.streak || 3)
                          ? "bg-[#2d4a36] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {idx < (userStats?.streak || 3) ? "✓" : "○"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── MODAL 1: MANUAL LOG MEAL MODAL ────────────────────── */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Log Daily Intake</h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogManualMeal} className="space-y-3.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Meal or Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protein Shake, Paneer Bhurji"
                  value={manualMeal.name}
                  onChange={(e) => setManualMeal({ ...manualMeal, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={manualMeal.calories}
                    onChange={(e) => setManualMeal({ ...manualMeal, calories: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    value={manualMeal.protein}
                    onChange={(e) => setManualMeal({ ...manualMeal, protein: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={manualMeal.carbs}
                    onChange={(e) => setManualMeal({ ...manualMeal, carbs: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={manualMeal.fats}
                    onChange={(e) => setManualMeal({ ...manualMeal, fats: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: MEAL DETAILS MODAL ───────────────────────── */}
      {selectedMealForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-block bg-[#edf3ee] text-[#2d4a36] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md mb-1">
                  {selectedMealForDetail.slot}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#1a1a1a] truncate">
                  {selectedMealForDetail.meal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMealForDetail(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer flex-shrink-0"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Food Image */}
            <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMealForDetail.meal.imageUrl || getMealImage(selectedMealForDetail.meal.name, selectedMealForDetail.slot)}
                alt={selectedMealForDetail.meal.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Macros Breakdown */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200/70">
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900">{selectedMealForDetail.meal.calories}</p>
                <p className="text-[8px] sm:text-[9px] uppercase text-gray-400 font-bold">kcal</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900">{selectedMealForDetail.meal.protein}g</p>
                <p className="text-[8px] sm:text-[9px] uppercase text-gray-400 font-bold">Protein</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900">{selectedMealForDetail.meal.carbs}g</p>
                <p className="text-[8px] sm:text-[9px] uppercase text-gray-400 font-bold">Carbs</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900">{selectedMealForDetail.meal.fat}g</p>
                <p className="text-[8px] sm:text-[9px] uppercase text-gray-400 font-bold">Fat</p>
              </div>
            </div>

            {/* Ingredients */}
            {selectedMealForDetail.meal.ingredients && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMealForDetail.meal.ingredients.map((ing: string, i: number) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  handleQuickLogPlannedMeal(selectedMealForDetail.meal);
                  setSelectedMealForDetail(null);
                }}
                className="py-2.5 bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Mark as Eaten</span>
              </button>

              <button
                onClick={() => {
                  const s = selectedMealForDetail.slot;
                  const m = selectedMealForDetail.meal;
                  setSelectedMealForDetail(null);
                  handleOpenReplaceMeal(s, m);
                }}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                <span>Replace Meal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: REPLACE MEAL PICKER MODAL ────────────────── */}
      {replacingSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  SWAP {replacingSlot.slot}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] truncate">
                  Replace "{replacingSlot.oldMeal.name}"
                </h3>
              </div>
              <button
                onClick={() => setReplacingSlot(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer flex-shrink-0"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select an alternative dish that matches your target calories and diet preferences:
            </p>

            {loadingAlternatives ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading suitable alternatives…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {alternativeMeals.map((altMeal) => (
                  <div
                    key={altMeal._id}
                    onClick={() => handleSelectReplacement(altMeal)}
                    className="p-3 bg-gray-50 hover:bg-[#edf3ee] border border-gray-200 hover:border-[#3d5a45] rounded-2xl transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={altMeal.imageUrl || getMealImage(altMeal.name, replacingSlot.slot)}
                        alt={altMeal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[#1a1a1a] truncate">{altMeal.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                        {altMeal.calories} kcal • {altMeal.protein}g protein
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 4: INTERACTIVE WORKOUT MODE MODAL ───────────── */}
      {isWorkoutModeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Mode Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl flex-shrink-0">🏋️</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-[#2d4a36] tracking-wider block">
                    WORKOUT IN PROGRESS
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1a1a1a] truncate">
                    {todayWorkout?.focus || "Daily Workout Session"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsWorkoutModeOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer flex-shrink-0"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Current Exercise Display */}
            {todayWorkout?.exercises?.[activeExerciseIndex] ? (
              <div className="bg-[#fcfbf9] border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Exercise {activeExerciseIndex + 1} of {todayWorkout.exercises.length}
                  </span>
                  <span className="bg-[#edf3ee] text-[#2d4a36] text-[10px] font-black px-2.5 py-0.5 rounded-md">
                    Active Set
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-extrabold text-[#1a1a1a]">
                  {todayWorkout.exercises[activeExerciseIndex].exerciseId?.name || "Active Exercise"}
                </h4>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white border border-gray-200 p-2.5 sm:p-3 rounded-xl">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase">Sets</p>
                    <p className="text-lg sm:text-xl font-black text-[#1a1a1a]">
                      {todayWorkout.exercises[activeExerciseIndex].sets}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 p-2.5 sm:p-3 rounded-xl">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase">Reps</p>
                    <p className="text-lg sm:text-xl font-black text-[#1a1a1a]">
                      {todayWorkout.exercises[activeExerciseIndex].reps}
                    </p>
                  </div>
                </div>

                {/* Rest Timer Countdown */}
                {workoutTimer !== null ? (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center space-y-1">
                    <p className="text-[10px] font-bold uppercase text-amber-800">Rest Timer</p>
                    <p className="text-2xl font-black text-amber-900">{workoutTimer}s</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setWorkoutTimer(60)}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    ⏱️ Start 60s Rest Timer
                  </button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      const ex = todayWorkout.exercises[activeExerciseIndex];
                      const exId = ex.exerciseId?._id || (ex as any)._id;
                      handleToggleExercise(exId);
                      setWorkoutTimer(45);
                    }}
                    className="flex-1 py-3 bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                    <span>Complete</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeExerciseIndex < todayWorkout.exercises.length - 1) {
                        setActiveExerciseIndex((prev) => prev + 1);
                        setWorkoutTimer(null);
                      }
                    }}
                    disabled={activeExerciseIndex >= todayWorkout.exercises.length - 1}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">🎉</p>
                <h4 className="font-extrabold text-base text-[#1a1a1a]">Workout Completed!</h4>
                <p className="text-xs text-gray-500 mt-1">
                  You have logged all exercises for today's session.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
