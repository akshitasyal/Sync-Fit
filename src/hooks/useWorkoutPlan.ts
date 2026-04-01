import { useState, useEffect } from "react";
import { IWorkoutPlan } from "@/types/workout";

export function useWorkoutPlan() {
  const [plan, setPlan] = useState<IWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workout-plan");
      if (res.status === 404 || !res.ok) {
        setPlan(null);
      } else {
        const body = await res.json();
        if (!body.data) {
          setPlan(null);
          return;
        }
        setPlan(body.data);
        const todayStr = new Date().toISOString().split("T")[0];
        const todayIdx = body.data.days.findIndex((d: any) => d.date === todayStr);
        if (todayIdx !== -1) setActiveDayIdx(todayIdx);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setGenerating(true);
      setError("");
      const res = await fetch("/api/workout-plan", { method: "POST" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Generation failed");
      }
      const result = await res.json();
      setPlan(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const toggleCompletion = async (exerciseId: string) => {
    if (!plan) return;
    const dayDate = plan.days[activeDayIdx].date;
    try {
      const res = await fetch("/api/workout-plan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayDate, exerciseId }),
      });
      if (res.ok) {
        const updated = { ...plan };
        const day = updated.days[activeDayIdx];
        const ex = day.exercises.find((e: any) => (e.exerciseId._id || e.exerciseId) === exerciseId);
        if (ex) {
          ex.completed = !ex.completed;
          day.isCompleted = day.exercises.every((e: any) => e.completed);
        }
        setPlan(updated);
      }
    } catch (err) {
      console.error("Failed to toggle completion", err);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  return {
    plan,
    loading,
    generating,
    error,
    activeDayIdx,
    setActiveDayIdx,
    fetchPlan,
    generatePlan,
    toggleCompletion,
    setError,
  };
}
