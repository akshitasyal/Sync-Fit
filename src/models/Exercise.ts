import mongoose from 'mongoose';
import { IExercise } from "@/types/workout";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'cardio', 'mobility', 'full-body'],
    required: true 
  },
  // Which programs this exercise belongs to (an exercise can belong to multiple)
  program: [{
    type: String,
    enum: ['strength', 'weight-loss', 'cardio', 'adaptive', 'muscle-gain', 'beginner']
  }],
  difficulty: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  rest: { type: Number, default: 60 }, // rest between sets in seconds
  duration: { type: Number },          // in minutes for cardio
  instructions: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
