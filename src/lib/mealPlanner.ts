import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Meal from "@/models/Meal";
import MealPlan from "@/models/MealPlan";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getNext7Days = () => {
  const days = [];
  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
    });
  }
  return days;
};

/** Normalize whatever the user stored as dietPreference → internal enum */
const normalizeDiet = (raw: string): "vegan" | "vegetarian" | "all" => {
  const v = raw.toLowerCase().trim();
  if (v === "vegan") return "vegan";
  if (v === "vegetarian" || v === "vegetarian diet") return "vegetarian";
  return "all"; // Non-Vegetarian, Balanced Diet, Keto, High-Protein, Low-Carb, etc.
};

/** Build the dietType $in array for a given diet tier — NEVER crosses diet boundary */
const dietTypeFilter = (tier: "vegan" | "vegetarian" | "all"): string[] => {
  if (tier === "vegan") return ["vegan"];
  if (tier === "vegetarian") return ["vegan", "vegetarian"];
  return ["vegan", "vegetarian", "non-vegetarian"];
};

// ─── Progressive meal fetch — relaxes tags/preferences, NEVER diet ──────────
async function fetchMealPool(
  dietFilter: string[],
  dislikedIds: string[],
  isFasting: boolean,
  goalTag: string | null
): Promise<{ pool: any[]; filterUsed: string }> {

  const base: any = {
    dietType: { $in: dietFilter },
  };

  if (isFasting) {
    base.tags = { $in: ["Fasting"] };
  }

  // Step 0 — ideal: diet + goal tag + no disliked (skip for fasting)
  if (!isFasting && goalTag) {
    const step0 = await Meal.find({
      ...base,
      _id: { $nin: dislikedIds },
      tags: { $in: [goalTag] },
    }).lean() as any[];
    console.log(`[MealPlanner] Step 0 (diet+goal=${goalTag}): ${step0.length} meals`);
    if (step0.length >= 4) return { pool: step0, filterUsed: `diet+goal(${goalTag})` };
  }

  // Step 1 — strict: diet + disliked exclusion + fasting tag
  let pool = await Meal.find({
    ...base,
    _id: { $nin: dislikedIds },
  }).lean() as any[];
  console.log(`[MealPlanner] Step 1 (strict diet): ${pool.length} meals. dietTypes: ${dietFilter}`);
  if (pool.length >= 4) return { pool, filterUsed: "strict" };

  // Step 2 — relax disliked list (keep diet + fasting constraint)
  pool = await Meal.find({
    ...base,
  }).lean() as any[];
  console.log(`[MealPlanner] Step 2 (relax disliked): ${pool.length} meals.`);
  if (pool.length >= 4) return { pool, filterUsed: "relaxed-disliked" };

  // Step 3 — broadest: just diet type, no other constraints
  pool = await Meal.find({ dietType: { $in: dietFilter } }).lean() as any[];
  console.log(`[MealPlanner] Step 3 (diet-only): ${pool.length} meals.`);
  return { pool, filterUsed: "diet-only" };
}

// ─── Main export ────────────────────────────────────────────────────────────

