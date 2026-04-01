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

const categoryEmoji: Record<string, string> = {
  "Proteins": "🥩",
  "Grains & Carbs": "🌾",
  "Dairy": "🥛",
  "Vegetables": "🥦",
  "Fruits": "🍎",
  "Fats & Oils": "🫒",
  "Herbs & Spices": "🌿",
  "Other": "🛒",
};

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
      setLoading(true);
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

  const totalItems = list ? Object.values(list).reduce((sum: number, arr: any) => sum + arr.length, 0) as number : 0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Building your grocery list…</p>
      </div>
    </div>
  );

  if (!list || Object.values(list).every((arr: any) => arr.length === 0)) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-[#f8f7f5] p-6 text-center">
        <div className="bg-white border border-dashed border-gray-200 rounded-[30px] p-16 max-w-md space-y-6">
          <div className="w-20 h-20 bg-[#c1ff00] rounded-full flex items-center justify-center mx-auto">
            <ShoppingCartIcon className="w-10 h-10 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">No Shopping List Found</h1>
            <p className="text-gray-400 text-sm">Generate a meal plan first to populate your weekly grocery requirements.</p>
          </div>
          <button
            onClick={() => router.push("/nutrition/meal-plan")}
            className="bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5"
          >
            Go to Meal Plan →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Nutrition</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">Shopping List</h1>
            <p className="text-gray-500 text-sm mt-1">
              Everything you need for your 7-day meal plan, categorized by aisle.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#111111] hover:border-gray-300 transition-all shadow-sm"
              title="Print list"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={fetchList}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#111111] hover:border-gray-300 font-semibold transition-all shadow-sm text-sm"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Progress Bar ─────────────────────────────────── */}
        {totalItems > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-5">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-[#111111]">Shopping Progress</p>
                <p className="text-sm font-bold text-gray-400">{checkedCount} / {totalItems} items</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c1ff00] rounded-full transition-all duration-500"
                  style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
                />
              </div>
            </div>
            {checkedCount === totalItems && totalItems > 0 && (
              <div className="flex-shrink-0 w-10 h-10 bg-[#c1ff00] rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-black font-black" />
              </div>
            )}
          </div>
        )}

        {/* ── Category Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(list).map(([category, items]: [string, any]) =>
            items.length > 0 && (
              <div key={category} className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#c1ff00]/10 border border-[#c1ff00]/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {categoryEmoji[category] || "🛒"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{category}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {items.filter((i: string) => checkedItems[i]).length}/{items.length} picked
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => toggleItem(item)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        checkedItems[item]
                          ? "bg-[#c1ff00]/5 border-[#c1ff00]/20"
                          : "bg-gray-50 border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checkedItems[item]
                          ? "bg-[#c1ff00] border-[#c1ff00]"
                          : "border-gray-300 hover:border-[#c1ff00]"
                      }`}>
                        {checkedItems[item] && <CheckIcon className="w-3 h-3 text-black font-black" />}
                      </div>
                      <span className={`text-sm transition-all font-medium ${
                        checkedItems[item] ? "text-gray-400 line-through" : "text-[#111111]"
                      }`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
