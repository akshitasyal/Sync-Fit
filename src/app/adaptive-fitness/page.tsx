import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Adaptive Fitness Programs | Sync-Fit",
  description:
    "Experience a dynamic fitness system that continuously adjusts your workouts and diet based on your progress, feedback, and performance.",
};

const sidebarPrograms = [
  { label: "Strength Training", href: "/strength-training" },
  { label: "Weight Loss Program", href: "/weight-loss" },
  { label: "Cardio & Endurance Training", href: "/programs" },
  { label: "Group Fitness Classes", href: "/programs" },
  { label: "Muscle Building Program", href: "/programs" },
];

const benefits = [
  {
    icon: <AdjustmentsHorizontalIcon className="w-7 h-7 text-black" />,
    title: "Dynamic Plan Adjustments",
    desc: "Your workout intensity, volume, and meal targets are re-calculated automatically each week using fuzzy logic — no manual reprogramming needed.",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ArrowPathIcon className="w-7 h-7 text-black" />,
    title: "Feedback-Based Optimization",
    desc: "Post-session ratings and progress check-ins feed directly into the engine, sharpening recommendations and eliminating stagnation.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ChartBarIcon className="w-7 h-7 text-black" />,
    title: "Personalised Progress Tracking",
    desc: "Track consistency streaks, performance milestones, calorie trends, and body metrics — all in one unified real-time dashboard.",
    image:
      "https://images.unsplash.com/photo-1540496905036-5937c1064743?q=80&w=600&auto=format&fit=crop",
  },
];

const features = [
  {
    number: "01",
    title: "Dynamic Plan Adjustments",
    desc: "Plans evolve in real-time — load, reps, calories, and macros are recalculated automatically as your fitness improves.",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Feedback-Based Optimization",
    desc: "User-rated sessions improve future recommendations, ensuring the plan gets smarter with every workout.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Smart Progress Tracking",
    desc: "Monitor consistency scores, strength PRs, and calorie balance with AI-powered insights and trend analysis.",
    image:
      "https://images.unsplash.com/photo-1540496905036-5937c1064743?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "AI-Driven Personalisation",
    desc: "Fuzzy logic adapts both your workouts and diet intelligently, treating you as an individual — not a generic template.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Analyse User Profile and Goals",
    desc: "We ingest your weight, height, experience, goals, sleep quality, and activity levels to establish a comprehensive baseline.",
    icon: <UserGroupIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "02",
    title: "Generate Initial Plan",
    desc: "The `workoutPlanner` and `mealPlanner` engines collaborate to produce a fully personalised starting programme.",
    icon: <SparklesIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "03",
    title: "Collect Feedback and Progress Data",
    desc: "After each session you rate difficulty and log results — this data streams directly into the fuzzy logic engine.",
    icon: <ChartBarIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "04",
    title: "Adjust Workouts and Meals",
    desc: "Plans are recalibrated — intensity scales up or down, meal targets shift, and exercise selection is refreshed.",
    icon: <AdjustmentsHorizontalIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "05",
    title: "Continuously Optimise the System",
    desc: "The engine accumulates learning from every cycle, creating a fitness system that becomes more accurate the longer you use it.",
    icon: <CpuChipIcon className="w-5 h-5 text-black" />,
  },
];

export default function AdaptiveFitnessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1800&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Adaptive Fitness
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Adaptive Fitness Programs
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
                        className="flex items-center justify-between px-6 py-4 text-sm font-medium text-[#333] hover:text-[#111] hover:bg-[#f8f7f5] transition-colors"
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
                  <ArrowPathIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  Ready to Adapt?
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Get a fitness plan that evolves with you — generated instantly.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full"
                >
                  Start Adaptive Plan <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop"
                alt="Athlete in dynamic training session — adaptive fitness"
                className="w-full h-[480px] object-cover object-center"
              />
            </div>

            {/* Description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">Adaptive fitness</span> is more than just a workout plan — it's a living system that evolves with your body, your schedule, and your results.{" "}
                <span className="font-medium" style={{ color: "#7cb900" }}>
                  At Sync-Fit, our adaptive programs
                </span>{" "}
                use <span style={{ color: "#7cb900" }} className="font-medium">fuzzy logic-driven feedback loops</span>, real-time progress monitoring, and{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">intelligent meal and workout recalibration</span> to eliminate plateaus and keep you progressing toward{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">consistent, lasting results</span>.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether your goal is weight loss, strength gain, or overall fitness improvement, our system collects your feedback after every session and automatically refines your next plan — so you always train at the optimal intensity without the guesswork.
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
                Benefits of Adaptive Fitness
              </h2>

              <div className="space-y-8">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-full sm:w-40 h-36 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
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
                Our adaptive programs include <span style={{ color: "#7cb900" }}>real-time personalised adjustments</span> tailored to your unique progress, experience level, &amp; goals, ensuring every workout and meal is{" "}
                <span style={{ color: "#7cb900" }}>optimised for your current fitness state</span> — not a fixed template from day one.
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
                How Adaptive Fitness Works
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
                  <span className="text-[#111] font-bold tracking-widest uppercase text-xs">
                    What's Included
                  </span>
                </div>
                <ul className="space-y-4">
                  {[
                    "Real-time plan updates after every training session",
                    "Adaptive workout intensity with auto-scaling load and volume",
                    "Personalised meal adjustments based on calorie and macro progress",
                    "Consistency-based optimization that rewards your discipline",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#111] font-medium text-base">
                      <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#83b800" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Spinning stamp */}
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  Evolve
                  <br />Now
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
                  Experience Fitness That Adapts to You
                </h3>
                <p className="text-gray-400 mb-8 text-base">
                  Upgrade to a smarter fitness system that evolves with your journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Generate My Adaptive Plan <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/50 text-white font-bold py-4 px-10 rounded-full text-base transition-all hover:bg-white/5"
                  >
                    View My Program
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
