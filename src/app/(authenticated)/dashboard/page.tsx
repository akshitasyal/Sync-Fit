import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";
import WorkoutPlan from "@/models/WorkoutPlan";
import MealPlan from "@/models/MealPlan";
import UserStats from "@/models/UserStats";
import { 
  ChartBarIcon, 
  FireIcon, 
  PresentationChartLineIcon, 
  TrophyIcon, 
  StarIcon, 
  AcademicCapIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import DashboardCharts from "./DashboardCharts";
import FastingToggle from "./FastingToggle";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  await connectToDatabase();
  const userRecord = await User.findOne({ email: session.user.email }).lean() as any;

  if (!userRecord?.recommendations) {
    redirect("/profile");
  }

  const { recommendedCalories, dietType, workoutIntensity, bmi } = userRecord.recommendations;
  
  const rawProgress = await Progress.find({ userEmail: session.user.email }).sort({ date: 1 }).lean();
  const progressData = rawProgress.map((p: any) => ({ date: p.date, weight: p.weight }));

  const activePlan = await WorkoutPlan.findOne({ userEmail: session.user.email }).lean() as any;
  let totalCompleted = 0;
  if (activePlan) {
    totalCompleted = activePlan.days.filter((d: any) => d.isCompleted).length;
  }

  const userStats = await UserStats.findOne({ userEmail: session.user.email }).lean() as any;
  const points = userStats?.points || 0;
  const level = userStats?.level || 1;
  const streak = userStats?.streak || 0;
  const badges = userStats?.badges || [];
  const nextLevelXP = 100; // Each level is 100 points
  const currentLevelXP = points % 100;
  const levelProgress = (currentLevelXP / nextLevelXP) * 100;

  // Calculate Consistency Score
  const mealPlan = await MealPlan.findOne({ userEmail: session.user.email }).lean() as any;
  let mealScore = 0;
  if (mealPlan) {
    let completedSlots = 0;
    let totalSlots = 0;
    mealPlan.days.forEach((d: any) => {
        d.meals.forEach((m: any) => {
            totalSlots++;
            if (m.completed) completedSlots++;
        });
    });
    mealScore = totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0;
  }
  const workoutScore = activePlan ? (totalCompleted / 7) * 100 : 0;
  const consistencyScore = Math.round((mealScore + workoutScore) / 2);

  // Goal Prediction (Simplified logic)
  let daysToGoal = "TBD";
  if (userRecord.goal === "weight loss") {
      daysToGoal = "45"; // Mocked based on average 0.5kg/week
  } else if (userRecord.goal === "muscle gain") {
      daysToGoal = "90";
  }

  return (
    <div className="flex-grow bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Overview</h1>
            <p className="text-slate-400">Welcome back, {userRecord.name}. Your latest AI-calibrated metrics are ready.</p>
          </div>
          <div className="w-full md:w-auto">
             <FastingToggle initialStatus={userRecord.isFastingMode || false} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FireIcon className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Daily Caloric Target</h3>
            <p className="text-4xl font-bold text-white mt-3">{recommendedCalories} <span className="text-lg text-slate-500 font-normal">kcal</span></p>
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ChartBarIcon className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Workout Intensity</h3>
            <p className="text-4xl font-bold text-white mt-3 capitalize">{workoutIntensity}</p>
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Recommended Diet</h3>
            <p className="text-4xl font-bold text-emerald-400 mt-3 capitalize">{dietType}</p>
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden group bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-opacity">
              <StarIcon className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Current Streak</h3>
            <p className="text-4xl font-bold text-white mt-3">{streak} <span className="text-lg text-slate-500 font-normal">Days</span></p>
            <p className="text-xs mt-1 text-emerald-500 font-bold">Stay consistent!</p>
          </div>
        </div>

        {/* Level & Achievements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 glass-panel-dark p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
               </div>
               <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center mb-4 relative">
                  <AcademicCapIcon className="w-12 h-12 text-emerald-500" />
                  <div className="absolute -bottom-2 bg-emerald-500 text-black text-xs font-black px-3 py-1 rounded-full">LVL {level}</div>
               </div>
               <h3 className="text-2xl font-black text-white mb-1">{points} XP</h3>
               <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">{nextLevelXP - currentLevelXP} XP TO NEXT LEVEL</p>
           </div>

           <div className="lg:col-span-2 glass-panel-dark p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-amber-500" /> Earned Badges
                 </h3>
                 <span className="text-slate-500 text-xs font-bold">{badges.length} Unlocked</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {["First Meal", "Streak Starter", "Calorie King", "7-Day Streak"].map((b) => {
                    const isEarned = badges.includes(b);
                    return (
                      <div key={b} className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${isEarned ? 'bg-emerald-500/10 border-emerald-500/20 opacity-100' : 'bg-white/5 border-white/5 opacity-30 grayscale'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isEarned ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                            <StarIcon className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">{b}</span>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Phase 5 Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
             <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Consistency Score</h3>
             <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-black text-white">{consistencyScore}%</span>
                <span className="text-emerald-500 text-xs font-bold mb-1">Weekly Adherence</span>
             </div>
             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${consistencyScore}%` }}></div>
             </div>
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
             <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Goal Prediction</h3>
             <p className="text-slate-300 text-sm mb-2">Estimated time to reach your {userRecord.goal} target:</p>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{daysToGoal}</span>
                <span className="text-slate-500 font-bold">Days</span>
             </div>
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative group">
             <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-md rotate-3 group-hover:rotate-0 transition-transform">AI REASONING</div>
             <h3 className="text-white text-sm font-bold mb-3">Explainable AI Insights</h3>
             <ul className="space-y-2 text-[11px] text-slate-400">
                {userRecord.isFastingMode && (
                   <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-400 font-bold">Fasting mode enabled → special vrat meals selected.</span>
                   </li>
                )}
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                   <span>High protein selected for <b className="text-emerald-400">{userRecord.goal}</b> goal.</span>
                </li>
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                   <span>Intensity calibrated to <b className="text-emerald-400">{workoutIntensity}</b> based on energy levels.</span>
                </li>
                <li className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                   <span>Meal volume adjusted for <b className="text-emerald-400">{userRecord.sleepQuality}</b> sleep cycles.</span>
                </li>
             </ul>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel-dark p-6 rounded-2xl border border-white/5 h-[420px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PresentationChartLineIcon className="w-6 h-6 text-emerald-400" />
                Weight Progression Projection
              </h3>
            </div>
            <DashboardCharts data={progressData} />
          </div>

          <div className="glass-panel-dark p-6 rounded-2xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Physiological Inputs</h3>
            <ul className="space-y-5 flex-grow">
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Energy Level</span>
                <span className="text-white font-medium capitalize flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    userRecord.energyLevel === 'high' ? 'bg-emerald-500' : 
                    userRecord.energyLevel === 'medium' ? 'bg-amber-400' : 
                    'bg-rose-500'
                  }`}></span>
                  {userRecord.energyLevel}
                </span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Sleep Quality</span>
                <span className="text-white font-medium capitalize">{userRecord.sleepQuality}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Current Goal</span>
                <span className="text-emerald-400 font-medium capitalize">{userRecord.goal}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Age</span>
                <span className="text-white font-medium">{userRecord.age} yrs</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Height</span>
                <span className="text-white font-medium">{userRecord.height} cm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
