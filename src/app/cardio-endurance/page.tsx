import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  HeartIcon,
  ChartBarIcon,
  BoltIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TrophyIcon,
  FireIcon,
  MapIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { PROGRAM_IMAGES } from "@/constants/program-mapping";

export const metadata = {
  title: "Cardio & Endurance | Sync-Fit",
  description:
    "Boost stamina and metabolic health with AI-powered cardio routines adjusted based on your energy levels and recovery patterns.",
};

const sidebarPrograms = [
  { label: "Smart Strength Training", href: "/strength-training" },
  { label: "Intelligent Weight Loss Plan", href: "/weight-loss" },
  { label: "Cardio & Endurance Optimization", href: "/cardio-endurance", active: true },
  { label: "Adaptive Fitness Programs", href: "/adaptive-fitness" },
  { label: "Muscle Gain System", href: "/muscle-gain" },
  { label: "Beginner Smart Start", href: "/beginner-start" },
];

const benefits = [
  {
    icon: <HeartIcon className="w-7 h-7 text-black" />,
    title: "Enhanced Cardiovascular Health",
    desc: "Strengthen your heart and lungs with routines that push your aerobic capacity safely using fuzzy logic scaling.",
    image: PROGRAM_IMAGES.cardio.benefits[0],
  },
  {
    icon: <FireIcon className="w-7 h-7 text-black" />,
    title: "Maximized Calorie Burn",
    desc: "High-intensity intervals combined with steady-state cardio to keep your metabolism elevated long after the workout.",
    image: PROGRAM_IMAGES.cardio.benefits[1],
  },
  {
    icon: <TrophyIcon className="w-7 h-7 text-black" />,
    title: "Superior Stamina",
    desc: "Whether it's for a marathon or daily life, our endurance protocols build the aerobic engine you've always wanted.",
    image: PROGRAM_IMAGES.cardio.benefits[2],
  },
];

const features = [
  {
    number: "01",
    title: "Smart Heart Rate Zones",
    desc: "Workouts are auto-adjusted to keep you in the optimal zone based on your real-time recovery and energy scores.",
    image: PROGRAM_IMAGES.cardio.features[0],
  },
  {
    number: "02",
    title: "Adaptive Interval Training",
    desc: "HIIT sessions that evolve — as you get fitter, the intervals get tougher, ensuring you never plateau.",
    image: PROGRAM_IMAGES.cardio.features[1],
  },
  {
    number: "03",
    title: "Endurance Nutrition Mapping",
    desc: "Fuel your long sessions correctly with meal plans that prioritize glycogen replenishment and sustained energy.",
    image: PROGRAM_IMAGES.cardio.features[2],
  },
  {
    number: "04",
    title: "Recovery-First Scheduling",
    desc: "Our AI ensures you don't overtrain by intelligently spacing out high-impact cardio sessions with active recovery.",
    image: PROGRAM_IMAGES.cardio.features[3],
  },
];

export default function CardioEndurancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">

      {/* ── Page Header Banner ── */}
      <div className="px-4 pt-4 md:px-8 md:pt-6">
        <section className="relative w-full h-[55vh] min-h-[500px] flex flex-col items-center justify-center rounded-[30px] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${PROGRAM_IMAGES.cardio.main}')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/55 to-[#0a0a0a]" />
          <div className="relative z-20 text-center px-4 mt-24 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight">
              Cardio & Endurance
            </h1>
            <nav aria-label="Breadcrumb" className="flex flex-col items-center">
              <p className="text-white text-base md:text-lg font-medium tracking-wide">
                Home <span className="mx-2 text-white">/</span> Programs <span className="mx-2 text-white">/</span> Cardio
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
                  <BoltIcon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3 leading-snug">
                  Boost Your Stamina
                </h4>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Generate your personalised cardio plan in seconds.
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
                src={PROGRAM_IMAGES.cardio.main}
                alt="Athlete running on trail — cardio training"
                className="w-full h-[480px] object-cover object-center"
              />
            </div>

            {/* Description */}
            <div className="mb-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <span className="text-[#111] font-semibold">Cardio & Endurance training</span> isn't just about logging miles — it's about optimizing your oxygen intake, enhancing mitochondrial density, and building a heart that can handle anything.{" "}
                <span className="text-[#c1ff00] font-semibold" style={{ color: "#7cb900" }}>
                  At Sync-Fit, our cardio programs
                </span>{" "}
                leverage <span style={{ color: "#7cb900" }} className="font-medium">biological feedback loops</span> to ensure you're always training in the right intensity zone for your specific goals.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're prepping for a triathlon or just want to climb stairs without getting winded, our AI engine designs a progression that builds base aerobic capacity while layering on the explosive power needed for true high-performance conditioning.
              </p>
            </div>

            {/* ── BENEFITS SECTION ── */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">Why Cardio Matters</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                Stamina & performance benefits
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
                <span className="text-[#111] font-bold tracking-widest uppercase text-xs">The Tech Behind The Sweat</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-10 leading-tight">
                Intelligent cardio features
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
                    "Personalized HIIT & LISS interval generation",
                    "Aerobic base building via Zone 2 training protocols",
                    "Fat-burning optimization driven by metabolic insights",
                    "Real-time volume adjustments based on recovery score",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#111] font-medium text-base">
                      <CheckCircleIcon className="w-6 h-6 text-[#83b800] fill-none flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#c1ff00] rounded-full flex items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30" />
                  No
                  <br />Platea
                </div>
              </div>

              {/* Final inline CTA */}
              <div className="bg-[#0b0c10] rounded-3xl p-10 text-center relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#c1ff00]/10 blur-[70px] rounded-full" />
                <div className="relative z-10">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                    Unlock Your Maximum Aerobic Capacity
                  </h3>
                  <p className="text-gray-400 mb-8 text-base">
                    Start training with the most sophisticated cardio engine available.
                  </p>
                  <Link
                    href="/workout"
                    className="inline-flex items-center gap-3 bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-4 px-10 rounded-full text-base transition-all hover:scale-105 shadow-[0_8px_30px_-8px_rgba(193,255,0,0.5)]"
                  >
                    Generate My Cardio Plan <ArrowRightIcon className="w-5 h-5" />
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
