"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  XMarkIcon,
  HeartIcon as HeartOutline,
  CheckCircleIcon as CheckCircleOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  CheckCircleIcon as CheckCircleSolid,
} from "@heroicons/react/24/solid";

import { useMealPlan } from "@/hooks/useMealPlan";
import { useProfile } from "@/hooks/useProfile";
import { IMeal } from "@/types/meal";
import {
  getMealImage,
  getMealPrepTime,
  getNutritionGoalDirection,
} from "@/constants/mealImages";

export default function MealPlanPage() {
  const { status } = useSession();
  const router = useRouter();

  const {
    mealPlan,
    loading: planLoading,
    isGenerating,
    error: planError,
    selectedDayIndex,
    setSelectedDayIndex,
    generateMealPlan,
    fetchMealPlan,
  } = useMealPlan();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  const [selectedMealSlot, setSelectedMealSlot] = useState<{
    meal: IMeal;
    slot: string;
    dayDate: string;
  } | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [eatenMealKeys, setEatenMealKeys] = useState<string[]>([]);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);

  // Authenticated route protection
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load favorites
  useEffect(() => {
    if (profile?.favoriteMeals) {
      setFavorites(profile.favoriteMeals);
    }
  }, [profile]);

  // Load eaten meals and water glasses state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && profile?.email) {
      const storedMeals = localStorage.getItem(`syncfit_eaten_meals_${profile.email}`);
      if (storedMeals) {
        try {
          setEatenMealKeys(JSON.parse(storedMeals));
        } catch {
          // ignore corrupted json
        }
      }
      const storedWater = localStorage.getItem(`syncfit_water_${profile.email}`);
      if (storedWater) {
        setWaterGlasses(parseInt(storedWater, 10) || 6);
      }
    }
  }, [profile?.email]);

  const toggleEatenMeal = (mealKey: string) => {
    setEatenMealKeys((prev) => {
      const updated = prev.includes(mealKey)
        ? prev.filter((k) => k !== mealKey)
        : [...prev, mealKey];
      if (profile?.email && typeof window !== "undefined") {
        localStorage.setItem(`syncfit_eaten_meals_${profile.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleWaterClick = (index: number) => {
    const newCount = index + 1 === waterGlasses ? index : index + 1;
    setWaterGlasses(newCount);
    if (profile?.email && typeof window !== "undefined") {
      localStorage.setItem(`syncfit_water_${profile.email}`, newCount.toString());
    }
  };

  const handleReplaceMeal = async () => {
    if (!selectedMealSlot || !mealPlan) return;
    try {
      setIsReplacing(true);
      const res = await fetch("/api/meal-plan/replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealPlanId: mealPlan._id,
          dayDate: selectedMealSlot.dayDate,
          oldMealId: selectedMealSlot.meal._id,
          slot: selectedMealSlot.slot,
        }),
      });
      if (!res.ok) throw new Error("Failed to replace meal");
      const { data } = await res.json();
      await fetchMealPlan();

      const updatedDay = data.days.find((d: any) => d.date === selectedMealSlot.dayDate);
      const updatedSlot = updatedDay?.meals.find(
        (m: any) => m.slot === selectedMealSlot.slot
      );
      if (updatedSlot && typeof updatedSlot.mealId !== "string") {
        setSelectedMealSlot({
          meal: updatedSlot.mealId as IMeal,
          slot: updatedSlot.slot,
          dayDate: selectedMealSlot.dayDate,
        });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsReplacing(false);
    }
  };

  const toggleFavorite = async (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId }),
      });
      if (res.ok) {
        const { favorites: newFavs } = await res.json();
        setFavorites(newFavs);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const loading = planLoading || profileLoading || status === "loading";
  const activeDay = mealPlan?.days?.[selectedDayIndex];

  // Derive dynamic user nutrition targets
  const goalDirection = useMemo(() => {
    return getNutritionGoalDirection(profile?.goal || "muscle-gain");
  }, [profile?.goal]);

  const nutritionTargets = useMemo(() => {
    const weightKg = profile?.weight || 70;
    const heightCm = profile?.height || 175;
    const age = profile?.age || 25;
    const isMale = profile?.gender?.toLowerCase() !== "female";

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (isMale ? 5 : -161);
    let tdee = Math.round(bmr * 1.45);

    const g = (profile?.goal || "muscle-gain").toLowerCase();
    if (g.includes("fat") || g.includes("loss") || g.includes("weight")) {
      tdee -= 400;
    } else if (g.includes("muscle") || g.includes("gain") || g.includes("bulk")) {
      tdee += 300;
    }

    const targetCals = Math.max(1400, Math.round(tdee));
    const targetProtein = Math.round(weightKg * goalDirection.proteinMultiplier);
    const targetFat = Math.round((targetCals * goalDirection.fatRatio) / 9);
    const targetCarbs = Math.round((targetCals - (targetProtein * 4 + targetFat * 9)) / 4);

    return {
      calories: targetCals,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
    };
  }, [profile, goalDirection]);

  // Nutritional totals for active day
  const plannedCalories = activeDay?.totalCalories || 1430;
  const plannedProtein = activeDay?.totalProtein || 74;
  const plannedCarbs = activeDay?.totalCarbs || 118;
  const plannedFat = activeDay?.totalFat || 72;

  const calPercent = Math.min(100, Math.round((plannedCalories / nutritionTargets.calories) * 100)) || 86;
  const proteinPercent = Math.min(100, Math.round((plannedProtein / nutritionTargets.protein) * 100)) || 92;
  const carbsPercent = Math.min(100, Math.round((plannedCarbs / nutritionTargets.carbs) * 100)) || 85;
  const fatPercent = Math.min(100, Math.round((plannedFat / nutritionTargets.fat) * 100)) || 80;

  // Slot display meta
  const slotMetaMap: Record<string, { label: string; icon: string }> = {
    breakfast: { label: "BREAKFAST", icon: "☀️" },
    lunch: { label: "LUNCH", icon: "☀️" },
    dinner: { label: "DINNER", icon: "🌙" },
    snack: { label: "SNACK", icon: "🍃" },
    fasting: { label: "FASTING", icon: "✨" }
  };

  const getDishSummary = (name: string, diet: string[]) => {
    const n = name.toLowerCase();
    if (n.includes("omelette")) return "Protein-rich start with healthy veggies and whole eggs.";
    if (n.includes("palak paneer")) return "Iron-rich spinach with paneer and whole wheat roti.";
    if (n.includes("tofu tikka")) return "High-protein tofu with flavorful masala and veggies.";
    if (n.includes("peanut butter") || n.includes("apple")) return "Healthy fats and natural sugars to keep you energized.";
    if (n.includes("salmon")) return "Omega-3 rich pan-seared salmon with fresh garden greens.";
    if (n.includes("quinoa")) return "Nutrient dense complex carbs and complete plant protein.";
    if (n.includes("biryani")) return "Layered basmati rice with fragrant spices and lean protein.";
    if (n.includes("poha") || n.includes("upma")) return "Light, wholesome traditional roasted breakfast.";
    if (n.includes("sabudana")) return "Fasting energy-rich tapioca pearls with roasted peanuts.";
    if (diet.includes("Vegan")) return "Plant-based nutrient dense wholesome recipe.";
    if (diet.includes("Vegetarian")) return "Vegetarian meal packed with micro & macro nutrients.";
    return "Balanced meal tailored to your daily caloric & macro requirements.";
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#fbfbf9] h-full p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <h3 className="text-base font-black text-[#111111]">Loading Your Weekly Meal Plan…</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#fbfbf9] p-3.5 sm:p-6 md:p-8 lg:p-10 overflow-y-auto min-h-screen text-[#111111]">
      <div className="max-w-[1440px] mx-auto space-y-5 sm:space-y-6">
        
        {/* ── 1. Top Header Area with Salad Illustration ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#8bb900] inline-block" />
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.16em] text-gray-500 uppercase">
                NUTRITION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111111]">
              Weekly Meal Plan
            </h1>
            <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">
              7-day algorithmic distribution tailored to your diet type.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={generateMealPlan}
              disabled={isGenerating}
              className="bg-white hover:bg-gray-50 text-[#111111] font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 transition-all hover:border-gray-300 disabled:opacity-50 cursor-pointer"
            >
              <ArrowPathRoundedSquareIcon className={`w-4 h-4 text-gray-700 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Regenerate Full Week</span>
            </button>
            
            {/* Salad Graphic Decor */}
            <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-[#edf7d2]/50 text-3xl shadow-sm border border-[#e2f0be]/60 flex-shrink-0">
              🥗
            </div>
          </div>
        </div>

        {/* ── 2. 7-Day Carousel Selector ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
            disabled={selectedDayIndex === 0}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white flex-shrink-0 transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
            {mealPlan?.days?.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              const dateObj = new Date(day.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex-1 min-w-[100px] sm:min-w-[115px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#dcf836] text-[#111111] font-black shadow-xs"
                      : "bg-white border border-gray-200/70 text-gray-700 hover:border-gray-300 hover:bg-gray-50/80 font-medium"
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{day.dayOfWeek}</p>
                  <p className={`text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? "text-black/75 font-bold" : "text-gray-400"}`}>
                    {formattedDate}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedDayIndex((prev) => Math.min((mealPlan?.days?.length || 1) - 1, prev + 1))}
            disabled={!mealPlan?.days || selectedDayIndex === mealPlan.days.length - 1}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white flex-shrink-0 transition-all shadow-xs cursor-pointer"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* ── 3. Macro KPI Row (5 Stat Cards) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {/* Total Calories */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black tracking-wider uppercase mb-1">
              <span>🔥</span>
              <span>TOTAL CALORIES</span>
            </div>
            <div className="my-1">
              <span className="text-xl font-black text-[#111111]">{plannedCalories}</span>{" "}
              <span className="text-xs font-bold text-gray-400">kcal</span>
            </div>
            <div className="space-y-1 mt-1">
              <p className="text-[11px] font-medium text-gray-400">{calPercent}% of target</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#c1ff00] rounded-full" style={{ width: `${calPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Protein */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black tracking-wider uppercase mb-1">
              <span>🍗</span>
              <span>PROTEIN</span>
            </div>
            <div className="my-1">
              <span className="text-xl font-black text-[#111111]">{plannedProtein}g</span>
            </div>
            <div className="space-y-1 mt-1">
              <p className="text-[11px] font-medium text-gray-400">{proteinPercent}% of target</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black tracking-wider uppercase mb-1">
              <span>🌾</span>
              <span>CARBS</span>
            </div>
            <div className="my-1">
              <span className="text-xl font-black text-[#111111]">{plannedCarbs}g</span>
            </div>
            <div className="space-y-1 mt-1">
              <p className="text-[11px] font-medium text-gray-400">{carbsPercent}% of target</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Fat */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black tracking-wider uppercase mb-1">
              <span>💧</span>
              <span>FAT</span>
            </div>
            <div className="my-1">
              <span className="text-xl font-black text-[#111111]">{plannedFat}g</span>
            </div>
            <div className="space-y-1 mt-1">
              <p className="text-[11px] font-medium text-gray-400">{fatPercent}% of target</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#a855f7] rounded-full" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Water Intake */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black tracking-wider uppercase mb-1">
              <span>💧</span>
              <span>WATER INTAKE</span>
            </div>
            <div className="my-1">
              <span className="text-xl font-black text-[#111111]">{waterGlasses}</span>{" "}
              <span className="text-xs font-bold text-gray-400">/ 8 glasses</span>
            </div>
            <div className="space-y-1 mt-1">
              <p className="text-[11px] font-medium text-gray-400">Keep going!</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: `${(waterGlasses / 8) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Main Section: 4 Meal Cards Grid + Right Sidebar (Aligned on same baseline level) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Column: 4 Meal Cards Row + Consistency Banner (9 cols on xl) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch flex-1">
              {activeDay?.meals?.map((item, idx) => {
                const meal = typeof item.mealId !== "string" ? (item.mealId as IMeal) : null;
                if (!meal) return null;

                const meta = slotMetaMap[item.slot] || { label: item.slot.toUpperCase(), icon: "🍽️" };
                const isFav = favorites.includes(meal._id);
                const mealKey = `${activeDay.date}-${item.slot}-${meal._id}`;
                const isEaten = eatenMealKeys.includes(mealKey);
                const mealImg = meal.imageUrl || getMealImage(meal.name, item.slot);
                const primaryDiet = Array.isArray(meal.dietType) ? meal.dietType[0] : meal.dietType || "BALANCED";

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-4 border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md ${
                      isEaten ? "border-[#c1ff00] bg-[#fafef0]" : "border-gray-200/70"
                    }`}
                  >
                    <div>
                      {/* Top Header: Slot Icon/Name & Heart Button */}
                      <div className="flex items-center justify-between mb-2 px-0.5">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <span className="text-xs">{meta.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">
                            {meta.label}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(meal._id, e)}
                          className="text-gray-300 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Favorite"
                        >
                          {isFav ? (
                            <HeartSolid className="w-4 h-4 text-rose-500" />
                          ) : (
                            <HeartOutline className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Food Photography Image */}
                      <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mealImg}
                          alt={meal.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        {isEaten && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-[#c1ff00] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                              <CheckIcon className="w-3 h-3 stroke-[3]" /> Eaten
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Meal Title */}
                      <h3 className="font-bold text-sm text-[#111111] line-clamp-1 leading-snug">
                        {meal.name}
                      </h3>

                      {/* Diet Tag */}
                      <div className="mt-1">
                        <span className="inline-block bg-[#edf7d2] text-[#425800] font-black text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
                          {primaryDiet}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5 min-h-[32px] leading-relaxed">
                        {getDishSummary(meal.name, Array.isArray(meal.dietType) ? meal.dietType : [meal.dietType])}
                      </p>

                      {/* Macro Line: Stacked as per Mockup */}
                      <div className="grid grid-cols-4 gap-0.5 sm:gap-1 text-center mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-gray-100">
                        <div>
                          <p className="text-[11px] sm:text-xs font-black text-gray-900 leading-tight">🔥 {meal.calories}</p>
                          <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">kcal</p>
                        </div>
                        <div>
                          <p className="text-[11px] sm:text-xs font-black text-gray-900 leading-tight">{meal.protein}g</p>
                          <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">Protein</p>
                        </div>
                        <div>
                          <p className="text-[11px] sm:text-xs font-black text-gray-900 leading-tight">{meal.carbs}g</p>
                          <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">Carbs</p>
                        </div>
                        <div>
                          <p className="text-[11px] sm:text-xs font-black text-gray-900 leading-tight">{meal.fat}g</p>
                          <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase">Fat</p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Action Button */}
                    <button
                      onClick={() => setSelectedMealSlot({ meal, slot: item.slot, dayDate: activeDay.date })}
                      className="mt-3 sm:mt-3.5 w-full bg-[#f4fae6] hover:bg-[#e8f5cc] text-[#3b4e00] font-bold text-xs py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      View Details <span>→</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Bottom Consistency Banner (aligned with right sidebar baseline) ── */}
            <div className="bg-[#f4fae6] border border-[#e2f2be] rounded-3xl p-4 md:py-3.5 md:px-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">🥗</span>
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">Consistency is key!</h4>
                  <p className="text-xs text-gray-600 font-medium">
                    Following your meal plan 80% of the time will get you 100% of the results.
                  </p>
                </div>
              </div>

              <Link
                href="/grocery-list"
                className="bg-[#dcf836] hover:bg-[#cbf018] text-[#111111] font-bold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <span>View Full Week Plan</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Sidebar: 3 Widgets (3 cols on xl, aligned on same baseline) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between gap-3.5">
            
            {/* Widget 1: Hydration Tracker (Compact 2 Rows of 4 Blue Cups) */}
            <div className="bg-white rounded-3xl p-4 border border-gray-200/70 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-gray-800">
                <span>💧</span>
                <span>Hydration Tracker</span>
              </div>

              {/* 2 Rows of 4 Cups */}
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {Array.from({ length: 8 }).map((_, i) => {
                  const isFilled = i < waterGlasses;
                  return (
                    <button
                      key={i}
                      onClick={() => handleWaterClick(i)}
                      className={`h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        isFilled
                          ? "bg-blue-500 border-blue-600 text-white shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-300 hover:border-blue-300"
                      }`}
                      title={`Glass ${i + 1}`}
                    >
                      <span className="text-sm">{isFilled ? "🥛" : "🥤"}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-0.5 flex items-center justify-between text-xs">
                <span className="font-black text-gray-800">{waterGlasses} of 8 glasses</span>
                <span className="text-[11px] text-gray-400 font-medium">Keep hydrating</span>
              </div>
            </div>

            {/* Widget 2: Meal Plan Insights (Compact) */}
            <div className="bg-white rounded-3xl p-4 border border-gray-200/70 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-700 tracking-wider">
                <span>⚡</span>
                <span>MEAL PLAN INSIGHTS</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-[#111111]">High in Protein</p>
                    <p className="text-[10px] text-gray-400">Great for muscle recovery</p>
                  </div>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#dcf836] text-[#334400] flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Balanced Macros</p>
                    <p className="text-[10px] text-gray-400">Well-balanced diet</p>
                  </div>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#dcf836] text-[#334400] flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Fiber Rich</p>
                    <p className="text-[10px] text-gray-400">Good for digestion</p>
                  </div>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#dcf836] text-[#334400] flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Pro Tip (Compact) */}
            <div className="bg-[#fdf9eb] border border-[#f5eccb] rounded-3xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-900 tracking-wider mb-1">
                <span>⭐</span>
                <span>PRO TIP</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed font-medium">
                Drink a glass of water 30 min before each meal to aid digestion and control portions.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ── 6. Interactive Meal Detail & Swap Modal ── */}
      {selectedMealSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Image */}
            <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-gray-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMealSlot.meal.imageUrl || getMealImage(selectedMealSlot.meal.name, selectedMealSlot.slot)}
                alt={selectedMealSlot.meal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedMealSlot(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {selectedMealSlot.slot}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#111111]">
                  {selectedMealSlot.meal.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {getDishSummary(
                    selectedMealSlot.meal.name,
                    Array.isArray(selectedMealSlot.meal.dietType) ? selectedMealSlot.meal.dietType : [selectedMealSlot.meal.dietType]
                  )}
                </p>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-gray-50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Calories</p>
                  <p className="text-xs sm:text-sm font-black text-gray-800">{selectedMealSlot.meal.calories}</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Protein</p>
                  <p className="text-xs sm:text-sm font-black text-gray-800">{selectedMealSlot.meal.protein}g</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Carbs</p>
                  <p className="text-xs sm:text-sm font-black text-gray-800">{selectedMealSlot.meal.carbs}g</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Fat</p>
                  <p className="text-xs sm:text-sm font-black text-gray-800">{selectedMealSlot.meal.fat}g</p>
                </div>
              </div>

              {/* Ingredients */}
              {selectedMealSlot.meal.ingredients && selectedMealSlot.meal.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                    Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMealSlot.meal.ingredients.map((ing, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Steps */}
              {selectedMealSlot.meal.preparationSteps && selectedMealSlot.meal.preparationSteps.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                    Preparation Steps
                  </h4>
                  <ol className="space-y-1.5 text-xs text-gray-600 list-decimal list-inside">
                    {selectedMealSlot.meal.preparationSteps.map((step, i) => (
                      <li key={i} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  const key = `${selectedMealSlot.dayDate}-${selectedMealSlot.slot}-${selectedMealSlot.meal._id}`;
                  toggleEatenMeal(key);
                }}
                className="w-full sm:flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {eatenMealKeys.includes(`${selectedMealSlot.dayDate}-${selectedMealSlot.slot}-${selectedMealSlot.meal._id}`) ? (
                  <>
                    <CheckCircleSolid className="w-4 h-4 text-[#8bb900]" />
                    <span>Marked as Eaten</span>
                  </>
                ) : (
                  <>
                    <CheckCircleOutline className="w-4 h-4 text-gray-500" />
                    <span>Mark as Eaten</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isReplacing}
                onClick={handleReplaceMeal}
                className="w-full sm:flex-1 bg-[#dcf836] hover:bg-[#cbf018] text-[#111111] font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isReplacing ? "animate-spin" : ""}`} />
                <span>{isReplacing ? "Swapping..." : "Swap / Replace Meal"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
