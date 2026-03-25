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
  const [selectedMealSlot, setSelectedMealSlot] = useState<{meal: Meal, slot: string, dayDate: string} | null>(null);
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
      if(res.ok) {
        const body = await res.json();
        setFavorites(body.data?.favoriteMeals || []);
        setIsFasting(body.data?.isFastingMode || false);
      }
    } catch (e) {}
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
      if(res.ok) {
        const { favorites: newFavs } = await res.json();
        setFavorites(newFavs);
      }
    } catch (e) { console.error(e); }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const activeDay = mealPlan?.days?.[selectedDayIndex];

  return (
    <div className="flex-grow bg-slate-950 p-6 md:p-12 relative overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">Weekly Meal Plan</h1>
            <div className="flex items-center gap-3">
               <p className="text-slate-400 text-lg">7-day algorithmic distribution tailored to your exact diet type.</p>
               {isFasting && (
                 <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">Vrat / Fasting Plan Active</span>
               )}
            </div>
          </div>
          <button 
            onClick={generateMealPlan} 
            disabled={isGenerating}
            className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-200 border-t-white"></div> : <ArrowPathRoundedSquareIcon className="w-5 h-5" />}
            {mealPlan && mealPlan.days.length > 0 ? "Regenerate Full Week" : "Generate Plan"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

        {isFasting && mealPlan && mealPlan.days?.[0]?.meals?.[0]?.mealId && 
         !mealPlan.days[0].meals[0].mealId.dietType?.includes("Fasting") && (
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                   <ArrowPathRoundedSquareIcon className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                   <h4 className="text-white font-bold text-lg">Regeneration Required</h4>
                   <p className="text-slate-400 text-sm">Fasting mode is active, but your current plan contains normal meals. Please regenerate to apply Vrat rules.</p>
                </div>
             </div>
             <button 
               onClick={generateMealPlan}
               disabled={isGenerating}
               className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-xl transition-all whitespace-nowrap"
             >
                Apply Fasting Plan Now
             </button>
          </div>
        )}

        {!mealPlan || !mealPlan.days || mealPlan.days.length === 0 ? (
          <div className="glass-panel-dark p-16 text-center rounded-3xl border border-white/5">
             <p className="text-slate-400 text-lg mb-6">No active weekly meal plan found.</p>
             <p className="text-slate-500 text-sm">Click 'Generate Plan' to compile your 7-day algorithmic schedule.</p>
          </div>
        ) : (
          <>
            {/* Day Tabs */}
            <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-2 max-w-full">
               {mealPlan.days.map((day, idx) => (
                 <button
                   key={idx}
                   onClick={() => setSelectedDayIndex(idx)}
                   className={`px-6 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all border ${
                     selectedDayIndex === idx 
                       ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20" 
                       : "glass-panel-dark text-slate-400 border-white/5 hover:bg-white/5 hover:text-white"
                   }`}
                 >
                   {day.dayOfWeek} <span className="opacity-50 font-normal ml-2">{new Date(day.date).toLocaleDateString("en-US", {month:"short", day:"numeric"})}</span>
                 </button>
               ))}
            </div>

            {activeDay && (
              <div className="space-y-6 slide-in-bottom">
                
                {/* Daily Macro Header */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center col-span-2 lg:col-span-1 shadow-inner">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Cals</span>
                      <span className="text-2xl font-black text-white">{activeDay.totalCalories}</span>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Protein</span>
                      <span className="text-xl font-black text-emerald-400">{activeDay.totalProtein}g</span>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Carbs</span>
                      <span className="text-xl font-black text-amber-400">{activeDay.totalCarbs}g</span>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fat</span>
                      <span className="text-xl font-black text-rose-400">{activeDay.totalFat}g</span>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner hidden lg:flex text-center px-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-xs font-semibold text-emerald-400">Optimum Range ✓</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activeDay.meals.map((item, idx) => {
                    const meal = item.mealId;
                    const isFasting = item.slot === "fasting";
                    if (!meal && !isFasting) return null; 
                    const isFav = meal ? favorites.includes(meal._id) : false;
                    return (
                    <div 
                      key={idx} 
                      onClick={() => !isFasting && setSelectedMealSlot({meal, slot: item.slot, dayDate: activeDay.date})}
                      className={`glass-panel-dark rounded-3xl overflow-hidden border border-white/10 ${isFasting ? 'opacity-60 grayscale' : 'hover:border-emerald-500/50 cursor-pointer hover:shadow-emerald-500/10 hover:-translate-y-1'} transition-all duration-300 group flex flex-col relative shadow-xl`}
                    >
                      {meal && (
                        <button 
                          onClick={(e) => toggleFavorite(meal._id, e)}
                          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/50 backdrop-blur-md hover:bg-slate-900 border border-white/10 transition-colors"
                        >
                           {isFav ? <HeartSolid className="w-5 h-5 text-rose-500" /> : <HeartOutline className="w-5 h-5 text-white/50 hover:text-rose-400" />}
                        </button>
                      )}

                      <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent z-0"></div>
                        <span className="relative z-10 text-emerald-400/30 group-hover:text-emerald-400/60 transition-colors font-black text-4xl italic tracking-tighter uppercase">{item.slot}</span>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight pr-4">{meal?.name || "Metabolic Rest (Fasting)"}</h3>
                        {!isFasting ? (
                          <>
                            <div className="flex gap-2 flex-wrap mb-4">
                               {(meal?.dietType || []).slice(0, 2).map((dt: string, i: number) => (
                                 <span key={i} className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">{dt}</span>
                               ))}
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-emerald-400 font-bold">{meal?.calories} kcal</span>
                              <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">Details →</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-slate-500 text-xs mt-2 italic">Allowing your system to recover and optimize metabolism. Hydrate with water or coffee.</p>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedMealSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMealSlot(null)}></div>
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full z-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => setSelectedMealSlot(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
               <XMarkIcon className="w-5 h-5" />
             </button>

             <div className="mb-6 pr-12">
               <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2 block">{selectedMealSlot.slot} • {selectedMealSlot.meal.category}</span>
               <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">{selectedMealSlot.meal.name}</h2>
               <div className="flex gap-2 flex-wrap">
                  {(selectedMealSlot.meal.dietType || []).map((dt, i) => (
                    <span key={i} className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">{dt}</span>
                  ))}
               </div>
             </div>

             <div className="grid grid-cols-4 gap-3 mb-10">
                <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Cals</span>
                  <span className="block text-xl font-black text-white">{selectedMealSlot.meal.calories}</span>
                </div>
                <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Pro</span>
                  <span className="block text-xl font-black text-emerald-400">{selectedMealSlot.meal.protein}g</span>
                </div>
                <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Carbs</span>
                  <span className="block text-xl font-black text-amber-400">{selectedMealSlot.meal.carbs}g</span>
                </div>
                <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Fat</span>
                  <span className="block text-xl font-black text-rose-400">{selectedMealSlot.meal.fat}g</span>
                </div>
             </div>

             <div className="space-y-8">
               <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                     <BeakerIcon className="w-5 h-5 text-emerald-500" /> Ingredients
                  </h4>
                  <ul className="text-slate-300 space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {selectedMealSlot.meal.ingredients.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
               </div>

               <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                     <ArrowPathIcon className="w-5 h-5 text-emerald-500" /> Instructions
                  </h4>
                  <ol className="text-slate-300 space-y-5">
                    {selectedMealSlot.meal.preparationSteps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center font-bold text-xs text-emerald-400">{i+1}</span>
                        <p className="mt-1 text-sm leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
               </div>
             </div>

             <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={handleReplaceMeal}
                  disabled={isReplacing}
                  className="px-6 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 sm:w-auto w-full"
                >
                  {isReplacing ? "Calculating Macros..." : "Swap Alternative"}
                </button>
                <button 
                  onClick={() => setSelectedMealSlot(null)}
                  className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold transition-all sm:w-auto w-full"
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
