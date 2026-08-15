export type Gender = "male" | "female" | "other";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "extra_active";

export type FitnessGoal =
  | "lose_fat"
  | "build_muscle"
  | "maintain_weight"
  | "improve_fitness"
  | "body_recomp";

export interface UserMetricsInput {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  // Extensible fields for future expansions
  bodyFatPercentage?: number;
  energyLevel?: "low" | "medium" | "high";
  sleepQuality?: "poor" | "average" | "good";
  dietPreference?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  isFastingMode?: boolean;
}

export interface WorkoutRecommendation {
  title: string;
  splitType: string;
  frequency: string;
  trainingStyle: string;
  progressiveOverload: string;
  cardioProtocol: string;
  focusAreas: string[];
}

export interface FitnessRecommendationOutput {
  bmi: number;
  bmiCategory: "Underweight" | "Normal" | "Overweight" | "Obese";
  bmiBadgeColor: string;
  bmiGaugePercentage: number;
  direction: string;
  tagline: string;
  description: string;
  primaryFocus: string;
  nutritionStrategy: string;
  trainingStrategy: string;
  calorieStrategy: string;
  cardioRecommendation: string;
  workoutRecommendation: WorkoutRecommendation;
  bmr: number;
  tdee: number;
  recommendedDailyCalories: number;
  recommendedDailyWaterLiters: number;
  recommendedDailyWaterOz: number;
  confidence: number;
}

/**
 * Activity Multipliers for TDEE based on Harris-Benedict / Mifflin-St Jeor
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Office job, little to no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  extra_active: 1.9, // Very heavy physical job or 2x/day training
};

/**
 * Calculates BMI (Body Mass Index)
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

/**
 * Categorizes BMI
 */
