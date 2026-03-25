import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Exercise from "@/models/Exercise";
import WorkoutPlan from "@/models/WorkoutPlan";

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

export const generateWeeklyWorkoutPlan = async (userEmail: string) => {
  await connectToDatabase();
  const user = await User.findOne({ email: userEmail }).lean() as any;
  if (!user || !user.recommendations) throw new Error("Profile incomplete");

  let intensity = (user.recommendations?.workoutIntensity || "medium").toLowerCase(); 
  const goal = user.goal || "maintenance";

  // Adaptive Feedback: Adjust Intensity
  if (user.workoutFeedback === "too-hard") {
    if (intensity === "high") intensity = "medium";
    else if (intensity === "medium") intensity = "low";
  } else if (user.workoutFeedback === "too-easy") {
    if (intensity === "low") intensity = "medium";
    else if (intensity === "medium") intensity = "high";
  }

  const dislikedIds = user.dislikedExercises?.map((id: any) => id.toString()) || [];
  const allExercises = await Exercise.find({ _id: { $nin: dislikedIds } }).lean() as any[];
  
  if (allExercises.length === 0) {
    if(dislikedIds.length > 0) {
        // Fallback: If user disliked EVERYTHING, show a few anyway
        const fallback = await Exercise.find().limit(10).lean() as any[];
        allExercises.push(...fallback);
    } else {
        throw new Error("No exercises in database");
    }
  }

  const weekDays = getNext7Days();
  const weekStartDate = weekDays[0].date;
  const weeklyData = [];

  // Logic for Splits based on Goal
  const getSplitForDay = (dayIndex: number, goal: string) => {
    if (goal === "muscle gain") {
      const splits = [
        { focus: "Chest + Triceps", categories: ["chest", "arms"] },
        { focus: "Back + Biceps", categories: ["back", "arms"] },
        { focus: "Legs", categories: ["legs"] },
        { focus: "Shoulders + Core", categories: ["shoulders", "core"] },
        { focus: "Rest", categories: [] },
        { focus: "Full Body / Cardio", categories: ["chest", "back", "legs", "cardio"] },
        { focus: "Rest", categories: [] }
      ];
      return splits[dayIndex];
    } else if (goal === "weight loss") {
      const splits = [
        { focus: "HIIT Cardio + Core", categories: ["cardio", "core"] },
        { focus: "Full Body Light", categories: ["chest", "back", "legs"] },
        { focus: "LISS Cardio", categories: ["cardio"] },
        { focus: "HIIT Cardio + Core", categories: ["cardio", "core"] },
        { focus: "Full Body Light", categories: ["chest", "back", "legs"] },
        { focus: "Active Recovery", categories: ["cardio"] },
        { focus: "Rest", categories: [] }
      ];
      return splits[dayIndex];
    } else {
      // maintenance / balanced
      const splits = [
        { focus: "Upper Body", categories: ["chest", "back", "shoulders"] },
        { focus: "Lower Body", categories: ["legs"] },
        { focus: "Cardio + Core", categories: ["cardio", "core"] },
        { focus: "Upper Body", categories: ["chest", "back", "arms"] },
        { focus: "Lower Body", categories: ["legs"] },
        { focus: "Moderate Cardio", categories: ["cardio"] },
        { focus: "Rest", categories: [] }
      ];
      return splits[dayIndex];
    }
  };

  const adjustStats = (exercise: any, intensity: string) => {
    let sets = exercise.sets;
    let reps = exercise.reps;
    let duration = exercise.duration;

    if (intensity === "low") {
      sets = Math.max(2, sets - 1);
      if (typeof reps === "string" && reps.includes("-")) {
        reps = "12-15";
      }
      if (duration) duration = Math.max(10, duration - 5);
    } else if (intensity === "high") {
      sets = sets + 1;
      if (exercise.category !== "cardio" && typeof reps === "string" && reps.includes("-")) {
        reps = "6-8"; // Heavier
      }
      if (duration) duration = duration + 10;
    }

    return { sets, reps, duration };
  };

  for (let i = 0; i < 7; i++) {
    const d = weekDays[i];
    const split = getSplitForDay(i, goal);
    const dayExercises: any[] = [];

    if (split.focus !== "Rest") {
      // Experience-based Scaling
      const experience = user.experienceLevel || "beginner";
      let numExercises = intensity === "low" ? 3 : intensity === "high" ? 6 : 4;
      
      if (experience === "beginner") numExercises = Math.max(2, numExercises - 1);
      else if (experience === "advanced") numExercises = numExercises + 1;
      
      const pool = allExercises.filter(ex => split.categories.includes(ex.category));
      
      // Shuffle pool
      const shuffled = pool.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numExercises);
      
      selected.forEach(ex => {
        let stats = adjustStats(ex, intensity);
        
        // Final Experience adjustment
        if (experience === "beginner") {
          stats.sets = Math.max(2, stats.sets - 1);
        } else if (experience === "advanced") {
          stats.sets = stats.sets + 1;
        }

        dayExercises.push({
          exerciseId: ex._id,
          ...stats,
          completed: false
        });
      });
    }

    weeklyData.push({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      isCompleted: false,
      focus: split.focus,
      exercises: dayExercises
    });
  }

  let newPlan = await WorkoutPlan.findOne({ userEmail, weekStartDate });
  
  if (newPlan) {
    newPlan.days = weeklyData;
    await newPlan.save();
  } else {
    newPlan = new WorkoutPlan({
      userEmail,
      weekStartDate,
      days: weeklyData
    });
    await newPlan.save();
  }

  return newPlan;
};
