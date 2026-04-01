"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeakerIcon, ArrowPathIcon, XMarkIcon, ArrowPathRoundedSquareIcon, HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface Meal {
  _id: string;
  name: string;
  type: string;
  category: string;
  dietType: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  preparationSteps: string[];
}

interface MealPlanData {
  _id: string;
  weekStartDate: string;
  days: {
    date: string;
    dayOfWeek: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    meals: {
      mealId: Meal;
      slot: string;
    }[];
  }[];
}

export default function MealPlan() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isFasting, setIsFasting] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<{ meal: Meal, slot: string, dayDate: string } | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") {
      fetchMealPlan();
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const body = await res.json();
        setFavorites(body.data?.favoriteMeals || []);
        setIsFasting(body.data?.isFastingMode || false);
      }
    } catch (e) { }
  };

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/meal-plan");
      if (!res.ok) throw new Error("Failed to fetch plan");
      const { data } = await res.json();
      setMealPlan(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/meal-plan/generate", { method: "POST" });
      if (!res.ok) throw new Error("Generation failed");
      await fetchMealPlan();
      setSelectedDayIndex(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
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
          slot: selectedMealSlot.slot
        })
      });
      if (!res.ok) throw new Error("Failed to replace");
      const { data } = await res.json();
      setMealPlan(data);

      const updatedDay = data.days.find((d: any) => d.date === selectedMealSlot.dayDate);
      const updatedSlot = updatedDay?.meals.find((m: any) => m.slot === selectedMealSlot.slot);
      if (updatedSlot) {
        setSelectedMealSlot({ meal: updatedSlot.mealId, slot: updatedSlot.slot, dayDate: selectedMealSlot.dayDate });
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
        body: JSON.stringify({ mealId })
      });
      if (res.ok) {
        const { favorites: newFavs } = await res.json();
        setFavorites(newFavs);
      }
    } catch (e) { console.error(e); }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5] h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Building your meal plan…</p>
        </div>
      </div>
    );
  }

  const activeDay = mealPlan?.days?.[selectedDayIndex];

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Nutrition</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">Weekly Meal Plan</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-500 text-sm">7-day algorithmic distribution tailored to your diet type.</p>
              {isFasting && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-amber-200 animate-pulse">Fasting Plan Active</span>
              )}
            </div>
          </div>
          <button
            onClick={generateMealPlan}
            disabled={isGenerating}
            className="bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#a9e000] border-t-black"></div> : <ArrowPathRoundedSquareIcon className="w-5 h-5" />}
            {mealPlan && mealPlan.days.length > 0 ? "Regenerate Full Week" : "Generate Plan"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

        {isFasting && mealPlan && mealPlan.days?.[0]?.meals?.[0]?.mealId && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <ArrowPathRoundedSquareIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-amber-900 font-bold">Fasting Mode Active</h4>
                  <p className="text-amber-700 text-sm">Your plan may contain non-fasting meals. Regenerate to apply Vrat rules.</p>
                </div>
              </div>
              <button
                onClick={generateMealPlan}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all whitespace-nowrap text-sm"
              >
                Apply Fasting Plan
              </button>
            </div>
          )}

        {!mealPlan || !mealPlan.days || mealPlan.days.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 p-16 text-center rounded-[30px]">
            <p className="text-[#111111] text-lg font-bold mb-2">No active weekly meal plan found.</p>
            <p className="text-gray-400 text-sm">Click &apos;Generate Plan&apos; to compile your 7-day algorithmic schedule.</p>
          </div>
        ) : (
          <>
            {/* Day Tabs */}
            <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 max-w-full">
              {mealPlan.days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm transition-all border ${
                    selectedDayIndex === idx
                      ? "bg-[#c1ff00] text-[#111111] border-[#c1ff00] shadow-[0_4px_14px_rgba(193,255,0,0.3)]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-[#111111]"
                  }`}
                >
                  {day.dayOfWeek}
                  <span className="ml-2 font-normal opacity-60">{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </button>
              ))}
            </div>

            {activeDay && (
              <div className="space-y-6 slide-in-bottom">

                {/* Daily Macro Header */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { label: "Total Cals", value: activeDay.totalCalories, unit: "", span: "col-span-2 lg:col-span-1" },
                    { label: "Protein", value: activeDay.totalProtein, unit: "g", span: "" },
                    { label: "Carbs", value: activeDay.totalCarbs, unit: "g", span: "" },
                    { label: "Fat", value: activeDay.totalFat, unit: "g", span: "" },
                    { label: "Status", value: "✓", unit: "", span: "hidden lg:flex" },
                  ].map(({ label, value, unit, span }) => (
                    <div key={label} className={`bg-white border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm ${span}`}>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
                      <span className="text-xl font-black text-[#111111]">{value}{unit}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {activeDay.meals.map((item, idx) => {
                    const meal = item.mealId;
                    const isRestSlot = item.slot === "fasting";
                    if (!meal && !isRestSlot) return null;
                    const isFav = meal ? favorites.includes(meal._id) : false;
                    return (
                      <div
                        key={idx}
                        onClick={() => !isRestSlot && setSelectedMealSlot({ meal, slot: item.slot, dayDate: activeDay.date })}
                        className={`bg-white border border-gray-100 rounded-[30px] overflow-hidden shadow-sm flex flex-col relative group ${
                          isRestSlot ? 'opacity-60' : 'cursor-pointer hover:shadow-xl hover:-translate-y-1'
                        } transition-all duration-300`}
                      >
                        {meal && (
                          <button
                            onClick={(e) => toggleFavorite(meal._id, e)}
                            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                          >
                            {isFav ? <HeartSolid className="w-4 h-4 text-rose-500" /> : <HeartOutline className="w-4 h-4 text-gray-300 hover:text-rose-400" />}
                          </button>
                        )}

                        <div className="h-24 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                          <div className="absolute inset-0 bg-[#c1ff00]/5" />
                          <span className="text-[#c1ff00]/40 group-hover:text-[#c1ff00]/70 transition-colors font-black text-3xl italic tracking-tighter uppercase">{item.slot}</span>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-base font-bold text-[#111111] mb-2 line-clamp-2 leading-tight pr-4">{meal?.name || "Fasting Rest"}</h3>
                          {!isRestSlot ? (
                            <>
                              <div className="flex gap-1.5 flex-wrap mb-3">
                                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#c1ff00]/10 text-[#111111] px-2.5 py-1 rounded-full border border-[#c1ff00]/30">{meal?.dietType}</span>
                              </div>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="text-[#111111] font-black text-sm">{meal?.calories} kcal</span>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-[#c1ff00] group-hover:text-[#111111] group-hover:border-[#c1ff00] transition-colors">Details →</span>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-400 text-xs mt-2 italic">Allowing your system to recover. Hydrate with water or herbal tea.</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedMealSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedMealSlot(null)} />
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full z-10 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100">
            <button onClick={() => setSelectedMealSlot(null)} className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
              <XMarkIcon className="w-4 h-4 text-gray-600" />
            </button>

            <div className="mb-6 pr-12">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{selectedMealSlot.slot} · {selectedMealSlot.meal.category}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-tight mb-3">{selectedMealSlot.meal.name}</h2>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#c1ff00]/10 text-[#111111] px-3 py-1 rounded-full border border-[#c1ff00]/30">{selectedMealSlot.meal.dietType}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { label: "Cals", value: selectedMealSlot.meal.calories },
                { label: "Protein", value: `${selectedMealSlot.meal.protein}g` },
                { label: "Carbs", value: `${selectedMealSlot.meal.carbs}g` },
                { label: "Fat", value: `${selectedMealSlot.meal.fat}g` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{label}</span>
                  <span className="text-xl font-black text-[#111111]">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {selectedMealSlot.meal.ingredients?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <BeakerIcon className="w-4 h-4" /> Ingredients
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMealSlot.meal.ingredients.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c1ff00] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMealSlot.meal.preparationSteps?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4" /> Instructions
                  </h4>
                  <ol className="space-y-4">
                    {selectedMealSlot.meal.preparationSteps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#c1ff00] flex items-center justify-center font-black text-xs text-black">{i + 1}</span>
                        <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleReplaceMeal}
                disabled={isReplacing}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-[#111] hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isReplacing ? "Finding alternative…" : "Swap Alternative"}
              </button>
              <button
                onClick={() => setSelectedMealSlot(null)}
                className="px-8 py-3 rounded-xl bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold transition-all shadow-[0_4px_14px_rgba(193,255,0,0.3)] text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
