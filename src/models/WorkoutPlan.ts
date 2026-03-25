import mongoose from 'mongoose';

const WorkoutPlanSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  weekStartDate: { type: String, required: true },
  days: [
    {
      date: String,
      dayOfWeek: String,
      isCompleted: { type: Boolean, default: false },
      focus: String, // e.g., 'Chest + Triceps' or 'Cardio'
      exercises: [
        {
          exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
          sets: Number,
          reps: String,
          duration: Number,
          completed: { type: Boolean, default: false }
        }
      ]
    }
  ]
}, { timestamps: true });

export default mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema);
