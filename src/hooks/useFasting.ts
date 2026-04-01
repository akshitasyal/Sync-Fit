import { useState } from "react";
import { useRouter } from "next/navigation";

export function useFasting(initialStatus: boolean) {
  const [isFasting, setIsFasting] = useState(initialStatus);
  const [phase, setPhase] = useState<"idle" | "saving" | "generating" | "done">("idle");
  const router = useRouter();

  const toggleFasting = async (onToggle?: (newStatus: boolean) => void) => {
    if (phase !== "idle") return;
    const next = !isFasting;

    try {
      setPhase("saving");
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFastingMode: next }),
      });
      if (!res.ok) throw new Error("Failed to save preference");

      setIsFasting(next);
      onToggle?.(next);

      setPhase("generating");
      await fetch("/api/meal-plan/generate", { method: "POST" });

      setPhase("done");
      setTimeout(() => {
        setPhase("idle");
        router.refresh();
      }, 1200);
      
      return next;
    } catch (err) {
      console.error("Fasting toggle failed:", err);
      setPhase("idle");
      throw err;
    }
  };

  const isLoading = phase === "saving" || phase === "generating";

  return {
    isFasting,
    phase,
    isLoading,
    toggleFasting,
    setIsFasting,
  };
}
