import { useState, useEffect } from "react";
import { IMealPlan, IMeal } from "@/types/meal";

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useState<IMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/meal-plan");
      if (!res.ok) throw new Error("Failed to fetch plan");
      const { data } = await res.json();
      setMealPlan(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/meal-plan/generate", { method: "POST" });
      if (!res.ok) throw new Error("Generation failed");
      await fetchMealPlan();
      setSelectedDayIndex(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    fetchMealPlan();
  }, []);

  return {
    mealPlan,
    loading,
    isGenerating,
    error,
    selectedDayIndex,
    setSelectedDayIndex,
    fetchMealPlan,
    generateMealPlan,
    setError,
  };
}
