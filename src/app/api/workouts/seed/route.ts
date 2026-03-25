import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Exercise from "@/models/Exercise";

const generateExercises = () => {
  const e = [];
  
  // CHEST
  e.push({ name: "Barbell Bench Press", category: "chest", difficulty: "high", sets: 4, reps: "8-12", instructions: "Lie on bench, lower barbell to mid-chest, push back up." });
  e.push({ name: "Incline Dumbbell Press", category: "chest", difficulty: "medium", sets: 3, reps: "10-12", instructions: "Set bench to 30 degrees, press dumbbells overhead." });
  e.push({ name: "Push-ups", category: "chest", difficulty: "low", sets: 3, reps: "AMRAP", instructions: "Keep body straight, lower until chest touches floor." });
  e.push({ name: "Cable Crossovers", category: "chest", difficulty: "medium", sets: 3, reps: "12-15", instructions: "Pull cables together in front of chest." });
  e.push({ name: "Pec Deck Machine", category: "chest", difficulty: "low", sets: 3, reps: "12-15", instructions: "Squeeze handles together focusing on chest contraction." });
  e.push({ name: "Decline Bench Press", category: "chest", difficulty: "high", sets: 4, reps: "8-10", instructions: "Lower barbell to lower chest on a decline bench." });
  
  // BACK
  e.push({ name: "Deadlifts", category: "back", difficulty: "high", sets: 4, reps: "5-8", instructions: "Keep back straight, lift barbell from ground by extending hips." });
  e.push({ name: "Pull-ups", category: "back", difficulty: "high", sets: 3, reps: "AMRAP", instructions: "Pull body up until chin clears the bar." });
  e.push({ name: "Lat Pulldowns", category: "back", difficulty: "low", sets: 3, reps: "10-12", instructions: "Pull bar down to upper chest while arching back slightly." });
  e.push({ name: "Barbell Rows", category: "back", difficulty: "medium", sets: 4, reps: "8-12", instructions: "Hinge at hips, pull barbell to lower stomach." });
  e.push({ name: "Seated Cable Rows", category: "back", difficulty: "low", sets: 3, reps: "12-15", instructions: "Pull handle to abdomen, squeeze shoulder blades." });
  e.push({ name: "Dumbbell Shrugs", category: "back", difficulty: "low", sets: 3, reps: "15-20", instructions: "Hold dumbbells at side, shrug shoulders to ears." });

  // LEGS
  e.push({ name: "Barbell Squats", category: "legs", difficulty: "high", sets: 4, reps: "8-10", instructions: "Bar on upper back, descend until thighs are parallel." });
  e.push({ name: "Leg Press", category: "legs", difficulty: "medium", sets: 4, reps: "10-12", instructions: "Push platform fully, do not lock knees." });
  e.push({ name: "Romanian Deadlifts", category: "legs", difficulty: "high", sets: 3, reps: "10-12", instructions: "Slight knee bend, hinge at hips feeling hamstring stretch." });
  e.push({ name: "Leg Extensions", category: "legs", difficulty: "low", sets: 3, reps: "15", instructions: "Extend legs fully against the machine pad." });
  e.push({ name: "Lying Leg Curls", category: "legs", difficulty: "low", sets: 3, reps: "12-15", instructions: "Curl pad toward glutes." });
  e.push({ name: "Walking Lunges", category: "legs", difficulty: "medium", sets: 3, reps: "20 steps", instructions: "Step forward, lowering back knee near ground." });
  e.push({ name: "Standing Calf Raises", category: "legs", difficulty: "low", sets: 4, reps: "15-20", instructions: "Push up on toes, pause, lower slowly." });

  // SHOULDERS
  e.push({ name: "Overhead Press", category: "shoulders", difficulty: "high", sets: 4, reps: "8-10", instructions: "Press barbell from clavicle to full lockout overhead." });
  e.push({ name: "Dumbbell Lateral Raises", category: "shoulders", difficulty: "low", sets: 4, reps: "15", instructions: "Raise dumbbells to side until parallel to floor." });
  e.push({ name: "Front Raises", category: "shoulders", difficulty: "low", sets: 3, reps: "12", instructions: "Raise weight straight in front of you." });
  e.push({ name: "Reverse Pec Deck", category: "shoulders", difficulty: "medium", sets: 3, reps: "15", instructions: "Fly backward to target rear deltoids." });
  e.push({ name: "Face Pulls", category: "shoulders", difficulty: "medium", sets: 3, reps: "15", instructions: "Pull rope attachment to forehead." });

  // ARMS
  e.push({ name: "Barbell Curls", category: "arms", difficulty: "medium", sets: 3, reps: "10-12", instructions: "Curl barbell up without swinging." });
  e.push({ name: "Tricep Rope Pushdowns", category: "arms", difficulty: "low", sets: 3, reps: "12-15", instructions: "Push rope down, spreading ends at the bottom." });
  e.push({ name: "Hammer Curls", category: "arms", difficulty: "low", sets: 3, reps: "12", instructions: "Neutral grip curl targeting brachialis." });
  e.push({ name: "Skullcrushers", category: "arms", difficulty: "high", sets: 3, reps: "10-12", instructions: "Lie on bench, lower EZ bar to forehead, extend up." });
  e.push({ name: "Overhead Tricep Extension", category: "arms", difficulty: "medium", sets: 3, reps: "12", instructions: "Extend dumbbell over head." });

  // CORE
  e.push({ name: "Plank", category: "core", difficulty: "low", sets: 3, reps: "Hold", duration: 1, instructions: "Hold straight body line resting on forearms." });
  e.push({ name: "Hanging Leg Raises", category: "core", difficulty: "high", sets: 3, reps: "10-15", instructions: "Hang from bar, raise legs parallel to floor." });
  e.push({ name: "Russian Twists", category: "core", difficulty: "medium", sets: 3, reps: "20", instructions: "Sit on floor, lean back, twist torso side to side." });
  e.push({ name: "Cable Crunches", category: "core", difficulty: "medium", sets: 3, reps: "15", instructions: "Kneel holding rope, crunch down rounding lower back." });
  e.push({ name: "Ab Wheel Rollouts", category: "core", difficulty: "high", sets: 3, reps: "10", instructions: "Roll wheel out keeping core tight, pull back." });

  // CARDIO & HIIT
  e.push({ name: "Treadmill Sprints (HIIT)", category: "cardio", difficulty: "high", sets: 1, reps: "Intervals", duration: 15, instructions: "30s max sprint, 30s walk repeat." });
  e.push({ name: "Stairmaster", category: "cardio", difficulty: "medium", sets: 1, reps: "LISS", duration: 20, instructions: "Maintain steady medium pace." });
  e.push({ name: "Rowing Machine", category: "cardio", difficulty: "high", sets: 1, reps: "LISS", duration: 15, instructions: "Drive with legs, pull with arms." });
  e.push({ name: "Incline Treadmill Walk", category: "cardio", difficulty: "low", sets: 1, reps: "LISS", duration: 30, instructions: "Set incline to 12%, walk at 3mph." });
  e.push({ name: "Cycling", category: "cardio", difficulty: "low", sets: 1, reps: "LISS", duration: 30, instructions: "Moderate resistance steady state." });
  e.push({ name: "Jump Rope", category: "cardio", difficulty: "medium", sets: 5, reps: "Minutes", duration: 10, instructions: "Continuous bouncing, land soft." });

  return e;
};

export async function GET() {
  try {
    await connectToDatabase();
    await Exercise.deleteMany({});
    const newExercises = generateExercises();
    await Exercise.insertMany(newExercises);
    return NextResponse.json({ message: `Successfully seeded ${newExercises.length} targeted exercises!` }, { status: 201 });
  } catch (error) {
    console.error("Exercise seed error:", error);
    return NextResponse.json({ message: "Error seeding exercises" }, { status: 500 });
  }
}
