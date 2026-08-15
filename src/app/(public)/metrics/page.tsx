"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ScaleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  HeartIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import {
  BeakerIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  getFitnessRecommendation,
  Gender,
  ActivityLevel,
  FitnessGoal,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
} from "@/services/recommendationEngine";

const GOAL_OPTIONS: {
  id: FitnessGoal;
  label: string;
  subtitle: string;
  icon: string;
  tag: string;
}[] = [
  {
    id: "build_muscle",
    label: "Build Lean Muscle",
    subtitle: "Maximize hypertrophy & functional strength",
    icon: "🏋️",
    tag: "High Protein",
  },
  {
    id: "lose_fat",
    label: "Lose Fat",
    subtitle: "Accelerate fat loss while shielding muscle",
    icon: "🔥",
    tag: "Calorie Deficit",
  },
  {
    id: "body_recomp",
    label: "Body Recomposition",
    subtitle: "Simultaneously drop fat and build lean tissue",
    icon: "⚡",
    tag: "Metabolic Shift",
  },
  {
    id: "maintain_weight",
    label: "Maintain Weight",
    subtitle: "Sustain composition & optimize energy",
    icon: "⚖️",
    tag: "Isocaloric",
  },
  {
    id: "improve_fitness",
    label: "Improve Overall Fitness",
    subtitle: "Boost VO2 max, stamina & full-body resilience",
    icon: "🚀",
    tag: "Athletic Conditioning",
  },
];

const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: "sedentary", label: "Sedentary", desc: "Desk job, little/no exercise" },
  { id: "light", label: "Lightly Active", desc: "Light workouts 1–3 days/wk" },
  { id: "moderate", label: "Moderately Active", desc: "Solid training 3–5 days/wk" },
  { id: "very_active", label: "Very Active", desc: "Intense training 6–7 days/wk" },
  { id: "extra_active", label: "Extremely Active", desc: "Heavy physical work / 2x daily" },
];

