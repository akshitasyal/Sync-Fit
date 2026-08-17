"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCartIcon,
  CheckIcon,
  PrinterIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  TagIcon,
  TrashIcon,
  MinusIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { CheckIcon as CheckSolid } from "@heroicons/react/24/solid";

interface ShoppingItem {
  _id?: string;
  name: string;
  quantity: number;
  unit?: string;
  category: string;
  isChecked?: boolean;
  alreadyHave?: boolean;
  notes?: string;
}

interface MealUsage {
  mealName: string;
  dayOfWeek: string;
  slot: string;
}

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  "Proteins": { emoji: "🥩", label: "Proteins" },
  "Vegetables": { emoji: "🥦", label: "Vegetables" },
  "Fruits": { emoji: "🍎", label: "Fruits" },
  "Dairy": { emoji: "🥛", label: "Dairy" },
  "Grains & Carbs": { emoji: "🌾", label: "Grains & Carbs" },
  "Fats & Oils": { emoji: "🫒", label: "Fats & Oils" },
  "Herbs & Spices": { emoji: "🌿", label: "Herbs & Spices" },
  "Pantry & Others": { emoji: "🛒", label: "Pantry & Others" },
  "Other": { emoji: "🛒", label: "Other" }
};

const DEFAULT_CATEGORIES = [
  "All",
  "Proteins",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Grains & Carbs",
  "Pantry & Others",
  "Fats & Oils",
  "Herbs & Spices"
];

const UNIT_OPTIONS = ["units", "pieces", "packs", "blocks", "bunches", "g", "kg", "ml", "L", "tbsp", "cups"];

