"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ShoppingCartIcon, 
  CheckIcon, 
  ArrowPathIcon,
  ShoppingBagIcon,
  PrinterIcon
} from "@heroicons/react/24/outline";

export default function GroceryListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") fetchList();
  }, [status]);

  const fetchList = async () => {
    try {
      const res = await fetch("/api/grocery-list");
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-slate-950">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!list || Object.values(list).every((arr: any) => arr.length === 0)) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
         <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ShoppingCartIcon className="w-12 h-12 text-slate-700" />
         </div>
         <h1 className="text-2xl font-bold text-white mb-2">No Shopping List Found</h1>
         <p className="text-slate-500 max-w-sm">Please generate a meal plan first to populate your weekly grocery requirements.</p>
         <button onClick={() => router.push("/meal-plan")} className="mt-8 px-8 py-3 bg-emerald-500 text-black font-black rounded-full hover:bg-emerald-400 transition-colors">
            Go to Meal Plan
         </button>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Weekly Shopping List</h1>
            <p className="text-slate-400">Everything you need for your active 7-day meal plan, categorized by aisle.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => window.print()} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all">
                <PrinterIcon className="w-6 h-6" />
             </button>
             <button onClick={fetchList} className="flex items-center gap-2 px-6 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all">
                <ArrowPathIcon className="w-5 h-5" /> Refresh List
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {Object.entries(list).map(([category, items]: [string, any]) => (
             items.length > 0 && (
                <div key={category} className="glass-panel-dark p-8 rounded-[40px] border border-white/5 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl">
                         <ShoppingBagIcon className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-black text-white">{category}</h3>
                   </div>
                   <div className="space-y-4">
                      {items.map((item: string, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleItem(item)}
                          className="flex items-center gap-4 group cursor-pointer"
                        >
                           <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${checkedItems[item] ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 group-hover:border-white/20'}`}>
                              {checkedItems[item] && <CheckIcon className="w-4 h-4 text-black font-black" />}
                           </div>
                           <span className={`text-sm transition-all ${checkedItems[item] ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                              {item}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
             )
           ))}
        </div>
      </div>
    </div>
  );
}
