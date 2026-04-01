"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrinterIcon, ArrowDownTrayIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

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
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
        <p className="text-gray-400 text-sm">Loading your blueprint…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-10 print:p-0">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-between items-center print:hidden border-b pb-6">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-black">
              <ChevronLeftIcon className="w-5 h-5" /> Back to App
           </button>
           <button 
             onClick={() => window.print()}
             className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
           >
              <PrinterIcon className="w-5 h-5" /> Print or Save as PDF
           </button>
        </div>

        <div className="text-center space-y-2">
           <h1 className="text-4xl font-black uppercase tracking-tighter">Sync-Fit Personalized Blueprint</h1>
           <p className="text-slate-500">Prepared for {session?.user?.name} • {new Date().toLocaleDateString()}</p>
        </div>

        {/* Meal Plan Table */}
        <section className="space-y-6">
           <h2 className="text-2xl font-bold border-l-4 border-black pl-4">Weekly Nutrition Plan</h2>
           <table className="w-full border-collapse border border-slate-200">
              <thead>
                 <tr className="bg-slate-50">
                    <th className="border border-slate-200 p-3 text-left">Day</th>
                    <th className="border border-slate-200 p-3 text-left">Fasting</th>
                    <th className="border border-slate-200 p-3 text-left">Breakfast</th>
                    <th className="border border-slate-200 p-3 text-left">Lunch</th>
                    <th className="border border-slate-200 p-3 text-left">Dinner</th>
                    <th className="border border-slate-200 p-3 text-left">Snack</th>
                 </tr>
              </thead>
              <tbody>
                 {data?.meals?.data?.days?.map((day: any, i: number) => (
                    <tr key={i}>
                       <td className="border border-slate-200 p-3 font-bold bg-slate-50/50">{day.dayOfWeek}</td>
                       {["fasting", "breakfast", "lunch", "dinner", "snack"].map(slot => {
                          const meal = day.meals.find((m: any) => m.slot === slot);
                          return (
                             <td key={slot} className="border border-slate-200 p-3 text-xs">
                                <b className={slot === "fasting" ? "text-slate-400 font-medium italic" : ""}>
                                   {meal?.mealId?.name || (slot === "fasting" ? "Metabolic Rest" : "N/A")}
                                </b>
                                {meal?.mealId?.calories > 0 && (
                                   <p className="text-slate-400 mt-1">{meal?.mealId?.calories} kcal</p>
                                )}
                             </td>
                          );
                       })}
                    </tr>
                 ))}
              </tbody>
           </table>
        </section>

        {/* Workout Plan Table */}
        <section className="space-y-6">
           <h2 className="text-2xl font-bold border-l-4 border-black pl-4">Weekly Training Split</h2>
           <div className="grid grid-cols-1 gap-6">
              {data?.workouts?.days?.map((day: any, i: number) => (
                 <div key={i} className="border border-slate-200 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <h3 className="font-black text-xl">{day.dayOfWeek}</h3>
                       <span className="text-slate-500 font-bold uppercase text-xs">{day.focus}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {day.exercises.map((ex: any, j: number) => (
                          <div key={j} className="text-sm">
                             <p className="font-bold">{ex.exerciseId?.name || "Exercise Entry"}</p>
                             <p className="text-slate-500 text-xs">{ex.sets} sets x {ex.reps} reps</p>
                          </div>
                       ))}
                       {day.exercises.length === 0 && <p className="text-slate-400 italic">Rest Day</p>}
                    </div>
                 </div>
              ))}
           </div>
        </section>

        <div className="text-center pt-20 border-t print:block hidden">
           <p className="text-xs text-slate-400">© 2026 Sync-Fit AI. This plan is dynamically generated based on user-provided metrics.</p>
        </div>
      </div>
    </div>
  );
}
