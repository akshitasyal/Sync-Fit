"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  MoonIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FastingToggle from "@/app/(authenticated)/dashboard/FastingToggle";

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

function StatCard({ label, value, unit = "" }: { label: string; value: string | number | undefined; unit?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-black text-[#111111]">
        {value ?? "—"}
        {value ? <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span> : null}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "", height: "", weight: "", gender: "male",
    energyLevel: "medium", sleepQuality: "average",
    goal: "maintenance",
    dietPreference: "Non-Vegetarian", // diet TYPE
    dietGoal: "Balanced Diet",         // macro GOAL
    experienceLevel: "beginner",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchProfile();
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const { data } = await res.json();
        setUser(data);
        if (data) {
          setForm({
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
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      if (!res.ok) throw new Error("Failed to update profile");
      const { data } = await res.json();
      setUser(data);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const bmi = user?.recommendations?.bmi;
  const bmiLabel = bmi
    ? bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"
    : null;
  const bmiColor = bmi
    ? bmi < 18.5 ? "text-blue-500" : bmi < 25 ? "text-[#111111]" : bmi < 30 ? "text-amber-500" : "text-red-500"
    : "text-gray-400";

  const dietBadgeColor: Record<string, string> = {
    Vegan: "bg-green-50 text-green-700 border-green-100",
    Vegetarian: "bg-[#c1ff00]/10 text-[#111111] border-[#c1ff00]/30",
    "Non-Vegetarian": "bg-red-50 text-red-600 border-red-100",
    Keto: "bg-purple-50 text-purple-700 border-purple-100",
    "Balanced Diet": "bg-[#c1ff00]/10 text-[#111111] border-[#c1ff00]/30",
    "High-Protein": "bg-blue-50 text-blue-700 border-blue-100",
    "Low-Carb": "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account</span>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              {session?.user?.email}
            </p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 text-sm self-start sm:self-auto"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#111] font-semibold transition-all text-sm shadow-sm self-start sm:self-auto"
            >
              <XMarkIcon className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {/* ── Success banner ──────────────────────────────── */}
        {saved && (
          <div className="p-4 bg-[#c1ff00]/10 border border-[#c1ff00]/30 rounded-2xl flex items-center gap-3 text-sm font-semibold text-[#111111]">
            <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0" />
            Profile updated and AI blueprint recalibrated successfully!
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        {/* ── VIEW MODE ───────────────────────────────────── */}
        {!editing && (
          <>
            {/* Identity card */}
            <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm flex items-center gap-5">
              <div className="w-16 h-16 bg-[#c1ff00] rounded-2xl flex items-center justify-center flex-shrink-0">
                <UserCircleIcon className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#111111]">{user?.name || "—"}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold capitalize bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">{user?.gender || "—"}</span>
                  <span className="text-[10px] font-bold capitalize bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">{user?.experienceLevel || "—"}</span>
                  {user?.dietPreference && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dietBadgeColor[user.dietPreference] || "bg-gray-100 text-gray-600"}`}>
                      {user.dietPreference}
                    </span>
                  )}
                  {user?.dietGoal && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dietBadgeColor[user.dietGoal] || "bg-gray-100 text-gray-600"}`}>
                      {user.dietGoal}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Body Stats */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Body Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Age" value={user?.age} unit="yrs" />
                <StatCard label="Height" value={user?.height} unit="cm" />
                <StatCard label="Weight" value={user?.weight} unit="kg" />
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">BMI</p>
                  <p className={`text-xl font-black ${bmiColor}`}>
                    {bmi ?? "—"}
                    {bmiLabel && <span className="text-xs font-normal text-gray-400 ml-1">{bmiLabel}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {user?.recommendations && (
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">AI Blueprint</h3>
                <div className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#c1ff00] rounded-xl flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-black text-[#111111]">Fuzzy Logic Engine Output</p>
                      <p className="text-xs text-gray-400">Auto-recalculates when you update your profile</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#c1ff00]/5 border border-[#c1ff00]/20 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Daily Calories</p>
                      <p className="text-2xl font-black text-[#111111]">{user.recommendations.recommendedCalories}</p>
                      <p className="text-xs text-gray-400">kcal / day</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Diet Type</p>
                      <p className="text-lg font-black text-[#111111] capitalize">{user.recommendations.dietType}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Workout Intensity</p>
                      <p className="text-lg font-black text-[#111111] capitalize">{user.recommendations.workoutIntensity}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lifestyle Snapshot */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Lifestyle</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <FireIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Energy</p>
                    <p className="font-bold text-[#111111] capitalize">{user?.energyLevel || "—"}</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <MoonIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sleep</p>
                    <p className="font-bold text-[#111111] capitalize">{user?.sleepQuality || "—"}</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <ChartBarIcon className="w-5 h-5 text-[#c1ff00] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Goal</p>
                    <p className="font-bold text-[#111111] capitalize">{user?.goal || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fasting Mode */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Fasting Tracker</h3>
              <FastingToggle initialStatus={user?.isFastingMode || false} />
            </div>

            {/* Quick link to full setup */}
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#c1ff00] rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(193,255,0,0.5)]">
                  <BoltIcon className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-[#111111] text-sm">Need to redo your full onboarding?</p>
                  <p className="text-xs text-gray-400">Re-run the complete step-by-step profile wizard.</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/onboarding/setup")}
                className="px-4 py-2.5 bg-[#111111] hover:bg-[#333] text-white font-bold rounded-xl text-xs transition-all flex-shrink-0"
              >
                Re-setup →
              </button>
            </div>
          </>
        )}

        {/* ── EDIT MODE ───────────────────────────────────── */}
        {editing && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Body Metrics card */}
            <div className="bg-white border border-gray-100 rounded-[30px] p-7 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-base font-black text-[#111111]">Body Metrics</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Age (years)">
                  <input type="number" min="12" max="100" required placeholder="e.g. 25"
                    className={inputCls} value={form.age} onChange={(e) => set("age", e.target.value)} />
                </Field>
                <Field label="Gender">
                  <select className={inputCls} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Height (cm)">
                  <input type="number" min="100" max="250" required placeholder="e.g. 175"
                    className={inputCls} value={form.height} onChange={(e) => set("height", e.target.value)} />
                </Field>
                <Field label="Weight (kg)">
                  <input type="number" min="30" max="300" required placeholder="e.g. 70"
                    className={inputCls} value={form.weight} onChange={(e) => set("weight", e.target.value)} />
                </Field>
              </div>
            </div>

            {/* Lifestyle card */}
            <div className="bg-white border border-gray-100 rounded-[30px] p-7 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-base font-black text-[#111111]">Lifestyle Factors</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Energy Level">
                  <select className={inputCls} value={form.energyLevel} onChange={(e) => set("energyLevel", e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </Field>
                <Field label="Sleep Quality">
                  <select className={inputCls} value={form.sleepQuality} onChange={(e) => set("sleepQuality", e.target.value)}>
                    <option value="poor">Poor</option>
                    <option value="average">Average</option>
                    <option value="good">Good</option>
                  </select>
                </Field>
                <Field label="Experience Level">
                  <select className={inputCls} value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Preferences card */}
            <div className="bg-white border border-gray-100 rounded-[30px] p-7 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <h2 className="text-base font-black text-[#111111]">Fitness Preferences</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <option value="Vegan">🌱 Vegan</option>
                  </select>
                </Field>
                <Field label="Macro Goal">
                  <select className={inputCls} value={form.dietGoal} onChange={(e) => set("dietGoal", e.target.value)}>
                    <option value="Balanced Diet">🥗 Balanced Diet</option>
                    <option value="High-Protein">💪 High-Protein</option>
                    <option value="Low-Carb">📉 Low-Carb</option>
                    <option value="Keto">🥑 Keto</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(false)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#111] font-semibold transition-all text-sm shadow-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#333] text-white font-bold rounded-xl transition-all text-sm shadow-lg disabled:opacity-50">
                {saving ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-white animate-spin" /> Saving…</>
                ) : (
                  <><SparklesIcon className="w-4 h-4" /> Save & Recalibrate</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
