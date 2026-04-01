"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  FireIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

// ─── Constants ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Body Metrics", icon: UserCircleIcon },
  { id: 2, label: "Lifestyle", icon: FireIcon },
  { id: 3, label: "Preferences", icon: SparklesIcon },
];

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#111111] placeholder-gray-300 focus:ring-2 focus:ring-[#c1ff00]/50 focus:border-[#c1ff00] focus:outline-none transition-all text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function OnboardingSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    energyLevel: "medium",
    sleepQuality: "average",
    goal: "maintenance",
    dietPreference: "Non-Vegetarian", // Diet TYPE
    dietGoal: "Balanced Diet",        // Macro GOAL
    experienceLevel: "beginner",
  });

  // Pre-fill from DB
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setForm((prev) => ({
            ...prev,
            age: data.age?.toString() || "",
            height: data.height?.toString() || "",
            weight: data.weight?.toString() || "",
            gender: data.gender || "male",
            energyLevel: data.energyLevel || "medium",
            sleepQuality: data.sleepQuality || "average",
            goal: data.goal || "maintenance",
            dietPreference: data.dietPreference || "Non-Vegetarian",
            dietGoal: data.dietGoal || "Balanced Diet",
            experienceLevel: data.experienceLevel || "beginner",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const set = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  // Step-specific validation — no HTML `required`, all manual
  const canAdvance = (): boolean => {
    if (step === 1) return !!(form.age && form.height && form.weight);
    if (step === 2) return !!(form.energyLevel && form.sleepQuality);
    return !!(form.goal && form.dietPreference && form.experienceLevel);
  };

  // Only called explicitly by the Save button on step 3
  const handleSave = async () => {
    if (step !== 3) return; // safety guard — should never happen
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(form.age),
          height: parseInt(form.height),
          weight: parseInt(form.weight),
          gender: form.gender,
          energyLevel: form.energyLevel,
          sleepQuality: form.sleepQuality,
          goal: form.goal,
          dietPreference: form.dietPreference,
          dietGoal: form.dietGoal,
          experienceLevel: form.experienceLevel,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setSaved(true);
      setTimeout(() => router.push("/dashboard/today"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / Success screens ──────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#c1ff00] rounded-full flex items-center justify-center mx-auto">
            <CheckCircleIcon className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-2xl font-black text-[#111111]">Profile Saved!</h2>
          <p className="text-gray-400 text-sm">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex-grow bg-[#f8f7f5] py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#c1ff00] rounded-lg flex items-center justify-center flex-shrink-0">
              <BoltIcon className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-[#111111] text-lg tracking-tight">
              Sync<span className="text-gray-400">Fit</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mt-4">
            {form.age ? "Edit Your Profile" : "Build Your Profile"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Our AI uses this data to calibrate your personal fitness blueprint.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                    isDone ? "bg-[#c1ff00] border-[#c1ff00]"
                    : isCurrent ? "bg-white border-[#c1ff00] shadow-[0_0_0_4px_rgba(193,255,0,0.15)]"
                    : "bg-white border-gray-200"
                  }`}>
                    {isDone
                      ? <CheckCircleIcon className="w-5 h-5 text-black" />
                      : <Icon className={`w-5 h-5 ${isCurrent ? "text-[#111111]" : "text-gray-300"}`} />
                    }
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? "text-[#111111]" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-5 mx-2 rounded-full transition-all ${step > s.id ? "bg-[#c1ff00]" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        {/* 
          ╔══════════════════════════════════════════════╗
          ║  NO <form> wrapper here — that was the bug.  ║
          ║  Each step is plain divs. Only the Save      ║
          ║  button calls handleSave() explicitly.       ║
          ╚══════════════════════════════════════════════╝
        */}

        {/* Step content card */}
        <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm space-y-6">

          {/* ── STEP 1: Body Metrics ──────────────────────── */}
          {step === 1 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-lg font-black text-[#111111]">Body Metrics</h2>
                </div>
                <p className="text-sm text-gray-400">Used to calculate your BMI and caloric needs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Age (years)">
                  <input
                    type="number" min="12" max="100"
                    placeholder="e.g. 25"
                    className={inputCls}
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                  />
                </Field>
                <Field label="Gender">
                  <select className={inputCls} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Height (cm)">
                  <input
                    type="number" min="100" max="250"
                    placeholder="e.g. 175"
                    className={inputCls}
                    value={form.height}
                    onChange={(e) => set("height", e.target.value)}
                  />
                </Field>
                <Field label="Weight (kg)">
                  <input
                    type="number" min="30" max="300"
                    placeholder="e.g. 70"
                    className={inputCls}
                    value={form.weight}
                    onChange={(e) => set("weight", e.target.value)}
                  />
                </Field>
              </div>

              {/* BMI preview */}
              {form.height && form.weight && (
                <div className="bg-[#c1ff00]/5 border border-[#c1ff00]/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#c1ff00] rounded-xl flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">BMI Preview</p>
                    <p className="text-xl font-black text-[#111111]">
                      {(parseInt(form.weight) / Math.pow(parseInt(form.height) / 100, 2)).toFixed(1)}
                      <span className="text-sm font-normal text-gray-400 ml-2">
                        {(() => {
                          const b = parseInt(form.weight) / Math.pow(parseInt(form.height) / 100, 2);
                          return b < 18.5 ? "Underweight" : b < 25 ? "Normal" : b < 30 ? "Overweight" : "Obese";
                        })()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── STEP 2: Lifestyle ────────────────────────── */}
          {step === 2 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-lg font-black text-[#111111]">Lifestyle Factors</h2>
                </div>
                <p className="text-sm text-gray-400">Helps our AI fine-tune workout intensity and recovery.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Daily Energy Level">
                  <select className={inputCls} value={form.energyLevel} onChange={(e) => set("energyLevel", e.target.value)}>
                    <option value="low">🔋 Low — Sedentary, easily fatigued</option>
                    <option value="medium">⚡ Medium — Moderate activity</option>
                    <option value="high">🚀 High — Very active &amp; energetic</option>
                  </select>
                </Field>
                <Field label="Sleep Quality">
                  <select className={inputCls} value={form.sleepQuality} onChange={(e) => set("sleepQuality", e.target.value)}>
                    <option value="poor">😴 Poor — Under 5 hrs, broken sleep</option>
                    <option value="average">😊 Average — 6–7 hrs</option>
                    <option value="good">✨ Good — 8+ hrs, restful</option>
                  </select>
                </Field>
                <Field label="Experience Level">
                  <select className={inputCls} value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                    <option value="beginner">🌱 Beginner — New to training</option>
                    <option value="intermediate">💪 Intermediate — 1–2 years exp</option>
                    <option value="advanced">🏆 Advanced — 3+ years / Athlete</option>
                  </select>
                </Field>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Why this matters</p>
                <p className="text-sm text-gray-600">
                  Your energy level and sleep quality feed our Fuzzy Logic Engine — it dynamically adapts your workout intensity so you never overtrain or underperform.
                </p>
              </div>
            </>
          )}

          {/* ── STEP 3: Preferences ──────────────────────── */}
          {step === 3 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-lg font-black text-[#111111]">Fitness Preferences</h2>
                </div>
                <p className="text-sm text-gray-400">Personalises your meal plan and workout split.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Fitness Goal">
                  <select className={inputCls} value={form.goal} onChange={(e) => set("goal", e.target.value)}>
                    <option value="weight loss">🔥 Lose Weight</option>
                    <option value="maintenance">⚖️ Stay Fit</option>
                    <option value="muscle gain">💪 Build Muscle</option>
                  </select>
                </Field>
                <Field label="Diet Type">
                  <select className={inputCls} value={form.dietPreference} onChange={(e) => set("dietPreference", e.target.value)}>
                    <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                    <option value="Vegetarian">🌿 Vegetarian</option>
                    <option value="Vegan">🌱 Vegan (100% Plant-based)</option>
                  </select>
                </Field>
                <Field label="Macro Goal">
                  <select className={inputCls} value={form.dietGoal} onChange={(e) => set("dietGoal", e.target.value)}>
                    <option value="Balanced Diet">🥗 Balanced Diet</option>
                    <option value="High-Protein">💪 High-Protein</option>
                    <option value="Low-Carb">📉 Low-Carb</option>
                    <option value="Keto">🥑 Ketogenic</option>
                  </select>
                </Field>
              </div>

              {/* Summary confirmation */}
              <div className="bg-[#c1ff00]/5 border border-[#c1ff00]/20 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Review Your Profile</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Age",        value: `${form.age} yrs` },
                    { label: "Height",     value: `${form.height} cm` },
                    { label: "Weight",     value: `${form.weight} kg` },
                    { label: "Energy",     value: form.energyLevel },
                    { label: "Sleep",      value: form.sleepQuality },
                    { label: "Experience", value: form.experienceLevel },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
                      <p className="text-sm font-bold text-[#111111] capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation — completely outside any form tag */}
        <div className="flex justify-between items-center">
          {/* Back button */}
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#111111] hover:border-gray-300 font-semibold transition-all text-sm shadow-sm"
            >
              <ChevronLeftIcon className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {/* Continue (steps 1–2) or Save Profile (step 3) */}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => { if (canAdvance()) setStep((s) => s + 1); }}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-8 py-3 bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
            >
              Continue <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting || !canAdvance()}
              className="flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#333] text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-white animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Save &amp; Generate Blueprint
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
