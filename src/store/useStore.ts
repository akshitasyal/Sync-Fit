import { create } from "zustand";

interface UserState {
  age: number | null;
  height: number | null;
  weight: number | null;
  energyLevel: string;
  sleepQuality: string;
  goal: string;
  dietPreference: string;
  experienceLevel: string;
  recommendations: any;
  setProfileData: (data: Partial<UserState>) => void;
  resetProfile: () => void;
}

export const useStore = create<UserState>((set) => ({
  age: null,
  height: null,
  weight: null,
  energyLevel: "medium",
  sleepQuality: "average",
  goal: "maintenance",
  dietPreference: "Balanced Diet",
  experienceLevel: "beginner",
  recommendations: null,
  setProfileData: (data) => set((state) => ({ ...state, ...data })),
  resetProfile: () => set({
    age: null, height: null, weight: null,
    energyLevel: "medium", sleepQuality: "average", goal: "maintenance", dietPreference: "Balanced Diet",
    experienceLevel: "beginner",
    recommendations: null
  })
}));
