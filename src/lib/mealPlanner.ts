import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Meal from "@/models/Meal";
import MealPlan from "@/models/MealPlan";

const getNext7Days = () => {
  const days = [];
  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' })
    });
  }
  return days;
};

export const generateWeeklyMealPlan = async (userEmail: string) => {
  await connectToDatabase();
  const user = await User.findOne({ email: userEmail }).lean() as any;
  if (!user || !user.recommendations) throw new Error("Profile incomplete");

  let targetCals = user.recommendations.recommendedCalories;
  let dietPref = user.dietPreference || "Balanced Diet";

  if (user.isFastingMode) {
    dietPref = "Fasting";
    targetCals = targetCals * 0.9; // 10% reduction for fasting days
  }

  // Constraints per day (25% / 30% / 30% / 15%)
  const calsMap = {
    breakfast: targetCals * 0.25,
    lunch: targetCals * 0.30,
    dinner: targetCals * 0.30,
    snack: targetCals * 0.15
  };

  const dislikedIds = user.dislikedMeals?.map((id: any) => id.toString()) || [];

  let mealPool = await Meal.find({ 
    dietType: dietPref,
    _id: { $nin: dislikedIds }
  }).lean() as any[];
  
  if (mealPool.length === 0) {
    mealPool = await Meal.find({ _id: { $nin: dislikedIds } }).lean() as any[];
  }
  
  if (mealPool.length === 0) throw new Error("No available meals matching preferences");

  const weekDays = getNext7Days();
  const weekStartDate = weekDays[0].date;
  const weeklyData = [];

  const globalUsedIds = new Set<string>();

  for (const d of weekDays) {
    const selectedMeals = [];
    let currentCals = 0, currentPro = 0, currentCarb = 0, currentFat = 0;

    const pickMeal = (category: string) => {
      let pool = mealPool.filter(m => m.category === category || (category === 'snack' && ['snack', 'pre-workout', 'post-workout'].includes(m.category)));
      if (pool.length === 0) pool = mealPool;
      
      let unused = pool.filter(m => !globalUsedIds.has(m._id.toString()));
      if (unused.length === 0) unused = pool; 
      
      const target = calsMap[category as keyof typeof calsMap];
      unused.sort((a, b) => Math.abs(a.calories - target) - Math.abs(b.calories - target));
      
      let topPool = unused.slice(0, 10);
      
      if (user.goal === "muscle gain") {
        topPool.sort((a, b) => b.protein - a.protein);
      }
      
      topPool = topPool.slice(0, 3);
      const choice = topPool[Math.floor(Math.random() * topPool.length)];
      
      globalUsedIds.add(choice._id.toString());
      return choice;
    };

    const dailySlots = ["fasting", "breakfast", "lunch", "dinner", "snack"];
    for (const slot of dailySlots) {
      if (slot === "fasting") {
        selectedMeals.push({
          slot,
          mealId: null
        });
        continue;
      }
      const choice = pickMeal(slot);
      selectedMeals.push({
        mealId: choice._id,
        slot
      });
      currentCals += choice.calories;
      currentPro += choice.protein;
      currentCarb += choice.carbs;
      currentFat += choice.fat;
    }

    weeklyData.push({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      meals: selectedMeals,
      totalCalories: currentCals,
      totalProtein: currentPro,
      totalCarbs: currentCarb,
      totalFat: currentFat
    });
  }

  let newPlan = await MealPlan.findOne({ userEmail, weekStartDate });
  
  if (newPlan) {
    newPlan.days = weeklyData;
    await newPlan.save();
  } else {
    newPlan = new MealPlan({
      userEmail,
      weekStartDate,
      days: weeklyData
    });
    await newPlan.save();
  }

  return newPlan;
};
