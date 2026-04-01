import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FireIcon,
  ChartBarIcon,
  SparklesIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  ScaleIcon,
  CpuChipIcon,
  UserGroupIcon,
  BoltIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Intelligent Weight Loss Plan | Sync-Fit",
  description:
    "AI-powered weight loss plans built with fuzzy logic, calorie optimization, and adaptive fat-burning workouts tailored to your body.",
};

const sidebarPrograms = [
  { label: "Strength Training", href: "/strength-training" },
  { label: "Weight Loss Program", href: "/weight-loss", active: true },
  { label: "Cardio & Endurance Training", href: "/programs" },
  { label: "Group Fitness Classes", href: "/programs" },
  { label: "Muscle Building Program", href: "/programs" },
];

const benefits = [
  {
    icon: <FireIcon className="w-7 h-7 text-black" />,
    title: "Smart Calorie Deficit",
    desc: "Our fuzzy logic engine calculates the optimal calorie deficit for your BMI, metabolism, and fat loss goals — no guesswork, no extreme restriction.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <HeartIcon className="w-7 h-7 text-black" />,
    title: "Adaptive Fat-Burning Workouts",
    desc: "HIIT, cardio, and strength sessions are blended and auto-scaled each week to maximise fat loss while protecting lean muscle mass.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ChartBarIcon className="w-7 h-7 text-black" />,
    title: "Sustainable Long-Term Results",
    desc: "Rather than crash diets, Sync-Fit builds habits — progressive calorie targets, balanced meals, and consistency-based progression that lasts.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
  },
];

const features = [
  {
    number: "01",
    title: "Calorie Optimization Engine",
    desc: "Smart deficit calculation based on BMI, goals, activity level, and energy data from your profile.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Fat-Burning Workout Plans",
    desc: "HIIT, cardio, and resistance training dynamically combined for maximum fat loss efficiency.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Adaptive Diet Planning",
    desc: "Meal plans from our `mealPlanner` engine adjust your macros and calories weekly based on actual progress.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Real-Time Progress Tracking",
    desc: "Monitor weight, calories, exercise consistency, and body metrics with live dashboard updates.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Analyse User Profile",
    desc: "We collect your BMI, goal weight, energy levels, sleep, and lifestyle to build a precise fat-loss baseline.",
    icon: <UserGroupIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "02",
    title: "Calculate Calorie Deficit via Fuzzy Logic",
    desc: "Our engine infers your optimal daily deficit by weighing multiple soft variables — no one-size-fits-all approach.",
    icon: <CpuChipIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "03",
    title: "Generate Personalised Meal Plan",
    desc: "The `mealPlanner` builds a balanced, calorie-controlled diet — real food, no extreme restriction.",
    icon: <SparklesIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "04",
    title: "Assign Fat-Burning Workouts",
    desc: "The `workoutPlanner` assigns tailored HIIT and cardio sessions based on your capacity and schedule.",
    icon: <BoltIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "05",
    title: "Continuously Adapt to Progress",
    desc: "Weekly check-ins and feedback retrain the engine — your plan evolves as your body does.",
    icon: <AdjustmentsHorizontalIcon className="w-5 h-5 text-black" />,
  },
];

export default function WeightLossPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=1800&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Weight Loss Program
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Weight Loss Program
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

              {/* CTA Card */}
              <div className="bg-[#0b0c10] rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1ff00]/10 blur-[40px] rounded-full" />
                <div className="w-16 h-16 bg-[#c1ff00] rounded-full mx-auto flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(193,255,0,0.3)]">
                  <ScaleIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  Ready to Lose Weight?
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Get your personalised fat-loss plan generated in seconds.
                </p>
                <Link
                  href="/meal-plan"
                  className="inline-flex items-center justify-center gap-2 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full"
                >
                  Get My Plan <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1400&auto=format&fit=crop"
                alt="Person doing cardio — weight loss training"
                className="w-full h-[480px] object-cover object-center"
              />
            </div>

            {/* Description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">Weight loss</span> is more than cutting calories — it's a structured approach to changing your body composition, improving metabolic health, and building habits that last.{" "}
                <span className="font-medium" style={{ color: "#7cb900" }}>
                  At Sync-Fit, our programs
                </span>{" "}
                use <span style={{ color: "#7cb900" }} className="font-medium">fuzzy logic-driven calorie analysis</span>, adaptive workout planning, and{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">personalised meal strategies</span> to help you lose fat safely, stay consistent, and achieve{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">lasting results</span>.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're 5 kg or 30 kg from your goal, our adaptive engine continuously rewrites your plan — balancing your calorie deficit, training intensity, and recovery to keep progress moving without burnout.
              </p>
            </div>

            {/* ── BENEFITS SECTION ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">
                  Why It Works
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                Benefits of our Weight Loss Program
              </h2>

              <div className="space-y-8">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-40 h-36 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Text */}
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

            {/* ── PROGRAM FEATURES SECTION ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">
                  What You Get
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4 leading-tight">
                Program features
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl">
                Our weight loss programs include <span style={{ color: "#7cb900" }}>personalised calorie plans</span> tailored to your unique goals, metabolism, &amp; lifestyle, ensuring every session and meal is{" "}
                <span style={{ color: "#7cb900" }}>optimised for maximum fat loss</span> without sacrificing energy or performance.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-12">
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

            {/* ── WORKFLOW SECTION ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">
                  The Process
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                How Our Weight Loss System Works
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
                      <span className="text-[#83b800] text-xs font-bold uppercase tracking-widest">
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
                  <span className="text-[#111] font-bold tracking-widest uppercase text-xs">
                    What's Included
                  </span>
                </div>
                <ul className="space-y-4">
                  {[
                    "Smart calorie tracking system with real-time deficit calculation",
                    "Balanced nutrition planning — no extreme dieting",
                    "Adaptive fat-loss strategy that evolves with your progress",
                    "Weekly progress optimization powered by fuzzy logic",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#111] font-medium text-base"
                    >
                      <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#83b800" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Spinning stamp */}
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  Burn
                  <br />Fat
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
                  Start Your Smart Weight Loss Journey Today
                </h3>
                <p className="text-gray-400 mb-8 text-base">
                  Achieve sustainable fat loss with a system that adapts to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/meal-plan"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Generate My Weight Loss Plan <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/50 text-white font-bold py-4 px-10 rounded-full text-base transition-all hover:bg-white/5"
                  >
                    View Fat-Burning Workouts
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
