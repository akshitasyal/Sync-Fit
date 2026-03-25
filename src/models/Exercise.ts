import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'cardio'],
    required: true 
  },
  difficulty: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  duration: { type: Number }, // in minutes for cardio
  instructions: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
