"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrinterIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function ExportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") fetchAllPlans();
  }, [status]);

  const fetchAllPlans = async () => {
    try {
      const [mealRes, workoutRes] = await Promise.all([
        fetch("/api/meal-plan"),
        fetch("/api/workout-plan")
      ]);
      const meals = await mealRes.json();
      const workouts = await workoutRes.json();
      setData({ meals, workouts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5] min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
        <p className="text-gray-400 text-sm">Loading your blueprint…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 md:p-10 print:p-0">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden border-b pb-4 sm:pb-6">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-black text-sm font-semibold cursor-pointer">
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Back to App
           </button>
           <button 
             onClick={() => window.print()}
             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-xs sm:text-sm cursor-pointer"
           >
              <PrinterIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Print or Save as PDF
           </button>
        </div>

        <div className="text-center space-y-2">
           <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">Sync-Fit Personalized Blueprint</h1>
           <p className="text-xs sm:text-sm text-slate-500">Prepared for {session?.user?.name || "Member"} • {new Date().toLocaleDateString()}</p>
        </div>

        {/* Meal Plan Table with horizontal scrolling wrapper */}
        <section className="space-y-4 sm:space-y-6">
           <h2 className="text-xl sm:text-2xl font-bold border-l-4 border-black pl-3 sm:pl-4">Weekly Nutrition Plan</h2>
           <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border border-slate-200 rounded-xl">
             <table className="min-w-[620px] w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50 text-xs sm:text-sm">
                      <th className="border-b border-r border-slate-200 p-2.5 sm:p-3 text-left">Day</th>
                      <th className="border-b border-r border-slate-200 p-2.5 sm:p-3 text-left">Fasting</th>
                      <th className="border-b border-r border-slate-200 p-2.5 sm:p-3 text-left">Breakfast</th>
                      <th className="border-b border-r border-slate-200 p-2.5 sm:p-3 text-left">Lunch</th>
                      <th className="border-b border-r border-slate-200 p-2.5 sm:p-3 text-left">Dinner</th>
                      <th className="border-b border-slate-200 p-2.5 sm:p-3 text-left">Snack</th>
                   </tr>
                </thead>
                <tbody>
                   {data?.meals?.data?.days?.map((day: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                         <td className="border-b border-r border-slate-200 p-2.5 sm:p-3 font-bold text-xs sm:text-sm bg-slate-50/50">{day.dayOfWeek}</td>
                         {["fasting", "breakfast", "lunch", "dinner", "snack"].map((slot, sIdx) => {
                            const meal = day.meals.find((m: any) => m.slot === slot);
                            return (
                               <td key={slot} className={`border-b ${sIdx < 4 ? "border-r" : ""} border-slate-200 p-2 sm:p-3 text-xs`}>
                                  <b className={slot === "fasting" ? "text-slate-400 font-medium italic" : "text-gray-800"}>
                                     {meal?.mealId?.name || (slot === "fasting" ? "Metabolic Rest" : "N/A")}
                                  </b>
                                  {meal?.mealId?.calories > 0 && (
                                     <p className="text-slate-400 mt-0.5 sm:mt-1">{meal?.mealId?.calories} kcal</p>
                                  )}
                               </td>
                            );
                         })}
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </section>

        {/* Workout Plan Split */}
        <section className="space-y-4 sm:space-y-6">
           <h2 className="text-xl sm:text-2xl font-bold border-l-4 border-black pl-3 sm:pl-4">Weekly Training Split</h2>
           <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {data?.workouts?.days?.map((day: any, i: number) => (
                 <div key={i} className="border border-slate-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <h3 className="font-black text-lg sm:text-xl">{day.dayOfWeek}</h3>
                       <span className="text-slate-500 font-bold uppercase text-xs">{day.focus}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                       {day.exercises.map((ex: any, j: number) => (
                          <div key={j} className="text-xs sm:text-sm bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                             <p className="font-bold text-gray-900">{ex.exerciseId?.name || "Exercise Entry"}</p>
                             <p className="text-slate-500 text-xs mt-0.5">{ex.sets} sets × {ex.reps} reps</p>
                          </div>
                       ))}
                       {day.exercises.length === 0 && <p className="text-slate-400 italic text-xs">Rest Day</p>}
                    </div>
                 </div>
              ))}
           </div>
        </section>

        <div className="text-center pt-10 sm:pt-20 border-t print:block hidden">
           <p className="text-xs text-slate-400">© 2026 Sync-Fit AI. This plan is dynamically generated based on user-provided metrics.</p>
        </div>
      </div>
    </div>
  );
}