export function getBMICategory(bmi: number): {
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  badgeColor: string;
  gaugePercentage: number;
} {
  if (bmi < 18.5) {
    const gauge = Math.max(5, Math.min(25, (bmi / 18.5) * 25));
    return { category: "Underweight", badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/30", gaugePercentage: gauge };
  }
  if (bmi < 25) {
    const gauge = 25 + ((bmi - 18.5) / 6.5) * 25;
    return { category: "Normal", badgeColor: "text-[#c1ff00] bg-[#c1ff00]/10 border-[#c1ff00]/30", gaugePercentage: gauge };
  }
  if (bmi < 30) {
    const gauge = 50 + ((bmi - 25) / 5) * 25;
    return { category: "Overweight", badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/30", gaugePercentage: gauge };
  }
  const gauge = Math.min(100, 75 + ((bmi - 30) / 10) * 25);
  return { category: "Obese", badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/30", gaugePercentage: gauge };
}

/**
 * Computes Basal Metabolic Rate (BMR) via Mifflin-St Jeor equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  if (gender === "female") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  // male and other default to standard male baseline
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

/**
 * Computes Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * Estimates daily water needs in Liters and Fluid Ounces
 */
export function calculateDailyWater(
  weightKg: number,
  activityLevel: ActivityLevel
): { liters: number; oz: number } {
  // Baseline: 35ml per kg of bodyweight
  let baseMl = weightKg * 35;
  if (activityLevel === "moderate") baseMl += 400;
  if (activityLevel === "very_active" || activityLevel === "extra_active") baseMl += 800;

  const liters = parseFloat((Math.max(1.8, baseMl) / 1000).toFixed(1));
  const oz = Math.round(liters * 33.814);
  return { liters, oz };
}

/**
 * Core Intelligent Recommendation Engine
 * Synthesizes BMI, Age, Gender, Activity Level, Weight, and Goal to determine
 * a personalized fitness direction and tailored strategy.
 */
export function getFitnessRecommendation(
  metrics: UserMetricsInput
): FitnessRecommendationOutput {
  const {
    age = 25,
    gender = "male",
    heightCm = 175,
    weightKg = 70,
    activityLevel = "moderate",
    goal = "build_muscle",
    experienceLevel = "beginner",
  } = metrics;

  const bmi = calculateBMI(heightCm, weightKg);
  const { category: bmiCategory, badgeColor: bmiBadgeColor, gaugePercentage: bmiGaugePercentage } =
    getBMICategory(bmi);

  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const { liters: waterLiters, oz: waterOz } = calculateDailyWater(
    weightKg,
    activityLevel
  );

  let direction = "Balanced Fitness & Performance";
  let tagline = "Optimizing composition, metabolic health, and daily vitality.";
  let description =
    "SyncFit recommends a well-rounded fitness regimen prioritizing progressive resistance training and cardiovascular health.";
  let primaryFocus = "Overall Athletic Conditioning";
  let nutritionStrategy = "Balanced Macronutrient Distribution";
  let trainingStrategy = "Full-Body Strength & Functional Movement";
  let calorieStrategy = "Maintenance (Isocaloric baseline)";
  let cardioRecommendation = "2–3 moderate aerobic sessions/week (Zone 2)";
  let targetCalories = tdee;
  let confidence = 94;

  let workoutRecommendation: WorkoutRecommendation = {
    title: "Functional Strength & Conditioning",
    splitType: "3–4 Day Upper/Lower or Full-Body",
    frequency: "3–4 sessions per week",
    trainingStyle: "Compound lifts + Functional Circuit",
    progressiveOverload: "Gradual weekly rep and weight progression",
    cardioProtocol: "20 min low-impact Zone 2 post-workout",
    focusAreas: ["Core Stability", "Compound Strength", "Aerobic Base"],
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Rule Category 1: Low BMI (< 18.5)
  // ──────────────────────────────────────────────────────────────────────────
  if (bmi < 18.5) {
    if (goal === "build_muscle") {
      direction = "Lean Muscle + Healthy Weight Gain";
      tagline = "Progressive hypertrophy supported by calorie & protein surplus.";
      description =
        "Your BMI indicates you are below the standard weight range. SyncFit advises focusing on building dense lean mass with a steady caloric surplus rather than excessive cardio.";
      primaryFocus = "Hypertrophy & Skeletal Muscle Mass";
      nutritionStrategy = "High-Calorie Nutrient Dense + High Protein (1.8–2.2g/kg)";
      trainingStrategy = "Progressive Heavy Resistance (Hypertrophy focus)";
      calorieStrategy = `Surplus (+300 to +450 kcal / day)`;
      targetCalories = tdee + 350;
      cardioRecommendation = "Light active recovery only (1 session/week max)";
      confidence = 98;

      workoutRecommendation = {
        title: "Hypertrophy & Muscle Mass Foundation",
        splitType: "4-Day Push / Pull / Legs Split",
        frequency: "4 days / week (strict rest intervals)",
        trainingStyle: "Heavy compound basics (Squat, Bench, Row, Overhead Press)",
        progressiveOverload: "Target 8–12 rep range with 2–3 min recovery",
        cardioProtocol: "Minimal cardio to preserve energy for muscle building",
        focusAreas: ["Upper Body Density", "Leg Hypertrophy", "Back Width & Thickness"],
      };
    } else {
      direction = "Healthy Weight Gain & Vitality";
      tagline = "Restoring optimal baseline weight and structural strength.";
      description =
        "Your metrics indicate room to build healthy lean body mass and bone density. The priority is nourishing your metabolism and establishing structural strength.";
      primaryFocus = "Lean Body Mass & Bone Mineral Density";
      nutritionStrategy = "Calorie Surplus with Healthy Fats & Complex Carbs";
      trainingStrategy = "Full-Body Strength & Foundational Form";
      calorieStrategy = `Surplus (+300 kcal / day)`;
      targetCalories = tdee + 300;
      cardioRecommendation = "Gentle walking and mobility work";
      confidence = 95;

      workoutRecommendation = {
        title: "Foundational Strength & Strength Base",
        splitType: "3-Day Full Body Routine",
        frequency: "3 days / week",
        trainingStyle: "Controlled tempo compound movements",
        progressiveOverload: "Master movement patterns before adding weight",
        cardioProtocol: "Daily 15-min brisk walks for appetite stimulation",
        focusAreas: ["Core Foundation", "Lower Body Power", "Posture Correction"],
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Rule Category 2: Healthy BMI (18.5 <= BMI < 25)
  // ──────────────────────────────────────────────────────────────────────────
  else if (bmi >= 18.5 && bmi < 25) {
    if (goal === "build_muscle") {
      direction = "Lean Muscle Development";
      tagline = "Hypertrophy focus with targeted muscular definition.";
      description =
        "Your BMI is within the healthy range. Instead of focusing primarily on weight loss, SyncFit recommends building lean muscle while preserving a healthy body composition.";
      primaryFocus = "Muscle Growth & Density";
      nutritionStrategy = "Protein-focused (2.0g/kg) with timed carbohydrate intake";
      trainingStrategy = "Strength & Hypertrophy";
      calorieStrategy = "Maintenance / slight surplus (+200 to +250 kcal / day)";
      targetCalories = tdee + 220;
      cardioRecommendation = "1–2 sessions/week (15–20 min moderate cardio)";
      confidence = 97;

      workoutRecommendation = {
        title: "Hypertrophy & Strength Split",
        splitType: "4–5 Day Upper / Lower or PPL Split",
        frequency: "4–5 days / week",
        trainingStyle: "Targeted volume (12–16 sets per muscle group/week)",
        progressiveOverload: "Micro-loading + RPE 7-9 proximity to failure",
        cardioProtocol: "15 min incline treadmill walk twice weekly",
        focusAreas: ["Chest & Deltoid Development", "V-Taper Lats", "Quad & Hamstring Sweep"],
      };
    } else if (goal === "lose_fat") {
      direction = "Body Recomposition / Targeted Fat Loss";
      tagline = "Refining definition while safeguarding muscle tissue.";
      description =
        "Because you are already in a healthy BMI bracket, aggressive dieting is counterproductive. SyncFit designs a precision mild deficit to peel off fat while protecting athletic muscle.";
      primaryFocus = "Visceral & Subcutaneous Fat Trimming";
      nutritionStrategy = "High Protein (2.2g/kg) + Moderate Fat Deficit";
      trainingStrategy = "High-Intensity Resistance Training";
      calorieStrategy = "Mild Deficit (-300 to -350 kcal / day)";
      targetCalories = tdee - 300;
      cardioRecommendation = "2–3 sessions (1 HIIT + 2 Zone 2 LISS)";
      confidence = 96;

      workoutRecommendation = {
        title: "Lean Definition & Muscle Retention",
        splitType: "4-Day Athletic Split",
        frequency: "4 days / week",
        trainingStyle: "Supersets & Compound Strength",
        progressiveOverload: "Maintain lifting weights to signal muscle retention",
        cardioProtocol: "20 min Zone 2 LISS post-workout + 8,000 daily steps",
        focusAreas: ["Abdominal Definition", "Metabolic Conditioning", "Full Body Definition"],
      };
    } else if (goal === "body_recomp") {
      direction = "Body Recomposition";
      tagline = "Simultaneous fat loss and muscle gain at maintenance.";
      description =
        "Your current biometrics place you in the sweet spot for body recomposition — trading body fat for lean muscle mass without drastic scale fluctuations.";
      primaryFocus = "Lean Mass Gain with Parallel Fat Oxidation";
      nutritionStrategy = "High Protein (2.0–2.2g/kg) with Calorie Cycling";
      trainingStrategy = "Strength & Hypertrophy";
      calorieStrategy = "Isocaloric Maintenance (Training Day +100, Rest Day -150)";
      targetCalories = tdee;
      cardioRecommendation = "2 sessions moderate steady-state cardio (Zone 2)";
      confidence = 98;

      workoutRecommendation = {
        title: "Recomposition Precision Split",
        splitType: "4-Day Upper / Lower Split",
        frequency: "4 days / week",
        trainingStyle: "Heavy compound openers followed by metabolic pump work",
        progressiveOverload: "Track volume progression (sets × reps × weight)",
        cardioProtocol: "20 min incline walking post-workout",
        focusAreas: ["Posterior Chain", "Shoulder Cap", "Upper Chest & Arms"],
      };
    } else if (goal === "maintain_weight") {
      direction = "Maintain & Improve Fitness";
      tagline = "Peak performance, joint durability, and energy optimization.";
      description =
        "Your BMI and metrics are well-balanced. SyncFit focuses on performance milestones, functional agility, and sustainable long-term fitness.";
      primaryFocus = "Functional Strength & Athletic Performance";
      nutritionStrategy = "Balanced Whole-Food Nutrition (40C / 30P / 30F)";
      trainingStrategy = "Multi-Planar Strength & Athletic Training";
      calorieStrategy = "Exact Maintenance (Neutral energy balance)";
      targetCalories = tdee;
      cardioRecommendation = "2–3 sessions cardio (mixture of endurance & tempo)";
      confidence = 95;

      workoutRecommendation = {
        title: "Athletic Performance & Longevity",
        splitType: "3–4 Day Hybrid Training",
        frequency: "3–4 days / week",
        trainingStyle: "Strength + Mobility + Functional Movements",
        progressiveOverload: "Volume and density progression",
        cardioProtocol: "30 min outdoor run or rowing session weekly",
        focusAreas: ["Core Rotation", "Joint Health", "Metabolic Stamina"],
      };
    } else {
      direction = "Fitness & Performance";
      tagline = "Elevating VO2 max, muscular endurance, and total physical output.";
      description =
        "Your metrics are in a prime baseline. SyncFit recommends a progressive athletic regimen targeting strength, endurance, and physical resilience.";
      primaryFocus = "Aerobic Base & Muscular Stamina";
      nutritionStrategy = "Active Carbohydrate Distribution + High Protein";
      trainingStrategy = "Hybrid Strength, Cardio & Mobility";
      calorieStrategy = "Maintenance to slight active surplus (+100 kcal)";
      targetCalories = tdee + 50;
      cardioRecommendation = "3 sessions / week (Intervals + Steady State)";
      confidence = 94;

      workoutRecommendation = {
        title: "Hybrid Athlete Conditioning",
        splitType: "4-Day Performance Grid",
        frequency: "3–5 days / week",
        trainingStyle: "Strength, Cardio & Mobility balance",
        progressiveOverload: "Decrease rest times while maintaining power output",
        cardioProtocol: "25 min Zone 2 session + 1 interval sprint workout",
        focusAreas: ["Full-Body Power", "Work Capacity", "Agility & Core"],
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Rule Category 3: Overweight BMI (25 <= BMI < 30)
  // ──────────────────────────────────────────────────────────────────────────
  else if (bmi >= 25 && bmi < 30) {
    if (goal === "build_muscle") {
      direction = "Muscle Preservation + Recomposition";
      tagline = "Building dense muscle while utilizing existing fat reserves.";
      description =
        "Your BMI suggests sufficient energy reserves to fuel intense resistance training. SyncFit focuses on progressive lifting with a moderate deficit to drop fat while hardening muscle tissue.";
      primaryFocus = "Preserving Lean Mass during Fat Oxidation";
      nutritionStrategy = "High Protein (2.2g/kg) + Controlled Carb Windows";
      trainingStrategy = "Heavy Strength Training & Moderate Volume";
      calorieStrategy = "Moderate Deficit (-350 to -450 kcal / day)";
      targetCalories = tdee - 380;
      cardioRecommendation = "2–3 sessions low-impact steady cardio (LISS)";
      confidence = 96;

      workoutRecommendation = {
        title: "Power-Hypertrophy Recomposition",
        splitType: "4-Day Push / Pull / Legs + Conditioning",
        frequency: "4 days / week",
        trainingStyle: "Compound lifts (protect muscle) + High-density accessories",
        progressiveOverload: "Maintain heavy loads (6–10 rep range)",
        cardioProtocol: "25 min incline treadmill walk (Zone 2)",
        focusAreas: ["Back Thickness", "Chest & Shoulder Width", "Leg Power"],
      };
    } else if (goal === "lose_fat") {
      direction = "Fat Loss + Muscle Preservation";
      tagline = "Accelerated fat reduction with strict lean-tissue shielding.";
      description =
        "SyncFit prescribes an optimized calorie deficit paired with resistance training to ensure weight lost comes from adipose tissue, not active muscle.";
      primaryFocus = "Calorie Deficit & Visceral Fat Reduction";
      nutritionStrategy = "Satiating High Protein + High Fiber & Low Glycemic Carbs";
      trainingStrategy = "Strength Training (3-4 days) + HIIT/Cardio (1-2 days)";
      calorieStrategy = "Consistent Calorie Deficit (-450 to -550 kcal / day)";
      targetCalories = tdee - 480;
      cardioRecommendation = "3 sessions (2 LISS walks + 1 HIIT session)";
      confidence = 98;

      workoutRecommendation = {
        title: "Strength & Fat Loss Protocol",
        splitType: "3–4 Day Strength + Cardio Split",
        frequency: "3–4 days / week + 1–2 days cardio",
        trainingStyle: "Circuit-assisted resistance and supersets",
        progressiveOverload: "Weekly increase in total training volume",
        cardioProtocol: "20–30 min Zone 2 LISS + 10,000 daily steps goal",
        focusAreas: ["Large Muscle Compound Activation", "Core & Caloric Burn"],
      };
    } else if (goal === "body_recomp") {
      direction = "Recomposition / Fitness";
      tagline = "Transforming body ratio with high-protein energy deficit.";
      description =
        "A BMI between 25 and 30 is prime territory for dramatic recomposition results when high-protein intake is paired with heavy progressive resistance work.";
      primaryFocus = "Shifting Fat-to-Muscle Mass Ratio";
      nutritionStrategy = "High Protein (2.0–2.4g/kg) with Moderate Deficit";
      trainingStrategy = "Strength & Hypertrophy (4 days/week)";
      calorieStrategy = "Controlled Deficit (-350 kcal / day)";
      targetCalories = tdee - 350;
      cardioRecommendation = "2 sessions LISS + daily step threshold";
      confidence = 97;

      workoutRecommendation = {
        title: "Recomposition Hypertrophy Split",
        splitType: "4-Day Upper / Lower Split",
        frequency: "4 days / week",
        trainingStyle: "Standard resistance training with 90s rest intervals",
        progressiveOverload: "Focus on adding 1 rep or 1-2kg weekly",
        cardioProtocol: "20 min stationary bike or elliptical post-lift",
        focusAreas: ["Shoulder-to-Waist Ratio", "Glute & Leg Density", "Upper Back"],
      };
    } else {
      direction = "Fat Loss + Fitness Foundation";
      tagline = "Improving cardiovascular endurance while leaning down.";
      description =
        "SyncFit creates a sustainable exercise roadmap designed to drop body fat, improve insulin sensitivity, and build robust cardiovascular endurance.";
      primaryFocus = "Metabolic Rate Enhancement & Fat Trimming";
      nutritionStrategy = "Whole-Food Diet, High Fiber & Moderate Deficit";
      trainingStrategy = "Full-Body Strength + Low-Impact Cardio";
      calorieStrategy = "Sustainable Deficit (-400 kcal / day)";
      targetCalories = tdee - 400;
      cardioRecommendation = "3 sessions / week (Brisk walking, cycling, or swimming)";
      confidence = 95;

      workoutRecommendation = {
        title: "Total Fitness & Calorie Burn Circuit",
        splitType: "3-Day Full Body Resistance + 2-Day Cardio",
        frequency: "3–4 days / week",
        trainingStyle: "Joint-friendly resistance machines + Free weights",
        progressiveOverload: "Progress from machine stabilization to free weights",
        cardioProtocol: "30 min low-impact cycling or outdoor walking",
        focusAreas: ["Cardiovascular Capacity", "Leg Strength", "Core Stability"],
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Rule Category 4: Obesity Range (BMI >= 30)
  // ──────────────────────────────────────────────────────────────────────────
  else {
    direction = "Sustainable Fat Loss & Metabolic Foundation";
    tagline = "Joint-friendly, sustainable fat loss without extreme restriction.";
    description =
      "SyncFit prioritizes sustainable habits, joint-friendly strength training, and an active metabolic foundation. We avoid extreme crash diets to protect long-term health and consistency.";
    primaryFocus = "Fat Loss, Joint Mobility & Cardiovascular Health";
    nutritionStrategy = "High Satiety, Fiber-Dense Whole Foods + Protein (1.6–2.0g/kg)";
    trainingStrategy = "Joint-Friendly Strength (Machines, Dumbbells, Bodyweight)";
    calorieStrategy = "Sustainable Moderate Deficit (-500 kcal / day — no extreme crash diets)";
    targetCalories = Math.max(bmr + 200, tdee - 500);
    cardioRecommendation = "Daily low-impact walking (30–45 min) + Light swimming/cycling";
    confidence = 97;

    workoutRecommendation = {
      title: "Joint-Friendly Metabolic & Strength Plan",
      splitType: "3-Day Full Body (Low Impact)",
      frequency: "3 days / week",
      trainingStyle: "Machine-guided and supported dumbbell exercises",
      progressiveOverload: "Focus on movement quality, range of motion, and stamina",
      cardioProtocol: "30 min daily brisk walking (split into two 15-min sessions if needed)",
      focusAreas: ["Lower Body Stability", "Spine & Core Health", "Aerobic Conditioning"],
    };
  }

  // Adjustments based on experience level
  if (experienceLevel === "advanced") {
    workoutRecommendation.frequency = "4–5 days / week (Advanced Periodization)";
  }

  return {
    bmi,
    bmiCategory,
    bmiBadgeColor,
    bmiGaugePercentage,
    direction,
    tagline,
    description,
    primaryFocus,
    nutritionStrategy,
    trainingStrategy,
    calorieStrategy,
    cardioRecommendation,
    workoutRecommendation,
    bmr,
    tdee,
    recommendedDailyCalories: Math.round(targetCalories),
    recommendedDailyWaterLiters: waterLiters,
    recommendedDailyWaterOz: waterOz,
    confidence,
  };
}

/**
 * Helper converters for Metric & Imperial
 */
export function lbsToKg(lbs: number): number {
  return parseFloat((lbs * 0.45359237).toFixed(1));
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}