export default function MetricsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Unit System
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Core Form Metrics
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(25);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<FitnessGoal>("build_muscle");

  // Metric values
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);

  // Imperial values
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(158);

  const [savingBlueprint, setSavingBlueprint] = useState(false);

  // Load existing profile data if logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            if (data.gender) setGender(data.gender);
            if (data.age) setAge(Number(data.age));
            if (data.height) {
              const h = Number(data.height);
              setHeightCm(h);
              const { feet, inches } = cmToFeetInches(h);
              setHeightFt(feet);
              setHeightIn(inches);
            }
            if (data.weight) {
              const w = Number(data.weight);
              setWeightKg(w);
              setWeightLbs(kgToLbs(w));
            }
            if (data.goal) {
              if (data.goal === "weight loss") setGoal("lose_fat");
              else if (data.goal === "muscle gain") setGoal("build_muscle");
              else if (data.goal === "maintenance") setGoal("maintain_weight");
            }
          }
        })
        .catch(() => {});
    }
  }, [session]);

  // Sync Metric to Imperial
  const updateMetricHeight = (cm: number) => {
    const clamped = Math.max(100, Math.min(250, cm));
    setHeightCm(clamped);
    const { feet, inches } = cmToFeetInches(clamped);
    setHeightFt(feet);
    setHeightIn(inches);
  };

  const updateMetricWeight = (kg: number) => {
    const clamped = Math.max(30, Math.min(250, kg));
    setWeightKg(clamped);
    setWeightLbs(kgToLbs(clamped));
  };

  // Sync Imperial to Metric
  const updateImperialHeight = (ft: number, inc: number) => {
    setHeightFt(ft);
    setHeightIn(inc);
    const cm = feetInchesToCm(ft, inc);
    setHeightCm(cm);
  };

  const updateImperialWeight = (lbs: number) => {
    const clamped = Math.max(66, Math.min(550, lbs));
    setWeightLbs(clamped);
    setWeightKg(lbsToKg(clamped));
  };

  // Instant reactive recommendation
  const recommendation = useMemo(() => {
    return getFitnessRecommendation({
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goal,
      experienceLevel: "beginner",
    });
  }, [age, gender, heightCm, weightKg, activityLevel, goal]);

  // Handle CTA
  const handleGenerateBlueprint = async () => {
    setSavingBlueprint(true);
    try {
      // Save locally to store / localStorage for guest or logged-in persistence
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "syncfit_metrics_blueprint",
          JSON.stringify({
            age,
            gender,
            heightCm,
            weightKg,
            activityLevel,
            goal,
            recommendation,
          })
        );
      }

      if (session) {
        // Map to API goal format
        let mappedGoal = "maintenance";
        if (goal === "lose_fat") mappedGoal = "weight loss";
        else if (goal === "build_muscle") mappedGoal = "muscle gain";

        await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age,
            height: heightCm,
            weight: weightKg,
            gender,
            energyLevel: activityLevel === "sedentary" ? "low" : activityLevel === "extra_active" ? "high" : "medium",
            sleepQuality: "average",
            goal: mappedGoal,
            dietPreference: "Non-Vegetarian",
            dietGoal: "High-Protein",
            experienceLevel: "beginner",
          }),
        });
        router.push("/dashboard");
      } else {
        router.push("/signup?from=metrics");
      }
    } catch {
      router.push("/signup?from=metrics");
    } finally {
      setSavingBlueprint(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#c1ff00]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">

        {/* ── Section Header ────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#1a1c23] border border-white/10 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#c1ff00] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c1ff00]">
              Biometric Intelligence Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Body Composition &amp; Fitness Direction
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            SyncFit interprets your biometrics to calculate your BMI, daily energy expenditure, and a personalized fitness strategy tailored to your exact physique goal.
          </p>
        </div>

        {/* ── Two Column Layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════════════════════════════════════════════════════════════
              LEFT PANEL: Form Controls & Biometrics Input (5 Cols)
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 bg-[#14161d] border border-white/10 rounded-[28px] p-6 sm:p-8 space-y-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c1ff00]/5 blur-3xl pointer-events-none" />

            {/* Header + Unit System Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ScaleIcon className="w-5 h-5 text-[#c1ff00]" />
                <h2 className="font-bold text-lg text-white">Your Metrics</h2>
              </div>

              {/* Toggle Metric / Imperial */}
              <div className="flex bg-[#0b0c10] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setUnitSystem("metric")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    unitSystem === "metric"
                      ? "bg-[#c1ff00] text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem("imperial")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    unitSystem === "imperial"
                      ? "bg-[#c1ff00] text-black shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["male", "female", "other"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                      gender === g
                        ? "bg-[#c1ff00]/15 border-[#c1ff00] text-[#c1ff00] shadow-[0_0_12px_rgba(193,255,0,0.2)]"
                        : "bg-[#1a1c23] border-white/5 text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {g === "male" ? "♂ Male" : g === "female" ? "♀ Female" : "⚧ Other"}
                  </button>
                ))}
              </div>
            </div>

            {/* Age & Activity Level Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Age
                  </label>
                  <span className="text-xs font-black text-[#c1ff00]">{age} yrs</span>
                </div>
                <input
                  type="number"
                  min={14}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Math.max(14, Math.min(90, Number(e.target.value) || 20)))}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-2.5 text-white font-semibold focus:border-[#c1ff00] focus:outline-none text-sm"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-3 py-2.5 text-white font-medium text-xs focus:border-[#c1ff00] focus:outline-none truncate"
                >
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#14161d] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Height
                </label>
                <span className="text-xs font-black text-[#c1ff00]">
                  {unitSystem === "metric"
                    ? `${heightCm} cm`
                    : `${heightFt} ft ${heightIn} in (${heightCm} cm)`}
                </span>
              </div>

              {unitSystem === "metric" ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={120}
                    max={225}
                    value={heightCm}
                    onChange={(e) => updateMetricHeight(Number(e.target.value))}
                    className="w-full accent-[#c1ff00] cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={100}
                      max={250}
                      value={heightCm}
                      onChange={(e) => updateMetricHeight(Number(e.target.value))}
                      className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-2 text-white font-semibold text-sm focus:border-[#c1ff00] focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-500">cm</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-[#1a1c23] border border-white/10 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min={3}
                      max={7}
                      value={heightFt}
                      onChange={(e) => updateImperialHeight(Number(e.target.value), heightIn)}
                      className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 font-bold">ft</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1a1c23] border border-white/10 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(e) => updateImperialHeight(heightFt, Number(e.target.value))}
                      className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 font-bold">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Weight
                </label>
                <span className="text-xs font-black text-[#c1ff00]">
                  {unitSystem === "metric"
                    ? `${weightKg} kg (${weightLbs} lbs)`
                    : `${weightLbs} lbs (${weightKg} kg)`}
                </span>
              </div>

              {unitSystem === "metric" ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={40}
                    max={180}
                    value={weightKg}
                    onChange={(e) => updateMetricWeight(Number(e.target.value))}
                    className="w-full accent-[#c1ff00] cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={30}
                      max={250}
                      value={weightKg}
                      onChange={(e) => updateMetricWeight(Number(e.target.value))}
                      className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-2 text-white font-semibold text-sm focus:border-[#c1ff00] focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-500">kg</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={90}
                    max={400}
                    value={weightLbs}
                    onChange={(e) => updateImperialWeight(Number(e.target.value))}
                    className="w-full accent-[#c1ff00] cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={60}
                      max={550}
                      value={weightLbs}
                      onChange={(e) => updateImperialWeight(Number(e.target.value))}
                      className="w-full bg-[#1a1c23] border border-white/10 rounded-xl px-4 py-2 text-white font-semibold text-sm focus:border-[#c1ff00] focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-500">lbs</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── NEW FEATURE 1: What's your primary goal? ────────────── */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-[#c1ff00]">
                  What's your primary goal?
                </label>
                <span className="text-[10px] text-gray-400">Drives fitness direction</span>
              </div>

              <div className="space-y-2">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#c1ff00]/10 border-[#c1ff00] shadow-[0_0_15px_rgba(193,255,0,0.15)] ring-1 ring-[#c1ff00]/40"
                          : "bg-[#1a1c23]/70 border-white/5 hover:border-white/20 hover:bg-[#1a1c23]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0">{g.icon}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                            {g.label}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{g.subtitle}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                          isSelected
                            ? "bg-[#c1ff00] text-black border-[#c1ff00]"
                            : "bg-white/5 text-gray-400 border-white/10"
                        }`}
                      >
                        {g.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA in Left Column */}
            <button
              onClick={handleGenerateBlueprint}
              disabled={savingBlueprint}
              className="w-full bg-[#c1ff00] hover:bg-[#aadf00] text-black font-extrabold py-4 px-6 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(193,255,0,0.35)] flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {savingBlueprint ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Generating Your Blueprint…
                </>
              ) : (
                <>
                  <span>Generate My Blueprint</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT PANEL: Live Intelligence & Fitness Direction (7 Cols)
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. YOUR BODY COMPOSITION & BMI Scale */}
            <div className="bg-[#14161d] border border-white/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SparklesIcon className="w-4 h-4 text-[#c1ff00]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Your Body Composition
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    BMI {recommendation.bmi}
                    <span className="text-base font-normal text-gray-400 ml-2">
                      kg/m²
                    </span>
                  </h3>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider self-start sm:self-auto ${recommendation.bmiBadgeColor}`}>
                  ● {recommendation.bmiCategory} Range
                </div>
              </div>

              {/* BMI Visual Scale */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-400">
                  <span>Underweight (&lt;18.5)</span>
                  <span className="text-[#c1ff00]">Healthy (18.5–24.9)</span>
                  <span className="text-amber-400">Overweight (25–29.9)</span>
                  <span className="text-rose-400">Obese (30+)</span>
                </div>

                {/* Multi-segmented Gradient Track */}
                <div className="relative w-full h-3.5 bg-[#1a1c23] rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div className="h-full w-1/4 bg-gradient-to-r from-sky-500 to-sky-400 rounded-l-full" />
                  <div className="h-full w-1/4 bg-gradient-to-r from-[#c1ff00] to-emerald-400" />
                  <div className="h-full w-1/4 bg-gradient-to-r from-amber-400 to-orange-500" />
                  <div className="h-full w-1/4 bg-gradient-to-r from-rose-500 to-red-600 rounded-r-full" />
                </div>

                {/* Marker Needle */}
                <div className="relative w-full h-6">
                  <div
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${Math.max(4, Math.min(96, recommendation.bmiGaugePercentage))}%` }}
                  >
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white" />
                    <span className="text-[10px] font-extrabold text-black bg-white px-2 py-0.5 rounded-full shadow-md mt-0.5">
                      {recommendation.bmi}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. NEW FEATURE 2: YOUR FITNESS DIRECTION (Hero Insight Panel) */}
            <div className="bg-gradient-to-br from-[#161922] via-[#14161d] to-[#0d0f14] border-2 border-[#c1ff00]/40 rounded-[30px] p-6 sm:p-8 space-y-6 shadow-[0_10px_35px_-10px_rgba(193,255,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#c1ff00]/10 blur-[60px] pointer-events-none rounded-full" />

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c1ff00]/15 border border-[#c1ff00]/40 text-[#c1ff00] text-[10px] font-black uppercase tracking-widest">
                    <BoltIcon className="w-3.5 h-3.5" />
                    Your Fitness Direction
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {recommendation.direction}
                  </h3>
                  <p className="text-xs text-[#c1ff00] font-semibold">{recommendation.tagline}</p>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Match Rate</span>
                  <span className="text-xl font-black text-[#c1ff00]">{recommendation.confidence}%</span>
                </div>
              </div>

              {/* Intelligent Narrative */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed bg-[#0b0c10]/60 p-4 rounded-2xl border border-white/5">
                "{recommendation.description}"
              </p>

              {/* 5-Attribute Dynamic Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#1a1c23]/80 border border-white/5 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    🎯 Primary Focus
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {recommendation.primaryFocus}
                  </p>
                </div>

                <div className="bg-[#1a1c23]/80 border border-white/5 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    🥗 Nutrition Strategy
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {recommendation.nutritionStrategy}
                  </p>
                </div>

                <div className="bg-[#1a1c23]/80 border border-white/5 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    🏋️ Training Strategy
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {recommendation.trainingStrategy}
                  </p>
                </div>

                <div className="bg-[#1a1c23]/80 border border-white/5 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    🔥 Calorie Strategy
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {recommendation.calorieStrategy}
                  </p>
                </div>

                <div className="bg-[#1a1c23]/80 border border-white/5 p-3.5 rounded-2xl space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    🏃 Cardio Recommendation
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {recommendation.cardioRecommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. DAILY CALORIES + WATER TARGET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Calorie Estimate */}
              <div className="bg-[#14161d] border border-white/10 rounded-[28px] p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Daily Calorie Target
                  </span>
                  <FireIcon className="w-5 h-5 text-[#c1ff00]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {recommendation.recommendedDailyCalories}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">kcal / day</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    BMR: {recommendation.bmr} kcal · TDEE: {recommendation.tdee} kcal
                  </p>
                </div>
              </div>

              {/* Water Target */}
              <div className="bg-[#14161d] border border-white/10 rounded-[28px] p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Hydration Target
                  </span>
                  <BeakerIcon className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {unitSystem === "metric"
                        ? `${recommendation.recommendedDailyWaterLiters} L`
                        : `${recommendation.recommendedDailyWaterOz} oz`}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">per day</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Supports metabolic rate, muscle recovery &amp; hydration
                  </p>
                </div>
              </div>
            </div>

            {/* 4. RECOMMENDED WORKOUT (Dynamic Protocol) */}
            <div className="bg-[#14161d] border border-white/10 rounded-[28px] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Recommended Workout
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {recommendation.workoutRecommendation.title}
                  </h4>
                </div>
                <span className="text-xs font-extrabold bg-[#c1ff00]/10 text-[#c1ff00] border border-[#c1ff00]/30 px-3 py-1.5 rounded-xl">
                  {recommendation.workoutRecommendation.frequency}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-gray-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#c1ff00] flex-shrink-0 mt-0.5" />
                  <span><strong>Structure:</strong> {recommendation.workoutRecommendation.splitType}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#c1ff00] flex-shrink-0 mt-0.5" />
                  <span><strong>Style:</strong> {recommendation.workoutRecommendation.trainingStyle}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#c1ff00] flex-shrink-0 mt-0.5" />
                  <span><strong>Overload Rule:</strong> {recommendation.workoutRecommendation.progressiveOverload}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#c1ff00] flex-shrink-0 mt-0.5" />
                  <span><strong>Cardio Integration:</strong> {recommendation.workoutRecommendation.cardioProtocol}</span>
                </div>
              </div>

              {/* Target Focus Areas Pills */}
              <div className="pt-2 flex flex-wrap gap-2">
                {recommendation.workoutRecommendation.focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold bg-[#1a1c23] text-gray-300 border border-white/10 px-3 py-1 rounded-full"
                  >
                    ⚡ {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Card */}
            <div className="bg-gradient-to-r from-[#1a1c23] to-[#14161d] border border-white/10 p-6 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-base">Ready to start your custom plan?</h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  We will generate your complete weekly meal plan and workout routine.
                </p>
              </div>
              <button
                onClick={handleGenerateBlueprint}
                disabled={savingBlueprint}
                className="bg-[#c1ff00] hover:bg-[#aadf00] text-black font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all hover:scale-105 shadow-[0_4px_15px_rgba(193,255,0,0.3)] flex-shrink-0 flex items-center gap-2"
              >
                <span>Generate My Blueprint</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Non-medical Disclaimer */}
            <p className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5 pt-2">
              <InformationCircleIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              SyncFit biometrics are fitness recommendations based on user-provided metrics, not medical diagnosis.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
