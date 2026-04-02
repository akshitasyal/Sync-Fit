import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FireIcon,
  ChartBarIcon,
  SparklesIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TrophyIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { PROGRAM_IMAGES } from "@/constants/program-mapping";

export const metadata = {
  title: "Muscle Gain System | Sync-Fit",
  description:
    "Build muscle efficiently with intelligent strength training and high-protein nutrition plans tailored to your body, performance, and recovery.",
};

const sidebarPrograms = [
  { label: "Smart Strength Training", href: "/strength-training" },
  { label: "Intelligent Weight Loss Plan", href: "/weight-loss" },
  { label: "Cardio & Endurance Optimization", href: "/cardio-endurance" },
  { label: "Adaptive Fitness Programs", href: "/adaptive-fitness" },
  { label: "Muscle Gain System", href: "/muscle-gain", active: true },
  { label: "Beginner Smart Start", href: "/beginner-start" },
];

const benefits = [
  {
    icon: <BeakerIcon className="w-7 h-7 text-black" />,
    title: "Protein-Optimized Nutrition",
    desc: "Our `mealPlanner` engine builds protein-first meal plans, calculating your exact daily target based on lean body mass and hypertrophy goals — real food, no supplements required.",
    image: PROGRAM_IMAGES.muscleGain.benefits[0],
  },
  {
    icon: <BoltIcon className="w-7 h-7 text-black" />,
    title: "Strength-Focused Training",
    desc: "Progressive overload is embedded into every mesocycle. The fuzzy logic engine auto-adjusts sets, reps, and load so you're always training at maximum growth stimulus.",
    image: PROGRAM_IMAGES.muscleGain.benefits[1],
  },
  {
    icon: <ShieldCheckIcon className="w-7 h-7 text-black" />,
    title: "Recovery-Based Planning",
    desc: "Intelligent rest day scheduling, deload week insertion, and sleep-quality weighting ensure your muscles repair fully and grow faster without overtraining risk.",
    image: PROGRAM_IMAGES.muscleGain.benefits[2],
  },
];

const features = [
  {
    number: "01",
    title: "Protein-Optimized Diet",
    desc: "High-protein meal plans from `mealPlanner.ts` prioritise the right macros for maximum muscle protein synthesis every day.",
    image: PROGRAM_IMAGES.muscleGain.features[0],
  },
  {
    number: "02",
    title: "Strength Training Plans",
    desc: "Structured compound-lift programs with auto-scaling progressive overload, built by `workoutPlanner.ts` for your experience level.",
    image: PROGRAM_IMAGES.muscleGain.features[1],
  },
  {
    number: "03",
    title: "Recovery Optimization",
    desc: "Smart deload scheduling and rest-day allocation prevent overtraining and maximise muscle repair between sessions.",
    image: PROGRAM_IMAGES.muscleGain.features[2],
  },
  {
    number: "04",
    title: "Adaptive Growth System",
    desc: "Calorie surplus, protein targets, and training intensity are recalibrated weekly as you gain muscle and get stronger.",
    image: PROGRAM_IMAGES.muscleGain.features[3],
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Analyse User Profile and Goal",
    desc: "We collect your height, weight, experience tier, and muscle-gain targets to define a hypertrophy-optimised baseline.",
    icon: <UserGroupIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "02",
    title: "Apply Fuzzy Logic for Intensity and Calories",
    desc: "The engine infers your ideal caloric surplus and training stress — enough to build muscle without excessive fat gain.",
    icon: <CpuChipIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "03",
    title: "Generate Protein-Focused Meal Plan",
    desc: "`mealPlanner.ts` builds a high-protein, calorie-surplus diet with varied real-food choices and balanced micronutrients.",
    icon: <BeakerIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "04",
    title: "Assign Strength Workouts",
    desc: "`workoutPlanner.ts` generates a structured weekly split with compound movements, progressive overload, and muscle-group targeting.",
    icon: <BoltIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "05",
    title: "Optimise Recovery and Track Progress",
    desc: "Session feedback retrains the engine weekly — ensuring continuous muscle growth, smarter recovery, and eliminated stagnation.",
    icon: <AdjustmentsHorizontalIcon className="w-5 h-5 text-black" />,
  },
];

