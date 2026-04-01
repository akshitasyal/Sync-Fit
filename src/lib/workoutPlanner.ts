import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Exercise from "@/models/Exercise";
import WorkoutPlan from "@/models/WorkoutPlan";

// ── Program → UI label map ────────────────────────────────────────────────────
export const PROGRAM_LABELS: Record<string, string> = {
  "strength":    "Smart Strength",
  "weight-loss": "Weight Loss",
  "cardio":      "Cardio",
  "adaptive":    "Adaptive Fitness",
  "muscle-gain": "Muscle Gain",
  "beginner":    "Beginner Smart Start",
};

// ── Goal → Default program fallback ──────────────────────────────────────────
const GOAL_PROGRAM_MAP: Record<string, string> = {
  "muscle gain": "muscle-gain",
  "weight loss": "weight-loss",
  "maintenance": "strength",
};

// ── Program-specific weekly splits ───────────────────────────────────────────
const PROGRAM_SPLITS: Record<string, Array<{ focus: string; categories: string[] }>> = {
  "strength": [
    { focus: "Push Day (Chest + Shoulders + Triceps)", categories: ["chest", "shoulders", "arms"] },
    { focus: "Pull Day (Back + Biceps)",               categories: ["back", "arms"] },
    { focus: "Leg Day",                                categories: ["legs"] },
    { focus: "Push Day (Strength Emphasis)",           categories: ["chest", "shoulders"] },
    { focus: "Pull Day (Deadlift Focus)",              categories: ["back", "legs"] },
    { focus: "Full Body Power",                        categories: ["chest", "back", "legs", "core"] },
    { focus: "Rest",                                   categories: [] },
  ],
  "muscle-gain": [
    { focus: "Chest + Triceps",        categories: ["chest", "arms"] },
    { focus: "Back + Biceps",          categories: ["back", "arms"] },
    { focus: "Legs (Quad Focus)",      categories: ["legs"] },
    { focus: "Shoulders + Core",       categories: ["shoulders", "core"] },
    { focus: "Rest",                   categories: [] },
    { focus: "Full Body + Cardio",     categories: ["chest", "back", "legs", "cardio"] },
    { focus: "Rest",                   categories: [] },
  ],
  "weight-loss": [
    { focus: "HIIT Cardio + Core",     categories: ["cardio", "core"] },
    { focus: "Full Body Circuit",      categories: ["legs", "chest", "core"] },
    { focus: "LISS Cardio",            categories: ["cardio"] },
    { focus: "HIIT Cardio + Core",     categories: ["cardio", "core"] },
    { focus: "Full Body Circuit",      categories: ["legs", "back", "core"] },
    { focus: "Active Recovery Cardio", categories: ["cardio"] },
    { focus: "Rest",                   categories: [] },
  ],
  "cardio": [
    { focus: "Steady-State Run",       categories: ["cardio"] },
    { focus: "Cross-Training",         categories: ["cardio", "full-body"] },
    { focus: "Rest",                   categories: [] },
    { focus: "Interval Training",      categories: ["cardio"] },
    { focus: "Long Aerobic Session",   categories: ["cardio"] },
    { focus: "Active Recovery + Core", categories: ["cardio", "core"] },
    { focus: "Rest",                   categories: [] },
  ],
  "beginner": [
    { focus: "Full Body A",            categories: ["chest", "back", "legs"] },
    { focus: "Rest",                   categories: [] },
    { focus: "Full Body B",            categories: ["shoulders", "legs", "arms", "core"] },
    { focus: "Rest",                   categories: [] },
    { focus: "Full Body A",            categories: ["chest", "back", "legs"] },
    { focus: "Light Cardio + Core",    categories: ["cardio", "core"] },
    { focus: "Rest",                   categories: [] },
  ],
  "adaptive": [
    { focus: "Mobility + Upper",       categories: ["core", "shoulders"] },
    { focus: "Low-Impact Lower",       categories: ["legs", "core"] },
    { focus: "Rest",                   categories: [] },
    { focus: "Band + Core",            categories: ["shoulders", "core"] },
    { focus: "Mobility + Lower",       categories: ["core", "legs"] },
    { focus: "Light Cardio",           categories: ["cardio"] },
    { focus: "Rest",                   categories: [] },
  ],
};

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