export const generateWeeklyMealPlan = async (userEmail: string) => {
  await connectToDatabase();

  // Drop stale unique index if it exists
  try {
    const db = mongoose.connection.db;
    if (db) await db.collection("mealplans").dropIndex("userEmail_1_date_1");
  } catch (e) {}

  const user = await User.findOne({ email: userEmail }).lean() as any;
  if (!user || !user.recommendations) throw new Error("Profile incomplete");

  // ── Diet resolution ──────────────────────────────────────────────────────
  // dietPreference = TYPE: Vegan | Vegetarian | Non-Vegetarian
  // dietGoal       = MACRO: High-Protein | Low-Carb | Keto | Balanced Diet
  const dietTier = user.isFastingMode
    ? "vegetarian"
    : normalizeDiet(user.dietPreference || "Non-Vegetarian");

  const allowedDietTypes = dietTypeFilter(dietTier);
  const dislikedIds = user.dislikedMeals?.map((id: any) => id.toString()) || [];

  // dietGoal maps to tag for optional secondary filter
  const goalTagMap: Record<string, string> = {
    "high-protein": "High-Protein",
    "low-carb":     "Low-Carb",
    "keto":         "Keto",
    "balanced diet":"Balanced Diet",
  };
  const rawGoal = (user.dietGoal || "Balanced Diet").toLowerCase();
  const goalTag = goalTagMap[rawGoal] ?? null;

  console.log(`[MealPlanner] User: ${userEmail} | dietPreference: ${user.dietPreference} → tier: ${dietTier} | dietGoal: ${user.dietGoal} → tag: ${goalTag} | Fasting: ${user.isFastingMode}`);

  // ── Progressive fetch ────────────────────────────────────────────────────
  const { pool: mealPool, filterUsed } = await fetchMealPool(
    allowedDietTypes,
    dislikedIds,
    !!user.isFastingMode,
    goalTag
  );

  if (mealPool.length === 0) {
    // Return structured error — caller converts to 400
    throw Object.assign(
      new Error(`No ${dietTier === "all" ? "" : dietTier + " "}meals found in database. Please run the meal seeder at /api/seed-meals.`),
      { code: "EMPTY_MEAL_POOL", dietTier }
    );
  }

  console.log(`[MealPlanner] Using ${mealPool.length} meals (filter: ${filterUsed})`);

  // ── Calorie slots ────────────────────────────────────────────────────────
  let targetCals = user.recommendations.recommendedCalories;
  let dailySlots: string[];
  let calsMap: Record<string, number>;

  if (user.isFastingMode) {
    targetCals *= 0.9;
    calsMap = { breakfast: targetCals * 0.30, lunch: targetCals * 0.40, dinner: targetCals * 0.30 };
    dailySlots = ["breakfast", "lunch", "dinner"];
  } else {
    calsMap = {
      breakfast: targetCals * 0.25,
      lunch: targetCals * 0.30,
      dinner: targetCals * 0.30,
      snack: targetCals * 0.15,
    };
    dailySlots = ["breakfast", "lunch", "dinner", "snack"];
  }

  // ── Weekly plan generation ────────────────────────────────────────────────
  const weekDays = getNext7Days();
  const weekStartDate = weekDays[0].date;
  const weeklyData = [];
  const globalUsedIds = new Set<string>();

  const pickMeal = (slot: string): any => {
    // Try category match first
    const snackCategories = ["snack", "pre-workout", "post-workout"];
    let pool = mealPool.filter((m) =>
      slot === "snack"
        ? snackCategories.includes(m.category)
        : m.category === slot
    );

    // No category match → use full pool (ensures we always pick something)
    if (pool.length === 0) pool = mealPool;

    // Prefer unused meals for variety
    const unused = pool.filter((m) => !globalUsedIds.has(m._id.toString()));
    const candidates = unused.length > 0 ? unused : pool;

    // Sort by calorie proximity, take top 5, randomize
    const target = calsMap[slot] ?? targetCals * 0.25;
    candidates.sort((a, b) => Math.abs(a.calories - target) - Math.abs(b.calories - target));

    let top = candidates.slice(0, 5);

    // Prefer high-protein options for muscle gain goal
    if (user.goal === "muscle gain") {
      top.sort((a, b) => b.protein - a.protein);
    }

    const choice = top[Math.floor(Math.random() * Math.min(3, top.length))];
    globalUsedIds.add(choice._id.toString());
    return choice;
  };

  for (const day of weekDays) {
    const selectedMeals = [];
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    for (const slot of dailySlots) {
      const meal = pickMeal(slot);
      selectedMeals.push({ mealId: meal._id, slot });
      totalCalories += meal.calories || 0;
      totalProtein  += meal.protein  || 0;
      totalCarbs    += meal.carbs    || 0;
      totalFat      += meal.fat      || 0;
    }

    weeklyData.push({
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      meals: selectedMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });
  }

  // ── Upsert plan ──────────────────────────────────────────────────────────
  let plan = await MealPlan.findOne({ userEmail, weekStartDate });
  if (plan) {
    plan.days = weeklyData;
    await plan.save();
  } else {
    plan = new MealPlan({ userEmail, weekStartDate, days: weeklyData });
    await plan.save();
  }

  console.log(`[MealPlanner] Plan saved for ${userEmail} | Week: ${weekStartDate}`);
  return plan;
};
