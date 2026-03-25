import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, HeartIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-premium opacity-70 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-dark text-sm text-emerald-300 font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>AI-Powered Fuzzy Logic Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Precision Fitness, <br/>
            <span className="text-gradient">Intelligently Calibrated.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Transform your body with diet and workout plans tailored precisely to your metrics, energy levels, and sleep quality using advanced fuzzy inference logic.
          </p>
          
          <div className="flex gap-4">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105"
            >
              Start Your Journey <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Sync-Fit?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our intelligence system takes the guesswork out of your health plan, simulating elite nutritional decision-making.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel-dark p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <HeartIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Holistic Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                We factor in your BMI, sleep quality, and energy levels—not just your weight—to craft the perfect routine tailored to your capacity.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-panel-dark p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fuzzy Logic Engine</h3>
              <p className="text-slate-400 leading-relaxed">
                Traditional apps use hard cutoffs. Our fuzzy inference system mathematically blends physiological inputs for human-like reasoning.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-panel-dark p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
              <div className="bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <ChartBarIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Adjustments</h3>
              <p className="text-slate-400 leading-relaxed">
                Track your progress on a premium dashboard. Your caloric outputs and workout routines adjust dynamically as your body changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
