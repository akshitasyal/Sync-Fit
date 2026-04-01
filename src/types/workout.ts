import { Types } from "mongoose";

export interface IExercise {
  _id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'cardio' | 'mobility' | 'full-body';
  program: ('strength' | 'weight-loss' | 'cardio' | 'adaptive' | 'muscle-gain' | 'beginner')[];
  difficulty: 'low' | 'medium' | 'high';
  sets: number;
  reps: string;
  rest: number;
  duration?: number;
  instructions: string;
  image?: string;
}

export interface IWorkoutExercise {
  exerciseId: IExercise | string;
  sets: number;
  reps: string;
  duration?: number;
  completed: boolean;
}

export interface IWorkoutDay {
  date: string;
  dayOfWeek: string;
  isCompleted: boolean;
  focus: string;
  exercises: IWorkoutExercise[];
}

export interface IWorkoutPlan {
  _id: string;
  userEmail: string;
  weekStartDate: string;
  days: IWorkoutDay[];
}
