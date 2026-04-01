import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  SparklesIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  CpuChipIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Beginner Smart Start | Sync-Fit",
  description:
    "Start your fitness journey with simple, guided plans designed for beginners. Sync-Fit adapts to your pace, ensuring safe and steady progress.",
};

const sidebarPrograms = [
  { label: "Strength Training", href: "/strength-training" },
  { label: "Weight Loss Program", href: "/weight-loss" },
  { label: "Cardio & Endurance Training", href: "/programs" },
  { label: "Group Fitness Classes", href: "/programs" },
  { label: "Muscle Building Program", href: "/muscle-gain" },
  { label: "Beginner Smart Start", href: "/beginner-start", active: true },
];

const benefits = [
  {
    icon: <HeartIcon className="w-7 h-7 text-black" />,
    title: "Beginner-Friendly Workouts",
    desc: "Low-intensity, form-focused exercises chosen by `workoutPlanner.ts` — every movement is explained clearly so you build confidence with every session.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <SparklesIcon className="w-7 h-7 text-black" />,
    title: "Simple, Easy-to-Follow Meal Plans",
    desc: "Straightforward, balanced meals from `mealPlanner.ts` — no complex macros, no extreme diets. Just clean food choices that fuel your early progress.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ArrowTrendingUpIcon className="w-7 h-7 text-black" />,
    title: "Gradual Progression System",
    desc: "Our fuzzy logic engine monitors consistency and performance, steadily increasing workout difficulty and calorie targets as your fitness improves — no sudden jumps.",
    image:
      "https://images.unsplash.com/photo-1540496905036-5937c1064743?q=80&w=600&auto=format&fit=crop",
  },
];

const features = [
  {
    number: "01",
    title: "Beginner-Friendly Workouts",
    desc: "Simple bodyweight and light-resistance exercises with clear guidance — designed to build form, confidence, and consistency from day one.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Simple Meal Plans",
    desc: "Easy, balanced diet recommendations that require no cooking expertise — just real food that keeps you energised and on track.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Gradual Progression",
    desc: "Difficulty scales up automatically as your consistency improves — the system ensures you're always challenged but never overwhelmed.",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Habit Building System",
    desc: "Streak tracking, daily reminders, and routine-forming features keep you consistent — because habits are the foundation of lasting results.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Analyse User Fitness Level",
    desc: "We collect your activity history, mobility, and current fitness level to assign the right starting intensity — not too hard, not too easy.",
    icon: <UserGroupIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "02",
    title: "Assign Light Workouts",
    desc: "`workoutPlanner.ts` assigns low-intensity, full-body sessions with rest days built in to prevent injury and establish healthy habits.",
    icon: <HeartIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "03",
    title: "Provide Simple Meal Plan",
    desc: "`mealPlanner.ts` generates a straightforward, calorie-appropriate diet with easy-to-prepare meals and flexible food swaps.",
    icon: <SparklesIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "04",
    title: "Track Consistency",
    desc: "The system monitors your workout completion rate, daily activity, and meal adherence — rewarding streaks and identifying gaps.",
    icon: <CalendarDaysIcon className="w-5 h-5 text-black" />,
  },
  {
    step: "05",
    title: "Gradually Increase Difficulty",
    desc: "Once consistency thresholds are met, the fuzzy logic engine promotes you to the next tier — adding volume, intensity, or complexity incrementally.",
    icon: <AdjustmentsHorizontalIcon className="w-5 h-5 text-black" />,
  },
];

export default function BeginnerStartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1800&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Beginner Smart Start
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Beginner Smart Start
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
                  <StarIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  New to Fitness?
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Get your beginner-friendly plan built in seconds — no experience needed.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full"
                >
                  Start My Journey <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">

            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop"
                alt="Beginner doing light fitness workout"
                className="w-full h-[480px] object-cover object-center"
              />
            </div>

            {/* Intro Description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">Starting your fitness journey</span> can feel overwhelming — but it doesn't have to be. Sync-Fit's{" "}
                <span className="font-medium" style={{ color: "#7cb900" }}>
                  Beginner Smart Start program
                </span>{" "}
                uses <span style={{ color: "#7cb900" }} className="font-medium">fuzzy logic to assess your current fitness level</span> and assigns{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">safe, manageable workouts and simple meal plans</span> so you build real habits and{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">gain confidence from day one</span>.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                No intimidating gym routines, no complex macros — just a smart, encouraging system that meets you exactly where you are and gradually walks you toward a fitter, healthier you at a pace that sticks.
              </p>
            </div>

            {/* ── BENEFITS ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">Why It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4 leading-tight">
                Designed for Beginners, Built for Confidence
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-2xl">
                Sync-Fit helps beginners build <span style={{ color: "#7cb900" }}>consistency without confusion</span>. Using fuzzy logic, the system assigns light workouts, simple meals, and{" "}
                <span style={{ color: "#7cb900" }}>gradually increases difficulty</span> as your fitness improves.
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
                Our beginner programs are built to be <span style={{ color: "#7cb900" }}>approachable, structured, and progressive</span> — giving you the right amount of challenge at every stage without the confusion or overwhelm that stops most beginners before they start.
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
                How Beginner Smart Start Works
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
                    "Step-by-step guidance for every exercise and meal",
                    "Low-intensity training that protects your joints and builds form",
                    "Safe progression system that unlocks harder tiers as you improve",
                    "Consistency tracking with streaks, reminders, and milestone rewards",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#111] font-medium text-base">
                      <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#83b800" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  Start
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
                  Start Your Fitness Journey Today
                </h3>
                <p className="text-gray-400 mb-8 text-base">
                  Build confidence and consistency with a smart beginner-friendly system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Begin My Smart Start Plan <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-transparent border border-white/20 hover:border-white/50 text-white font-bold py-4 px-10 rounded-full text-base transition-all hover:bg-white/5"
                  >
                    Explore Beginner Plan
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
