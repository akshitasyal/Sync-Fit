import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  BoltIcon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Strength Training | Sync-Fit",
  description:
    "AI-powered strength training plans built for maximum results using fuzzy logic and personalized workout generation.",
};

const sidebarPrograms = [
  { label: "Strength Training", href: "/strength-training", active: true },
  { label: "Weight Loss Program", href: "/programs" },
  { label: "Cardio & Endurance Training", href: "/programs" },
  { label: "Group Fitness Classes", href: "/programs" },
  { label: "Muscle Building Program", href: "/programs" },
];

const benefits = [
  {
    icon: <FireIcon className="w-7 h-7 text-black" />,
    title: "Increased Muscle Strength",
    desc: "Progressive overload driven by our fuzzy logic engine ensures you build real, lasting strength — session by session.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ShieldCheckIcon className="w-7 h-7 text-black" />,
    title: "Better Posture & Wellness",
    desc: "Targeted muscle group optimization corrects imbalances, improving posture and overall physical wellness.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: <ChartBarIcon className="w-7 h-7 text-black" />,
    title: "Faster Metabolism",
    desc: "Strength training increases lean mass, elevating your resting metabolic rate so you burn more calories around the clock.",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
  },
];

const features = [
  {
    number: "01",
    title: "Personalized Workout Generator",
    desc: "Fuzzy logic analyses your profile — weight, experience, goals — and builds a complete weekly plan instantly.",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Adaptive Intensity Scaling",
    desc: "Volume and load auto-adjust each session based on your performance feedback, ensuring safe progressive overload.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Smart Progress Tracking",
    desc: "Track PRs, volume milestones, and streak consistency with real-time dashboards and AI-driven insights.",
    image:
      "https://images.unsplash.com/photo-1540496905036-5937c1064743?q=80&w=600&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Experience-Based Tiers",
    desc: "From beginner to advanced, workouts intelligently scale with your fitness experience and long-term progression.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
  },
];

export default function StrengthTrainingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner (matching programs page style) ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1800&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/55 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Strength Training
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Strength Training
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
                        className={`flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors ${p.active
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
                  <TrophyIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  Ready to Start Training?
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Generate your personalised strength plan in seconds.
                </p>
                <Link
                  href="/workout"
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
                src="https://images.unsplash.com/photo-1514994667-2e9e6f4bd0f2?q=80&w=1400&auto=format&fit=crop"
                alt="Athlete doing battle ropes — strength training"
                className="w-full h-[480px] object-cover object-top"
              />
            </div>

            {/* Description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">Strength training</span> is more than just lifting weights — it's a structured approach to building muscle, increasing endurance, and enhancing overall body performance.{" "}
                <span className="text-[#c1ff00] font-semibold" style={{ color: "#7cb900" }}>
                  At Sync-Fit, our programs
                </span>{" "}
                combine <span style={{ color: "#7cb900" }} className="font-medium">science-based exercises</span>, adaptive load management, and{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">expert-guided progressions</span> to help you train smarter, stay consistent, and achieve{" "}
                <span style={{ color: "#7cb900" }} className="font-medium">lasting results</span>.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're a complete beginner or a seasoned lifter, our fuzzy logic engine continuously adapts your plan — analysing your fitness level, recovery, and goals to deliver the most effective training stimulus at every session.
              </p>
            </div>

            {/* ── BENEFITS SECTION ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">Why Strength Training</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                Benefits of strength training
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
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">What You Get</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                Program features
              </h2>

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

              {/* Highlight checklist */}
              <div className="relative border-2 border-[#c1ff00] rounded-3xl p-8 bg-white mb-10">
                <ul className="space-y-4">
                  {[
                    "Goal-based training with AI-driven plan generation",
                    "Progressive overload built into every mesocycle",
                    "Recovery optimization to eliminate burnout",
                    "Muscle group targeting based on your weak points",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#111] font-medium text-base">
                      <CheckCircleIcon className="w-6 h-6 text-[#83b800] fill-none flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Spinning stamp */}
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  Train
                  <br />Smarter
                </div>
              </div>

              {/* Final inline CTA */}
              <div className="bg-[#0b0c10] rounded-3xl p-10 text-center relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#c1ff00]/10 blur-[70px] rounded-full" />
                <div className="relative z-10">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                    Start Building Strength the Smart Way
                  </h3>
                  <p className="text-gray-400 mb-8 text-base">
                    Your AI-powered personalised strength plan is one click away.
                  </p>
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Generate My Workout Plan <ArrowRightIcon className="w-5 h-5" />
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