export default function SmartShoppingListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFasting, setIsFasting] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"category" | "name" | "quantity" | "status">("category");
  const [viewMode, setViewMode] = useState<"category" | "meal">("category");
  const [isShoppingMode, setIsShoppingMode] = useState(false);

  // Modals & Expandables
  const [detailItem, setDetailItem] = useState<ShoppingItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Add Item Form
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState("units");
  const [newItemCategory, setNewItemCategory] = useState("Proteins");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchShoppingList(), fetchMealPlanData(), fetchProfile()]);
    } catch (err) {
      console.error("Error loading shopping data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const body = await res.json();
        setIsFasting(!!body.data?.isFastingMode);
      }
    } catch (e) {}
  };

  const fetchShoppingList = async () => {
    try {
      const res = await fetch("/api/grocery-list");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setItems(data.items);
        } else if (data.ingredientMap) {
          // Fallback parsing from legacy map
          const flat: ShoppingItem[] = [];
          Object.entries(data.ingredientMap).forEach(([cat, list]: [string, any]) => {
            if (Array.isArray(list)) {
              list.forEach((nameStr: string) => {
                const match = nameStr.match(/^(.*?)\s*\(x(\d+)\)$/);
                const name = match ? match[1] : nameStr;
                const qty = match ? parseInt(match[2], 10) : 1;
                flat.push({
                  name,
                  quantity: qty,
                  unit: "units",
                  category: cat,
                  isChecked: false,
                  alreadyHave: false
                });
              });
            }
          });
          setItems(flat);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMealPlanData = async () => {
    try {
      const res = await fetch("/api/meal-plan");
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          setMealPlan(body.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Build Ingredient -> Meal Relationships dynamically
  const ingredientMealMap = useMemo(() => {
    const map: Record<string, MealUsage[]> = {};
    if (!mealPlan?.days) return map;

    mealPlan.days.forEach((day: any) => {
      day.meals?.forEach((m: any) => {
        const mealObj = typeof m.mealId === "object" ? m.mealId : null;
        if (mealObj && Array.isArray(mealObj.ingredients)) {
          mealObj.ingredients.forEach((ing: string) => {
            const cleanKey = ing.toLowerCase().trim();
            if (!map[cleanKey]) map[cleanKey] = [];
            const exists = map[cleanKey].some(
              (u) => u.mealName === mealObj.name && u.dayOfWeek === day.dayOfWeek && u.slot === m.slot
            );
            if (!exists) {
              map[cleanKey].push({
                mealName: mealObj.name,
                dayOfWeek: day.dayOfWeek,
                slot: m.slot
              });
            }
          });
        }
      });
    });

    return map;
  }, [mealPlan]);

  // Helper to find usages for any item
  const getIngredientUsages = (itemName: string): MealUsage[] => {
    const key = itemName.toLowerCase().trim();
    if (ingredientMealMap[key]) return ingredientMealMap[key];
    // Partial substring match
    for (const [k, usages] of Object.entries(ingredientMealMap)) {
      if (key.includes(k) || k.includes(key)) {
        return usages;
      }
    }
    return [];
  };

  // Sync state updates with backend
  const persistItemChange = async (updatedItems: ShoppingItem[]) => {
    setItems(updatedItems);
    try {
      await fetch("/api/grocery-list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems })
      });
    } catch (err) {
      console.error("Failed to persist shopping list:", err);
    }
  };

  // Toggle Checkbox
  const toggleItemCheck = (name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = items.map((it) =>
      it.name.toLowerCase().trim() === name.toLowerCase().trim()
        ? { ...it, isChecked: !it.isChecked, alreadyHave: it.isChecked ? it.alreadyHave : false }
        : it
    );
    persistItemChange(updated);
  };

  // Toggle "Already Have It"
  const toggleAlreadyHave = (name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = items.map((it) => {
      if (it.name.toLowerCase().trim() === name.toLowerCase().trim()) {
        const nextHave = !it.alreadyHave;
        return {
          ...it,
          alreadyHave: nextHave,
          isChecked: nextHave ? true : it.isChecked
        };
      }
      return it;
    });
    persistItemChange(updated);
    if (detailItem && detailItem.name.toLowerCase().trim() === name.toLowerCase().trim()) {
      setDetailItem((prev) => (prev ? { ...prev, alreadyHave: !prev.alreadyHave, isChecked: true } : null));
    }
  };

  // Adjust Quantity
  const adjustQuantity = (name: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = items
      .map((it) => {
        if (it.name.toLowerCase().trim() === name.toLowerCase().trim()) {
          const newQty = Math.max(1, (it.quantity || 1) + delta);
          return { ...it, quantity: newQty };
        }
        return it;
      })
      .filter((it) => it.quantity > 0);

    persistItemChange(updated);
    if (detailItem && detailItem.name.toLowerCase().trim() === name.toLowerCase().trim()) {
      setDetailItem((prev) => (prev ? { ...prev, quantity: Math.max(1, (prev.quantity || 1) + delta) } : null));
    }
  };

  // Delete Item
  const deleteItem = async (name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = items.filter((it) => it.name.toLowerCase().trim() !== name.toLowerCase().trim());
    persistItemChange(updated);
    if (detailItem && detailItem.name.toLowerCase().trim() === name.toLowerCase().trim()) {
      setDetailItem(null);
    }
  };

  // Add Item Handler
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/grocery-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName.trim(),
          quantity: newItemQty,
          unit: newItemUnit,
          category: newItemCategory,
          notes: newItemNotes.trim()
        })
      });

      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body.data)) {
          setItems(body.data);
        } else {
          setItems((prev) => [
            ...prev,
            {
              name: newItemName.trim(),
              quantity: newItemQty,
              unit: newItemUnit,
              category: newItemCategory,
              isChecked: false,
              alreadyHave: false,
              notes: newItemNotes.trim()
            }
          ]);
        }
        setIsAddModalOpen(false);
        setNewItemName("");
        setNewItemQty(1);
        setNewItemUnit("units");
        setNewItemNotes("");
      }
    } catch (err) {
      console.error("Error adding item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and Sort Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) => it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((it) => it.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "quantity") {
        return (b.quantity || 1) - (a.quantity || 1);
      }
      if (sortBy === "status") {
        const aVal = a.isChecked || a.alreadyHave ? 1 : 0;
        const bVal = b.isChecked || b.alreadyHave ? 1 : 0;
        return aVal - bVal;
      }
      // Default: Category
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    });

    return result;
  }, [items, searchQuery, selectedCategory, sortBy]);

  // Group by Category
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, { pending: ShoppingItem[]; completed: ShoppingItem[] }> = {};

    filteredItems.forEach((item) => {
      const cat = item.category || "Pantry & Others";
      if (!groups[cat]) {
        groups[cat] = { pending: [], completed: [] };
      }
      if (item.isChecked || item.alreadyHave) {
        groups[cat].completed.push(item);
      } else {
        groups[cat].pending.push(item);
      }
    });

    return groups;
  }, [filteredItems]);

  // Calculations
  const totalItemsCount = items.length;
  const purchasedCount = items.filter((it) => it.isChecked || it.alreadyHave).length;
  const activeCategoriesCount = new Set(items.map((it) => it.category)).size;
  const progressPercent = totalItemsCount > 0 ? Math.round((purchasedCount / totalItemsCount) * 100) : 0;
  const estimatedShoppingTime = Math.max(5, Math.ceil((totalItemsCount - purchasedCount) * 1.2));

  // Progress Encouraging Message
  const getProgressMessage = () => {
    if (progressPercent === 0) return "Let's get your kitchen ready!";
    if (progressPercent < 50) return "Off to a great start! Keep going.";
    if (progressPercent < 100) return "Halfway there! Almost ready.";
    return "You're all set for the week! 🎉";
  };

  // Smart Insight Tip
  const smartInsight = useMemo(() => {
    if (items.length === 0) return null;

    const alreadyHaveCount = items.filter((i) => i.alreadyHave).length;
    if (alreadyHaveCount > 0) {
      return `You have ${alreadyHaveCount} ingredient${alreadyHaveCount > 1 ? "s" : ""} marked as already in your kitchen pantry.`;
    }

    // Find highest frequency ingredient
    let topIng = "";
    let maxUsage = 0;
    for (const [ing, usages] of Object.entries(ingredientMealMap)) {
      if (usages.length > maxUsage) {
        maxUsage = usages.length;
        topIng = ing;
      }
    }

    if (topIng && maxUsage > 1) {
      const capitalized = topIng.charAt(0).toUpperCase() + topIng.slice(1);
      return `${capitalized} is used in ${maxUsage} different meals across your 7-day plan.`;
    }

    const proteinCount = items.filter((i) => i.category === "Proteins").length;
    if (proteinCount > 0) {
      return `Your meal plan requires ${proteinCount} protein source${proteinCount > 1 ? "s" : ""} for optimal muscle recovery.`;
    }

    return "All quantities are consolidated across your entire 7-day nutritional schedule.";
  }, [items, ingredientMealMap]);

  // Loading Screen
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#fcfbf9] min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-gray-200 border-t-[#3d5a45] animate-spin" />
          <p className="text-gray-500 text-xs font-semibold tracking-wide">Organizing your smart shopping list…</p>
        </div>
      </div>
    );
  }

  // ── SHOPPING MODE VIEW ───────────────────────────────────────
  if (isShoppingMode) {
    return (
      <div className="flex-grow bg-[#fcfbf9] p-3.5 sm:p-6 md:p-8 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Shopping Mode Header */}
          <div className="bg-[#2d4a36] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d2e4d6] mb-1">
                <span>🛒</span>
                <span>Active In-Store Mode</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Shopping Mode</h1>
              <p className="text-xs text-[#b8d1be] mt-0.5">
                {purchasedCount} of {totalItemsCount} items completed ({progressPercent}%)
              </p>
            </div>

            <button
              onClick={() => setIsShoppingMode(false)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/20 transition-all cursor-pointer self-end sm:self-auto"
            >
              Exit Mode ✕
            </button>
          </div>

          {/* Sticky Progress Bar */}
          <div className="sticky top-2 sm:top-4 z-20 bg-white/95 backdrop-blur-md border border-[#edebe6] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
              <span className="truncate pr-2">{getProgressMessage()}</span>
              <span className="text-[#2d4a36] flex-shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3d5a45] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Pending Items: Large Touch-Friendly Targets */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 px-1">
              To Buy ({items.filter((it) => !it.isChecked && !it.alreadyHave).length})
            </h2>

            {items
              .filter((it) => !it.isChecked && !it.alreadyHave)
              .map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleItemCheck(item.name)}
                  className="bg-white border border-[#edebe6] hover:border-[#3d5a45] p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-xl border-2 border-gray-300 flex items-center justify-center text-white transition-all bg-white">
                      {/* Empty */}
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#1a1a1a]">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        {item.quantity} {item.unit || "units"} • <span className="text-[#3d5a45]">{item.category}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleAlreadyHave(item.name, e)}
                    className="text-[11px] font-bold text-gray-400 hover:text-[#3d5a45] px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#3d5a45] bg-gray-50 transition-colors"
                  >
                    Have it
                  </button>
                </div>
              ))}

            {items.filter((it) => !it.isChecked && !it.alreadyHave).length === 0 && (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-bold text-[#1a1a1a]">All items picked!</p>
                <p className="text-xs text-gray-500 mt-0.5">Your grocery cart is completely filled for the week.</p>
              </div>
            )}
          </div>

          {/* Completed Items */}
          {purchasedCount > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 px-1">
                Completed ({purchasedCount})
              </h2>

              {items
                .filter((it) => it.isChecked || it.alreadyHave)
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleItemCheck(item.name)}
                    className="bg-gray-50/70 border border-gray-200/60 p-3.5 rounded-2xl flex items-center justify-between gap-4 transition-all opacity-75 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-6 h-6 rounded-lg bg-[#3d5a45] flex items-center justify-center text-white">
                        <CheckSolid className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-500 line-through">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {item.quantity} {item.unit || "units"}
                        </p>
                      </div>
                    </div>

                    {item.alreadyHave && (
                      <span className="bg-[#edf3ee] text-[#2d4a36] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Already Had
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN VIEW ────────────────────────────────────────────────
  return (
    <div className="flex-grow bg-[#fcfbf9] text-[#1a1a1a] p-3.5 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">

        {/* ── 1. Page Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pt-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#3d5a45]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a45]" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">NUTRITION</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                Smart Shopping List
              </h1>
              {isFasting && (
                <span className="bg-amber-50 text-amber-800 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1">
                  🌙 Vrat Fasting Mode
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Everything you need for your personalized 7-day meal plan, organized for an easier shopping trip.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-[#1a1a1a] font-bold text-xs px-3.5 py-2.5 rounded-xl border border-[#edebe6] transition-all shadow-xs cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Add Item</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 bg-white hover:bg-gray-50 text-gray-600 rounded-xl border border-[#edebe6] transition-all shadow-xs cursor-pointer"
              title="Print shopping list"
            >
              <PrinterIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsShoppingMode(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>🛒</span>
              <span>Shopping Mode</span>
            </button>
          </div>
        </div>

        {/* ── 2. Summary KPI Cards (4 Cards) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Total Items */}
          <div className="bg-white border border-[#edebe6] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-black uppercase tracking-wider">
              <span>TOTAL ITEMS</span>
              <span>📋</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-black text-[#1a1a1a]">{totalItemsCount}</p>
              <p className="text-[11px] text-gray-400 font-medium">Consolidated</p>
            </div>
          </div>

          {/* Purchased */}
          <div className="bg-white border border-[#edebe6] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-black uppercase tracking-wider">
              <span>PURCHASED</span>
              <span className="text-[#3d5a45]">✓</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-black text-[#2d4a36]">{purchasedCount}</p>
              <p className="text-[11px] text-gray-400 font-medium">{totalItemsCount - purchasedCount} remaining</p>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-[#edebe6] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-black uppercase tracking-wider">
              <span>CATEGORIES</span>
              <span>🏷️</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-black text-[#1a1a1a]">{activeCategoriesCount}</p>
              <p className="text-[11px] text-gray-400 font-medium">Aisles mapped</p>
            </div>
          </div>

          {/* Shopping Time */}
          <div className="bg-white border border-[#edebe6] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-black uppercase tracking-wider">
              <span>SHOPPING TIME</span>
              <span>⏱️</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-black text-[#1a1a1a]">~{estimatedShoppingTime} min</p>
              <p className="text-[11px] text-gray-400 font-medium">Estimated trip</p>
            </div>
          </div>
        </div>

        {/* ── 3. Smart Shopping Progress Card ── */}
        <div className="bg-white border border-[#edebe6] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#1a1a1a]">Shopping Progress</h3>
              <p className="text-xs text-gray-500 font-medium">{getProgressMessage()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500">
                <strong className="text-[#1a1a1a] font-extrabold">{purchasedCount}</strong> of {totalItemsCount} items
              </span>
              <span className="bg-[#edf3ee] text-[#2d4a36] text-xs font-black px-2.5 py-1 rounded-lg">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3d5a45] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>


        {/* ── 4. Search + Filter Toolbar ── */}
        <div className="bg-white border border-[#edebe6] rounded-2xl p-3.5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Switcher + Sort Options */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/70 text-xs">
                <button
                  onClick={() => setViewMode("category")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === "category" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setViewMode("meal")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === "meal" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  By Meal
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="hidden sm:inline font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-[#1a1a1a] font-bold focus:outline-none focus:border-[#3d5a45]"
                >
                  <option value="category">Category</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="quantity">Quantity</option>
                  <option value="status">Pending First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            {DEFAULT_CATEGORIES.map((cat) => {
              const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
              if (cat !== "All" && count === 0) return null;

              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#2d4a36] text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {(selectedCategory !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-rose-600 hover:underline px-2 flex-shrink-0"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── 5. Main Content: Shop by Category vs Shop by Meal ── */}
        {viewMode === "category" ? (
          // ── Category Cards Grid ──
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {Object.entries(groupedByCategory).map(([category, { pending, completed }]) => {
              const totalCatItems = pending.length + completed.length;
              if (totalCatItems === 0) return null;

              const meta = CATEGORY_META[category] || { emoji: "🛒", label: category };
              const isCollapsed = !!collapsedCategories[category];

              return (
                <div
                  key={category}
                  className="bg-white border border-[#edebe6] rounded-3xl p-5 shadow-sm space-y-3.5 transition-all"
                >
                  {/* Category Header */}
                  <div
                    onClick={() =>
                      setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
                    }
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{meta.emoji}</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#1a1a1a]">{category}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {completed.length} / {totalCatItems} picked
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-md">
                        {Math.round((completed.length / totalCatItems) * 100)}%
                      </span>
                      {isCollapsed ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-2 pt-1">
                      {/* Pending Items */}
                      {pending.map((item, idx) => {
                        const usages = getIngredientUsages(item.name);
                        return (
                          <div
                            key={idx}
                            onClick={() => setDetailItem(item)}
                            className="group flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 hover:border-[#3d5a45]/40 bg-gray-50/50 hover:bg-[#edf3ee]/30 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                type="button"
                                onClick={(e) => toggleItemCheck(item.name, e)}
                                className="w-5 h-5 rounded-lg border-2 border-gray-300 hover:border-[#3d5a45] flex items-center justify-center flex-shrink-0 transition-colors bg-white cursor-pointer"
                              >
                                {item.isChecked && <CheckSolid className="w-3.5 h-3.5 text-[#3d5a45]" />}
                              </button>

                              <div className="min-w-0">
                                <p className="font-bold text-xs text-[#1a1a1a] truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-500 font-medium">
                                  {item.quantity} {item.unit || "units"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {usages.length > 0 && (
                                <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                                  Used in {usages.length} meal{usages.length > 1 ? "s" : ""}
                                </span>
                              )}

                              <button
                                onClick={(e) => toggleAlreadyHave(item.name, e)}
                                className="text-[10px] font-bold text-gray-400 hover:text-[#2d4a36] px-2 py-0.5 rounded-lg border border-transparent hover:border-[#3d5a45]/30 hover:bg-white transition-all cursor-pointer"
                                title="Mark as already have in kitchen"
                              >
                                Have it
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Completed / Purchased Sub-section */}
                      {completed.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-1.5">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-1">
                            Picked ({completed.length})
                          </p>
                          {completed.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => setDetailItem(item)}
                              className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 border border-gray-100/60 transition-all opacity-70 hover:opacity-100 cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={(e) => toggleItemCheck(item.name, e)}
                                  className="w-4.5 h-4.5 rounded-md bg-[#3d5a45] text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                                >
                                  <CheckSolid className="w-3 h-3 stroke-[3]" />
                                </button>
                                <span className="text-xs font-medium text-gray-400 line-through truncate">
                                  {item.name} ({item.quantity} {item.unit || "units"})
                                </span>
                              </div>

                              {item.alreadyHave && (
                                <span className="bg-[#edf3ee] text-[#2d4a36] text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                                  Already Had
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // ── Shop by Meal View (Organized by 7 Days) ──
          <div className="space-y-4">
            {mealPlan?.days?.map((day: any, dIdx: number) => (
              <div key={dIdx} className="bg-white border border-[#edebe6] rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3d5a45]" />
                    <h3 className="font-extrabold text-sm text-[#1a1a1a] uppercase tracking-wider">
                      {day.dayOfWeek}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{day.date}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {day.meals?.map((m: any, mIdx: number) => {
                    const mealObj = typeof m.mealId === "object" ? m.mealId : null;
                    if (!mealObj) return null;

                    return (
                      <div key={mIdx} className="bg-[#fcfbf9] border border-gray-200/70 rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            {m.slot}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">{mealObj.calories} kcal</span>
                        </div>
                        <h4 className="font-bold text-xs text-[#1a1a1a] line-clamp-1">{mealObj.name}</h4>

                        {/* Ingredients List */}
                        <div className="space-y-1.5 pt-1">
                          {mealObj.ingredients?.map((ing: string, iIdx: number) => {
                            const matchingItem = items.find(
                              (it) => it.name.toLowerCase().trim() === ing.toLowerCase().trim()
                            );
                            const isChecked = matchingItem ? matchingItem.isChecked || matchingItem.alreadyHave : false;

                            return (
                              <div
                                key={iIdx}
                                onClick={() => toggleItemCheck(ing)}
                                className="flex items-center gap-2 text-xs cursor-pointer select-none"
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                                    isChecked
                                      ? "bg-[#3d5a45] border-[#3d5a45] text-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isChecked && <CheckSolid className="w-2.5 h-2.5" />}
                                </div>
                                <span
                                  className={`text-[11px] truncate ${
                                    isChecked ? "text-gray-400 line-through" : "text-gray-700 font-medium"
                                  }`}
                                >
                                  {ing}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty Search Results State ── */}
        {filteredItems.length === 0 && (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-3">
            <p className="text-3xl">🔍</p>
            <h3 className="text-base font-bold text-[#1a1a1a]">No ingredients found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No items match your current filter query. Try clearing your search or category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-[#2d4a36] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── INGREDIENT DETAIL MODAL ────────────────────────────── */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block bg-[#edf3ee] text-[#2d4a36] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md mb-1.5">
                  {detailItem.category}
                </span>
                <h3 className="text-xl font-extrabold text-[#1a1a1a]">{detailItem.name}</h3>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Quantity Adjustment Controls */}
            <div className="bg-[#fcfbf9] border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Required Quantity</p>
                <p className="text-lg font-bold text-[#1a1a1a] mt-0.5">
                  {detailItem.quantity} {detailItem.unit || "units"}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
                <button
                  onClick={() => adjustQuantity(detailItem.name, -1)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-[#1a1a1a]">{detailItem.quantity}</span>
                <button
                  onClick={() => adjustQuantity(detailItem.name, 1)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                  title="Increase"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meal Plan Usages */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Used in Meal Plan</p>
              {getIngredientUsages(detailItem.name).length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {getIngredientUsages(detailItem.name).map((usage, uIdx) => (
                    <div
                      key={uIdx}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-2 text-xs flex items-center justify-between"
                    >
                      <span className="font-bold text-gray-800">{usage.mealName}</span>
                      <span className="text-[10px] text-gray-500 font-medium capitalize">
                        {usage.dayOfWeek} • {usage.slot}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  Custom pantry item or general weekly requirement.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  toggleItemCheck(detailItem.name);
                  setDetailItem(null);
                }}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  detailItem.isChecked
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#2d4a36] text-white hover:bg-[#233a2a]"
                }`}
              >
                <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                <span>{detailItem.isChecked ? "Mark as Pending" : "Mark Purchased"}</span>
              </button>

              <button
                onClick={() => {
                  toggleAlreadyHave(detailItem.name);
                  setDetailItem(null);
                }}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  detailItem.alreadyHave
                    ? "bg-[#edf3ee] text-[#2d4a36] border-[#3d5a45]/30"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>🏠</span>
                <span>{detailItem.alreadyHave ? "In Pantry" : "Already Have It"}</span>
              </button>
            </div>

            {/* Remove item option */}
            <button
              onClick={() => deleteItem(detailItem.name)}
              className="w-full text-center text-rose-600 hover:text-rose-700 text-xs font-bold pt-1 cursor-pointer"
            >
              Remove from list
            </button>
          </div>
        </div>
      )}

      {/* ── ADD CUSTOM ITEM MODAL ─────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Add Custom Grocery Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Almond Milk, Greek Yogurt, Olive Oil"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Unit
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] font-bold focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Aisle / Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] font-bold focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                >
                  {DEFAULT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic, unsweetened"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#3d5a45]"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newItemName.trim()}
                  className="w-1/2 py-2.5 bg-[#2d4a36] hover:bg-[#233a2a] text-white font-bold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Adding…" : "Add to List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
