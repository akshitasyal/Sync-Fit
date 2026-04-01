import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

// ── 42 program-tagged exercises ───────────────────────────────────────────────
// program[] allows cross-tagging (e.g. push-ups to strength + beginner)
const exercises = [

  // ══════════════════════════════════════════════════════════
  // STRENGTH PROGRAM — compound heavy lifts
  // ══════════════════════════════════════════════════════════
  { name: "Barbell Bench Press", category: "chest", program: ["strength", "muscle-gain"], difficulty: "high", sets: 4, reps: "6-8", rest: 120, instructions: "Lie flat, lower barbell to mid-chest with control, drive up explosively." },
  { name: "Barbell Back Squat", category: "legs", program: ["strength", "muscle-gain"], difficulty: "high", sets: 5, reps: "5", rest: 180, instructions: "Bar on upper traps, brace core, descend below parallel, drive through heels." },
  { name: "Conventional Deadlift", category: "back", program: ["strength", "muscle-gain"], difficulty: "high", sets: 4, reps: "4-6", rest: 180, instructions: "Hinge at hips, neutral spine, drive floor away, lock out at top." },
  { name: "Overhead Press (Barbell)", category: "shoulders", program: ["strength", "muscle-gain"], difficulty: "high", sets: 4, reps: "5-6", rest: 120, instructions: "Strict press from clavicle, full lockout overhead, no leg drive." },
  { name: "Barbell Row (Pendlay)", category: "back", program: ["strength", "muscle-gain"], difficulty: "high", sets: 4, reps: "6-8", rest: 120, instructions: "Pull from dead stop each rep to lower chest, keep back horizontal." },
  { name: "Push-ups", category: "chest", program: ["strength", "beginner", "adaptive"], difficulty: "low", sets: 3, reps: "AMRAP", rest: 60, instructions: "Keep body straight, lower chest to floor, push back up fully." },
  { name: "Pull-ups", category: "back", program: ["strength", "muscle-gain"], difficulty: "high", sets: 3, reps: "AMRAP", rest: 90, instructions: "Dead hang start, pull until chin clears bar, control descent." },
  { name: "Dumbbell Romanian Deadlift", category: "legs", program: ["strength", "muscle-gain"], difficulty: "medium", sets: 3, reps: "10-12", rest: 90, instructions: "Hinge with soft knees, feel hamstring stretch, return to standing." },
  { name: "Weighted Dips", category: "chest", program: ["strength", "muscle-gain"], difficulty: "high", sets: 3, reps: "8-10", rest: 90, instructions: "Slight forward lean, lower until shoulders below elbows, press up." },
  { name: "Power Clean", category: "back", program: ["strength"], difficulty: "high", sets: 4, reps: "3-5", rest: 180, instructions: "Explosive pull from floor, catch in front rack position, stand tall." },

  // ══════════════════════════════════════════════════════════
  // MUSCLE-GAIN (HYPERTROPHY) — isolation + compound volume
  // ══════════════════════════════════════════════════════════
  { name: "Incline Dumbbell Press", category: "chest", program: ["muscle-gain"], difficulty: "medium", sets: 4, reps: "10-12", rest: 90, instructions: "30° incline, press up and together at top, feel upper-chest stretch at bottom." },
  { name: "Cable Crossover", category: "chest", program: ["muscle-gain"], difficulty: "low", sets: 3, reps: "12-15", rest: 60, instructions: "Arms slightly bent, sweep cables together in front of chest, squeeze hard." },
  { name: "Lat Pulldown", category: "back", program: ["muscle-gain", "beginner"], difficulty: "low", sets: 4, reps: "10-12", rest: 75, instructions: "Full stretch at top, pull to upper chest, arch back slightly." },
  { name: "Seated Cable Row", category: "back", program: ["muscle-gain", "beginner"], difficulty: "low", sets: 3, reps: "12-15", rest: 60, instructions: "Pull handle to lower abdomen, touch elbows behind back, control return." },
  { name: "Leg Press", category: "legs", program: ["muscle-gain", "beginner"], difficulty: "medium", sets: 4, reps: "12-15", rest: 90, instructions: "Full range of motion, don't lock knees at top, control descent." },
  { name: "Leg Extension", category: "legs", program: ["muscle-gain"], difficulty: "low", sets: 3, reps: "15-20", rest: 60, instructions: "Extend fully, hold 1 second at top, lower slowly." },
  { name: "Lying Leg Curl", category: "legs", program: ["muscle-gain"], difficulty: "low", sets: 3, reps: "12-15", rest: 60, instructions: "Curl pad toward glutes, squeeze hamstrings at top." },
  { name: "Barbell Curl", category: "arms", program: ["muscle-gain"], difficulty: "medium", sets: 3, reps: "10-12", rest: 75, instructions: "Full range, squeeze bicep at top, lower with control — zero swinging." },
  { name: "Tricep Rope Pushdown", category: "arms", program: ["muscle-gain"], difficulty: "low", sets: 3, reps: "12-15", rest: 60, instructions: "Lock elbows at sides, push rope down, spread at bottom, squeeze." },
  { name: "Dumbbell Lateral Raise", category: "shoulders", program: ["muscle-gain", "beginner"], difficulty: "low", sets: 4, reps: "15-20", rest: 45, instructions: "Lead with elbows, raise to parallel, slow eccentric counts." },

  // ══════════════════════════════════════════════════════════
  // CARDIO PROGRAM — aerobic + interval training
  // ══════════════════════════════════════════════════════════
  { name: "Treadmill Run (Steady State)", category: "cardio", program: ["cardio", "weight-loss"], difficulty: "medium", sets: 1, reps: "Continuous", rest: 0, duration: 30, instructions: "Maintain conversation pace (Zone 2), 5.5–7 mph depending on fitness." },
  { name: "Treadmill Sprint Intervals (HIIT)", category: "cardio", program: ["cardio", "weight-loss"], difficulty: "high", sets: 8, reps: "30s on / 30s off", rest: 0, duration: 16, instructions: "Max effort 30s sprint, 30s walk recovery, repeat 8 rounds." },
  { name: "Cycling (Stationary)", category: "cardio", program: ["cardio", "weight-loss", "adaptive"], difficulty: "low", sets: 1, reps: "Continuous", rest: 0, duration: 30, instructions: "Moderate resistance, cadence 80–90 RPM, maintain steady breathing." },
  { name: "Rowing Machine", category: "cardio", program: ["cardio", "weight-loss"], difficulty: "high", sets: 1, reps: "Continuous", rest: 0, duration: 20, instructions: "Drive with legs first, lean back, then pull with arms. Return in reverse order." },
  { name: "Jump Rope", category: "cardio", program: ["cardio", "weight-loss"], difficulty: "medium", sets: 5, reps: "2 min on / 1 min rest", rest: 60, duration: 15, instructions: "Land softly on balls of feet, keep elbows tucked, wrists do the work." },
  { name: "Incline Treadmill Walk (LISS)", category: "cardio", program: ["cardio", "weight-loss", "adaptive"], difficulty: "low", sets: 1, reps: "Continuous", rest: 0, duration: 40, instructions: "Incline 10–15%, speed 3.0–3.5 mph, no holding the rails." },
  { name: "Stairmaster", category: "cardio", program: ["cardio", "weight-loss"], difficulty: "medium", sets: 1, reps: "Continuous", rest: 0, duration: 20, instructions: "Steady medium pace, no resting arms on machine, upright posture." },

  // ══════════════════════════════════════════════════════════
  // WEIGHT-LOSS — metabolic circuits + HIIT
  // ══════════════════════════════════════════════════════════
  { name: "Burpees", category: "cardio", program: ["weight-loss"], difficulty: "high", sets: 4, reps: "15", rest: 45, instructions: "Squat thrust down, push-up, jump up with arms overhead — no pausing." },
  { name: "Mountain Climbers", category: "core", program: ["weight-loss", "beginner"], difficulty: "medium", sets: 3, reps: "30 each side", rest: 45, instructions: "High plank position, drive knees to chest alternately, keep hips level." },
  { name: "Kettlebell Swings", category: "core", program: ["weight-loss", "strength"], difficulty: "medium", sets: 4, reps: "20", rest: 60, instructions: "Hip hinge, drive hips forward to swing bell, float to chest height." },
  { name: "Box Jumps", category: "legs", program: ["weight-loss", "strength"], difficulty: "high", sets: 4, reps: "10", rest: 60, instructions: "Land softly with bent knees, step down (don't jump down) between reps." },
  { name: "Battle Ropes (Alternating)", category: "cardio", program: ["weight-loss"], difficulty: "high", sets: 5, reps: "30s on / 30s off", rest: 30, duration: 10, instructions: "Alternate arms rapidly with full hip engagement, keep waves consistent." },

  // ══════════════════════════════════════════════════════════
  // BEGINNER PROGRAM — bodyweight + light resistance
  // ══════════════════════════════════════════════════════════
  { name: "Bodyweight Squat", category: "legs", program: ["beginner"], difficulty: "low", sets: 3, reps: "15", rest: 60, instructions: "Feet shoulder-width, sit back and down, knees track over toes, stand tall." },
  { name: "Dumbbell Goblet Squat", category: "legs", program: ["beginner"], difficulty: "low", sets: 3, reps: "12", rest: 60, instructions: "Hold dumbbell at chest, squat deep, elbows inside knees at bottom." },
  { name: "Plank", category: "core", program: ["beginner", "adaptive", "strength"], difficulty: "low", sets: 3, reps: "Hold", rest: 60, duration: 1, instructions: "Forearms on floor, body straight from head to heels, breathe normally." },
  { name: "Glute Bridge", category: "legs", program: ["beginner", "adaptive"], difficulty: "low", sets: 3, reps: "15", rest: 45, instructions: "Lie on back, feet flat, drive hips up, squeeze glutes at top, hold 2s." },
  { name: "Dumbbell Row (Single Arm)", category: "back", program: ["beginner"], difficulty: "low", sets: 3, reps: "12 each", rest: 60, instructions: "Brace on bench, pull elbow to hip, keep shoulders square." },
  { name: "Seated Dumbbell Curl", category: "arms", program: ["beginner"], difficulty: "low", sets: 3, reps: "12-15", rest: 45, instructions: "Seated to eliminate swinging, full range of motion, slow and controlled." },
  { name: "Walking Lunges", category: "legs", program: ["beginner", "weight-loss"], difficulty: "low", sets: 3, reps: "20 steps", rest: 60, instructions: "Step forward, lower back knee near floor, push through front heel to step." },

  // ══════════════════════════════════════════════════════════
  // ADAPTIVE PROGRAM — low-impact, mobility, resistance bands
  // ══════════════════════════════════════════════════════════
  { name: "Cat-Cow Stretch", category: "core", program: ["adaptive"], difficulty: "low", sets: 3, reps: "10 cycles", rest: 30, instructions: "On all fours, arch back up (cat) then drop belly down (cow), breathe deeply." },
  { name: "Resistance Band Pull-Apart", category: "shoulders", program: ["adaptive", "beginner"], difficulty: "low", sets: 3, reps: "15-20", rest: 45, instructions: "Hold band at chest width, pull apart to chest level, control the return." },
  { name: "Wall Sit", category: "legs", program: ["adaptive", "beginner"], difficulty: "low", sets: 3, reps: "Hold", rest: 60, duration: 1, instructions: "Back flat against wall, thighs parallel to floor, hold for time." },
  { name: "Seated Leg Raise", category: "core", program: ["adaptive"], difficulty: "low", sets: 3, reps: "12-15", rest: 45, instructions: "Sit on chair edge, brace core, lift both legs to parallel, lower slowly." },
  { name: "Resistance Band Squat", category: "legs", program: ["adaptive"], difficulty: "low", sets: 3, reps: "15", rest: 60, instructions: "Band under feet, held at shoulders, perform standard squat with added tension." },
  { name: "Doorframe Chest Stretch", category: "core", program: ["adaptive"], difficulty: "low", sets: 3, reps: "Hold", rest: 30, duration: 1, instructions: "Arm at 90° in doorframe, lean forward gently until chest stretch is felt, hold." },
  { name: "Standing Hip Circle", category: "core", program: ["adaptive"], difficulty: "low", sets: 2, reps: "10 each direction", rest: 30, instructions: "Hands on hips, draw large circles with hips, keep upper body still." },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Clear old exercises and re-seed with program-tagged set
    await Exercise.deleteMany({});
    const result = await Exercise.insertMany(exercises);

    // Report by program
    const programCounts: Record<string, number> = {};
    for (const ex of exercises) {
      for (const p of ex.program) {
        programCounts[p] = (programCounts[p] || 0) + 1;
      }
    }

    return NextResponse.json({
      message: `✅ Seeded ${result.length} exercises with program tags.`,
      total: result.length,
      byProgram: programCounts,
    }, { status: 201 });
  } catch (error) {
    console.error("Exercise seed error:", error);
    return NextResponse.json({ message: "Error seeding exercises", error: String(error) }, { status: 500 });
  }
}