export default function MuscleGainPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${PROGRAM_IMAGES.muscleGain.main}')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Muscle Gain System
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Muscle Gain System
              </p>
              <div className="w-2 h-2 rounded-full bg-[#c1ff00] mt-10" />
            </nav>
          </div>
        </section>
      </div>

      {/* ── Main Content: Sidebar + Article ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 w-full">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-full lg:w-[300px] flex-shrink-0">
            <div className="sticky top-24">
              {/* Program List Card */}
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
                <div className="bg-[#c1ff00] px-6 py-5">
                  <h3 className="text-[#111] font-bold text-lg tracking-tight">
                    Explore Our Programs
                  </h3>
                </div>
                <ul className="bg-white divide-y divide-gray-100">
                  {sidebarPrograms.map((p) => (
                    <li key={p.label}>
                      <Link
                        href={p.href}
                        className={`flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors ${
                          p.active
                            ? "text-[#c1ff00] bg-[#111] font-bold"
                            : "text-[#333] hover:text-[#111] hover:bg-[#f8f7f5]"
                        }`}
                      >
                        {p.label}
                        <ArrowRightIcon className="w-4 h-4 flex-shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar CTA Card */}
              <div className="bg-[#0b0c10] rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1ff00]/10 blur-[40px] rounded-full" />
                <div className="w-16 h-16 bg-[#c1ff00] rounded-full mx-auto flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(193,255,0,0.3)]">
                  <FireIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  Ready to Build Muscle?
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Generate your personalised muscle-gain plan instantly.
                </p>
                <Link
                  href="/workout"
                  className="inline-flex items-center justify-center gap-2 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full"
                >
                  Start Muscle Plan <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
              <img
                src={PROGRAM_IMAGES.muscleGain.main}
                alt="Athlete performing heavy barbell lifts — muscle gain"
                className="w-full h-[480px] object-cover object-center"
              />
            </div>

            {/* Intro description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">AI-Powered Muscle Gain</span> is more than lifting heavy — it's a structured, science-backed approach to building lean mass, improving strength, and optimising every recovery window.{" "}
                <span className="font-medium" style={{ color: "#7cb900" }}>
                  At Sync-Fit, our Muscle Gain System
                </span>{" "}
                combines <span style={{ color: "#7cb900" }} className="font-medium">fuzzy logic-driven intensity calibration</span>, high-protein meal generation, and{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">adaptive progressive overload programming</span> to accelerate hypertrophy safely and sustainably.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're starting from scratch or pushing past a stubborn plateau, our engine continuously re-evaluates your plan — ensuring you always train at the right volume, eat the right macros, and recover at the optimal pace for consistent muscle growth.
              </p>
            </div>

            {/* ── BENEFITS ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">Why It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4 leading-tight">
                Engineered for Real Muscle Growth
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-2xl">
                Sync-Fit combines <span style={{ color: "#7cb900" }}>strength training</span>, protein-focused nutrition, and fuzzy logic to deliver structured muscle-building plans. The system{" "}
                <span style={{ color: "#7cb900" }}>continuously adapts</span> based on your progress, ensuring consistent hypertrophy.
              </p>

              <div className="space-y-8">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-full sm:w-40 h-36 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#c1ff00] flex items-center justify-center flex-shrink-0">
                          {b.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[#111]">{b.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PROGRAM FEATURES ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">What You Get</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4 leading-tight">
                Program features
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl">
                Our muscle gain programs include <span style={{ color: "#7cb900" }}>personalised hypertrophy plans</span> tailored to your body type, training experience, &amp; protein targets, ensuring every session and meal is{" "}
                <span style={{ color: "#7cb900" }}>optimised for maximum muscle growth</span> without unnecessary fat accumulation.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {features.map((f) => (
                  <div
                    key={f.number}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-10 h-10 bg-[#c1ff00] rounded-full flex items-center justify-center font-bold text-sm text-black shadow">
                        {f.number}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#111] mb-2">{f.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WORKFLOW ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">The Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                How Our Muscle Gain System Works
              </h2>
              <div className="space-y-6">
                {workflowSteps.map(({ step, title, desc, icon }) => (
                  <div
                    key={step}
                    className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c1ff00] flex items-center justify-center mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#83b800" }}>
                        Step {step}
                      </span>
                      <h4 className="text-base font-bold text-[#111] mb-1">{title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── HIGHLIGHT BOX ── */}
            <div className="mb-16">
              <div className="relative border-2 border-[#c1ff00] rounded-3xl p-8 bg-white">
                <div className="inline-flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                  <span className="text-[#111] font-bold tracking-widest uppercase text-xs">What's Included</span>
                </div>
                <ul className="space-y-4">
                  {[
                    "Protein-priority meal selection for optimal muscle protein synthesis",
                    "Progressive overload tracking built into every training block",
                    "Smart recovery system with deload week scheduling",
                    "Calorie surplus planning to maximise lean mass gain",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#111] font-medium text-base">
                      <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#83b800" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  Grow
                  <br />Strong
                </div>
              </div>
            </div>

            {/* ── FINAL CTA ── */}
            <div className="bg-[#0b0c10] rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#c1ff00]/10 blur-[70px] rounded-full" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#c1ff00] rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(193,255,0,0.3)]">
                  <TrophyIcon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                  Start Building Muscle the Smart Way
                </h3>
                <p className="text-gray-400 mb-8 text-base">
                  Train smarter, recover better, and grow faster with Sync-Fit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Generate My Muscle Plan <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/meal-plan"
                    className="inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/50 text-white font-bold py-4 px-10 rounded-full text-base transition-all hover:bg-white/5"
                  >
                    View Workout Plan
                  </Link>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