const adjustStats = (exercise: any, intensity: string, experience: string) => {
  let sets = exercise.sets;
  let reps = exercise.reps;
  let duration = exercise.duration;

  // Intensity scaling
  if (intensity === "low") {
    sets = Math.max(2, sets - 1);
    if (duration) duration = Math.max(10, duration - 5);
  } else if (intensity === "high") {
    sets = sets + 1;
    if (exercise.category !== "cardio" && typeof reps === "string" && reps.includes("-")) {
      reps = "6-8";
    }
    if (duration) duration = duration + 10;
  }

  // Experience scaling
  if (experience === "beginner") {
    sets = Math.max(2, sets - 1);
  } else if (experience === "advanced") {
    sets = sets + 1;
  }

  return { sets, reps, duration };
};

export const generateWeeklyWorkoutPlan = async (userEmail: string, overrideProgram?: string) => {
  await connectToDatabase();
  const user = await User.findOne({ email: userEmail }).lean() as any;
  if (!user || !user.recommendations) throw new Error("Profile incomplete — please complete onboarding first.");

  // ── Resolve program ────────────────────────────────────────────────────────
  const program = overrideProgram || user.selectedProgram || GOAL_PROGRAM_MAP[user.goal || "maintenance"] || "beginner";

  // ── Resolve intensity ────────────────────────────────────────────────────
  let intensity = (user.recommendations?.workoutIntensity || "medium").toLowerCase();
  if (user.workoutFeedback === "too-hard") intensity = intensity === "high" ? "medium" : "low";
  if (user.workoutFeedback === "too-easy") intensity = intensity === "low" ? "medium" : "high";
  // Adaptive program always stays low intensity
  if (program === "adaptive") intensity = "low";

  const experience = user.experienceLevel || "beginner";
  const dislikedIds = user.dislikedExercises?.map((id: any) => id.toString()) || [];

  // ── Fetch program-matched exercise pool ──────────────────────────────────
  let exercisePool = await Exercise.find({
    program: { $in: [program] },
    _id: { $nin: dislikedIds },
  }).lean() as any[];

  console.log(`[WorkoutPlanner] user=${userEmail} | program=${program} | pool=${exercisePool.length} exercises`);

  // Fallback: if pool is too thin, pull from beginner
  if (exercisePool.length < 6) {
    console.log(`[WorkoutPlanner] Pool too small, falling back to beginner exercises`);
    const fallback = await Exercise.find({ program: { $in: ["beginner"] } }).lean() as any[];
    exercisePool = [...exercisePool, ...fallback];
  }

  // Final fallback — anything in DB
  if (exercisePool.length === 0) {
    exercisePool = await Exercise.find().limit(15).lean() as any[];
  }
  if (exercisePool.length === 0) throw new Error("No exercises in database — please run /api/workouts/seed first.");

  // ── Build 7-day plan ────────────────────────────────────────────────────
  const weekDays = getNext7Days();
  const weekStartDate = weekDays[0].date;
  const splits = PROGRAM_SPLITS[program] || PROGRAM_SPLITS["beginner"];
  const weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const d = weekDays[i];
    const split = splits[i];
    const dayExercises: any[] = [];

    if (split.focus !== "Rest") {
      // Pick exercises whose category matches the day's split
      const pool = exercisePool.filter(ex => split.categories.includes(ex.category));

      // Fallback to full program pool if this day's category has nothing
      const effectivePool = pool.length >= 2 ? pool : exercisePool;

      let numExercises = intensity === "low" ? 3 : intensity === "high" ? 6 : 4;
      if (experience === "beginner") numExercises = Math.max(2, numExercises - 1);
      if (experience === "advanced") numExercises = numExercises + 1;
      // Adaptive gets fewer exercises
      if (program === "adaptive") numExercises = Math.min(3, numExercises);

      const shuffled = [...effectivePool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numExercises);

      selected.forEach(ex => {
        const stats = adjustStats(ex, intensity, experience);
        dayExercises.push({
          exerciseId: ex._id,
          sets: stats.sets,
          reps: stats.reps,
          duration: stats.duration,
          completed: false,
        });
      });
    }

    weeklyData.push({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      isCompleted: false,
      focus: split.focus,
      exercises: dayExercises,
    });
  }

  // ── Upsert workout plan ──────────────────────────────────────────────────
  let plan = await WorkoutPlan.findOne({ userEmail, weekStartDate });
  if (plan) {
    plan.days = weeklyData;
    await plan.save();
  } else {
    plan = await WorkoutPlan.create({ userEmail, weekStartDate, days: weeklyData });
  }

  return plan;
};
