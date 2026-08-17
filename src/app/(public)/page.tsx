import Link from "next/link"; 
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5] overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col xl:flex-row items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden bg-[#0b0c10]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-60 pointer-events-none"
        >
          <source src="/Home-page.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/95 to-transparent xl:w-3/4 hidden xl:block" />
        <div className="absolute inset-0 z-10 bg-[#0b0c10]/80 xl:hidden" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col xl:flex-row items-center justify-between gap-10 sm:gap-16 mt-6 sm:mt-10">
          
          <div className="w-full xl:w-3/5 text-left">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full py-1.5 px-2 pr-4 sm:pr-6 mb-6 sm:mb-8 mt-4 sm:mt-8">
              <div className="flex -space-x-2">
                <img src="/images/avatar-3.jpg" alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#111]" />
                <img src="/images/avatar-4.jpg" alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#111]" />
                <img src="/images/avatar-5.jpg" alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#111]" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium tracking-wide">Smart Planning. Real Results.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] mb-4 sm:mb-6 tracking-tight">
              An AI Fitness System Built to Transform <br className="hidden md:block"/>Your Lifestyle
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              Sync-Fit combines intelligent personalization, smart nutrition planning, and adaptive workouts to deliver personalized fitness results based on your body, goals, and habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-5">
              <Link 
                href="/signup" 
                className="bg-[#c1ff00] hover:bg-[#a9e000] text-black font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-[0_10px_30px_-10px_rgba(193,255,0,0.5)] text-sm sm:text-base"
              >
                Get Started Now <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
              </Link>
              <Link 
                href="/login" 
                className="bg-transparent border border-white/20 hover:border-white/50 text-white hover:bg-white/5 font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center transition-all text-sm sm:text-base"
              >
                View Your Plan
              </Link>
            </div>
          </div>

          <div className="w-full xl:w-2/5 flex justify-center xl:justify-end xl:translate-y-16">
            <div className="bg-[#1a1c23] border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[30px] shadow-2xl max-w-md w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c1ff00]/10 blur-[50px] rounded-full"></div>
              <h3 className="text-[#c1ff00] text-4xl sm:text-5xl lg:text-[64px] font-extrabold mb-2 tracking-tighter leading-none">98%</h3>
              <h4 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Plan Accuracy Rate</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Our intelligent system continuously adapts your diet and workouts to match your progress and maximize results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT / VALUE PROPOSITION SECTION */}
      <section className="py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 items-center">
            
            <div className="w-full lg:w-1/2 relative">
              <div className="rounded-2xl overflow-hidden glass-panel-dark p-2 animate-float">
                <img src="/images/muscular-man.jpg" alt="Muscular man working out" className="w-full h-auto object-cover aspect-[4/5]"/>
              </div>
              <div className="rounded-2xl overflow-hidden glass-panel p-2 animate-float-delayed mt-6 sm:mt-12">
                <img src="/images/woman-lifting.jpg" alt="Woman lifting weights" className="w-full h-auto object-cover aspect-[4/5]"/>
              </div>
              <div className="sm:absolute sm:-bottom-6 sm:left-6 z-30 bg-white shadow-xl rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 mt-4 sm:mt-0 border border-gray-100">
                <div className="flex -space-x-3 justify-center items-center">
                  <img src="/images/avatar-1.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-xs" />
                  <img src="/images/avatar-2.jpg" alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-xs" />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-[#c1ff00] shadow-xs flex items-center justify-center text-[10px] sm:text-xs font-bold text-black">★</div>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Trusted by<br/><span className="text-[#8bb900] font-black">4.9 / 5</span> Users</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2 mt-8 sm:mt-16 lg:mt-0">
              <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 rounded-full bg-[#c1ff00]"></div>
                <span className="text-[#111111] font-bold tracking-widest uppercase text-xs sm:text-sm">About Sync-Fit</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight mb-6 sm:mb-8">
                A Smarter Fitness System Designed for Every Body
              </h2>
              
              <p className="text-gray-600 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-10">
                Sync-Fit is more than just a fitness app — it&apos;s an adaptive system that understands your goals, energy levels, and lifestyle. From beginners to advanced users, we generate personalized diet and workout plans that evolve with you.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#c1ff00] flex items-center justify-center mb-4 sm:mb-5">
                    <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black"/>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#111111] mb-1.5 sm:mb-2">Intelligent Recommendations</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Smart adaptive system that adjusts your workouts and calorie intake dynamically.</p>
                </div>
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f8f7f5] border border-gray-200 flex items-center justify-center mb-4 sm:mb-5">
                    <ArrowTrendingUpIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black"/>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#111111] mb-1.5 sm:mb-2">Adaptive Workouts</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Workout plans that evolve based on your performance, feedback, and consistency.</p>
                </div>
              </div>

              <div className="relative border-2 border-[#c1ff00] rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-[#fdfdfc] mb-8 sm:mb-10 overflow-hidden">
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-center gap-2.5 sm:gap-3 text-[#111111] font-medium text-sm sm:text-lg">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1ff00] fill-[#c1ff00] text-black flex-shrink-0" /> Personalized diet &amp; meal plans
                  </li>
                  <li className="flex items-center gap-2.5 sm:gap-3 text-[#111111] font-medium text-sm sm:text-lg">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1ff00] fill-[#c1ff00] text-black flex-shrink-0" /> Smart workout intensity adjustment
                  </li>
                  <li className="flex items-center gap-2.5 sm:gap-3 text-[#111111] font-medium text-sm sm:text-lg">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1ff00] fill-[#c1ff00] text-black flex-shrink-0" /> Real-time progress tracking
                  </li>
                </ul>
                <div className="hidden sm:flex absolute -bottom-6 -right-6 w-28 h-28 sm:w-32 sm:h-32 bg-[#c1ff00] rounded-full items-center justify-center text-center font-bold text-xs uppercase shadow-xl animate-[spin_10s_linear_infinite]">
                  <span className="tracking-widest absolute inset-0 rounded-full border border-black border-dashed m-2 opacity-30"></span>
                  Start<br/>Now
                </div>
              </div>

              <Link 
                href="/programs" 
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333] text-white font-bold py-3.5 px-6 sm:py-4 sm:px-8 rounded-full transition-all text-xs sm:text-sm"
              >
                Explore Your Plan <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-16 sm:py-24 bg-[#f8f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-4 sm:mb-6">
              Everything You Need to Stay Fit &amp; Consistent
            </h2>
            <div className="w-16 sm:w-20 h-1.5 bg-[#c1ff00] mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[30px] shadow-xs hover:shadow-xl transition-shadow border border-gray-100 group">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#f0f0f0] group-hover:bg-[#c1ff00] flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                 <FireIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#111]" />
               </div>
               <h3 className="text-lg sm:text-xl font-bold text-[#111] mb-2 sm:mb-3">Smart Diet Planning</h3>
               <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">AI-generated meal plans with calorie precision and personalized nutrition.</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[30px] shadow-xs hover:shadow-xl transition-shadow border border-gray-100 group">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#f0f0f0] group-hover:bg-[#c1ff00] flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                 <BoltIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#111]" />
               </div>
               <h3 className="text-lg sm:text-xl font-bold text-[#111] mb-2 sm:mb-3">Adaptive Workout Plans</h3>
               <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Workouts tailored to your intensity, experience level, and goals.</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[30px] shadow-xs hover:shadow-xl transition-shadow border border-gray-100 group">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#f0f0f0] group-hover:bg-[#c1ff00] flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                 <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#111]" />
               </div>
               <h3 className="text-lg sm:text-xl font-bold text-[#111] mb-2 sm:mb-3">Progress Tracking</h3>
               <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Track calories, workouts, and consistency with real-time insights.</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[30px] shadow-xs hover:shadow-xl transition-shadow border border-gray-100 group">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#f0f0f0] group-hover:bg-[#c1ff00] flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                 <LightBulbIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#111]" />
               </div>
               <h3 className="text-lg sm:text-xl font-bold text-[#111] mb-2 sm:mb-3">Adaptive AI Engine</h3>
               <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Smart decision system that adapts recommendations dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE & GAMIFICATION SPLIT SECTION */}
      <section className="py-16 sm:py-24 bg-[#0b0c10] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8">Why Sync-Fit is Different</h2>
              
              {[
                { title: "AI-Powered Adaptive Decisions", desc: "Our core intelligence doesn't just guess; it infers from complex biometrics." },
                { title: "Personalized, not generic plans", desc: "Your plan is yours alone. Calculated dynamically based on your unique profile." },
                { title: "Adaptive system that learns from user", desc: "Stagnation is eliminated as routines automatically shift as you grow stronger." },
                { title: "Complete fitness ecosystem", desc: "Seamlessly blending diet tracking and workout milestones into one platform." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3.5 sm:gap-4">
                  <div className="mt-1 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#c1ff00] flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#1a1c23] to-[#0b0c10] border border-white/10 rounded-2xl sm:rounded-[40px] p-5 sm:p-10 lg:p-14 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#c1ff00]/10 blur-[80px] rounded-full"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#c1ff00] rounded-full mx-auto flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_30px_rgba(193,255,0,0.3)]">
                  <TrophyIcon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Stay Motivated with Smart Rewards</h3>
                <p className="text-gray-400 mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed">Push higher, stay extremely consistent, and watch your rank climb.</p>
                <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-[#c1ff00] text-lg sm:text-2xl font-bold mb-1">🔥 30+</div>
                    <div className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">Streaks</div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-[#c1ff00] text-lg sm:text-2xl font-bold mb-1">⭐ 50K</div>
                    <div className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#c1ff00] text-lg sm:text-2xl font-bold mb-1">🔓 12</div>
                    <div className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">Badges</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-20 sm:py-32 bg-[#c1ff00] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111111] mb-4 sm:mb-6 tracking-tight leading-tight">
            Start Your Smart Fitness Journey Today
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-[#333] mb-8 sm:mb-12 font-medium">
            Take control of your health with a system that understands you.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#111111] hover:bg-[#222] text-white font-bold py-3.5 sm:py-5 px-8 sm:px-10 rounded-full text-base sm:text-xl transition-all hover:scale-105 shadow-2xl"
          >
            Get Started Now <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
          </Link>
        </div>
      </section>

    </div>
  );
}
