interface FuzzyInputs {
  age: number;
  bmi: number;
  energyLevel: "low" | "medium" | "high";
  sleepQuality: "poor" | "average" | "good";
  goal: "weight loss" | "maintenance" | "muscle gain";
  experienceLevel?: "beginner" | "intermediate" | "advanced";
}

interface FuzzyOutputs {
  workoutIntensity: "low" | "medium" | "high";
  dietType: "cutting" | "maintenance" | "bulking";
  recommendedCalories: number;
}

// BMI Fuzzification: mapped to low, normal, and high triangular membership functions
function getBmiMemberships(bmi: number) {
  let low = 0, normal = 0, high = 0;
  
  if (bmi <= 18.5) { low = 1; }
  else if (bmi > 18.5 && bmi <= 20) { low = (20 - bmi) / 1.5; normal = (bmi - 18.5) / 1.5; }
  else if (bmi > 20 && bmi <= 25) { normal = 1; }
  else if (bmi > 25 && bmi <= 27) { normal = (27 - bmi) / 2; high = (bmi - 25) / 2; }
  else { high = 1; }

  return { low, normal, high };
}

// Convert discrete string features to crisp fuzzy values exactly
function getDiscreteMembership(value: string, labels: string[]) {
  const result: Record<string, number> = {};
  labels.forEach(l => result[l] = (l === value ? 1 : 0));
  return result;
}

// Defuzzification (Centroid method)
// Calorie ranges representation
function defuzzifyCalories(weights: { low: number, med: number, high: number }): number {
  let numerator = 0;
  let denominator = 0;

  // Singletons values for Defuzzification 
  const points = [
    { value: 1600, activation: weights.low },
    { value: 2200, activation: weights.med },
    { value: 2800, activation: weights.high }
  ];

  points.forEach(p => {
    numerator += p.value * p.activation;
    denominator += p.activation;
  });

  if (denominator === 0) return 2200; // Default maintenance
  return Math.round(numerator / denominator);
}

export function evaluateFuzzyLogic(inputs: FuzzyInputs): FuzzyOutputs {
  const bmiFuzzy = getBmiMemberships(inputs.bmi);
  const experience = inputs.experienceLevel || "beginner";

  // Workout Intensity logic
  let workoutIntensity: "low" | "medium" | "high" = "medium";
  if (inputs.energyLevel === "low" || inputs.sleepQuality === "poor") workoutIntensity = "low";
  else if (inputs.energyLevel === "high" && inputs.sleepQuality === "good") workoutIntensity = "high";

  // Experience adjustment for Intensity
  if (experience === "advanced" && workoutIntensity === "low" && inputs.energyLevel !== "low") {
    workoutIntensity = "medium";
  }

  // Diet Type logic
  let dietType: "cutting" | "maintenance" | "bulking" = "maintenance";
  if (inputs.goal === "weight loss") dietType = "cutting";
  if (inputs.goal === "muscle gain") dietType = "bulking";

  // Calorie execution with Fuzzy logic max evaluations
  let calLow = 0;
  let calMed = 0;
  let calHigh = 0;

  const updateCal = (level: "low"| "med"| "high", firingStrength: number) => {
    if (level === "low") calLow = Math.max(calLow, firingStrength);
    if (level === "med") calMed = Math.max(calMed, firingStrength);
    if (level === "high") calHigh = Math.max(calHigh, firingStrength);
  };

  // Rule 1: IF goal is weight loss AND BMI applies
  if (inputs.goal === "weight loss") {
    updateCal("low", bmiFuzzy.high); // high BMI wants low cal to lose weight
    updateCal("low", bmiFuzzy.normal); 
    updateCal("med", bmiFuzzy.low); // low BMI wants to maintain
  }

  // Rule 2: IF goal is muscle gain
  if (inputs.goal === "muscle gain") {
    updateCal("high", bmiFuzzy.low);
    updateCal("high", bmiFuzzy.normal);
    updateCal("med", bmiFuzzy.high); // if high BMI but wants muscle gain, don't exceed medium cal
  }

  // Rule 3: Maintenance
  if (inputs.goal === "maintenance") {
    updateCal("med", bmiFuzzy.normal);
    updateCal("high", bmiFuzzy.low); // if low BMI maintaining, give high
    updateCal("low", bmiFuzzy.high); // if high BMI maintaining, give low
  }

  let recommendedCalories = defuzzifyCalories({ low: calLow, med: calMed, high: calHigh });

  // Experience level adjustment
  if (experience === "beginner") recommendedCalories -= 100;
  if (experience === "advanced") recommendedCalories += 100;

  return {
    workoutIntensity,
    dietType,
    recommendedCalories,
  };
}
