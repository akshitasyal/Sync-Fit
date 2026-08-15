"use client";

import {
  ClockIcon,
  Square3Stack3DIcon,
  FireIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { IWorkoutDay } from "@/types/workout";

interface WorkoutStatsProps {
  day?: IWorkoutDay;
  completedSets?: number;
}

export default function WorkoutStats({ day, completedSets = 0 }: WorkoutStatsProps) {
  if (!day || day.focus === "Rest") return null;

  const exercises = day.exercises || [];
  const totalSets = exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0);
  const durationMin = Math.max(30, exercises.length * 12);
  const estimatedBurn = Math.round(durationMin * 7.5); // ~300-450 kcal
  const progression = "+5%";

  const stats = [
    {
      label: "Duration",
      value: `${durationMin} min`,
      sub: "Active Training Time",
      icon: ClockIcon,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Volume",
      value: `${totalSets} sets`,
      sub: `${completedSets} / ${totalSets} Completed`,
      icon: Square3Stack3DIcon,
      iconBg: "bg-[#c1ff00]/15 text-[#111111]",
    },
    {
      label: "Estimated Burn",
      value: `${estimatedBurn} kcal`,
      sub: "Metabolic Output",
      icon: FireIcon,
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      label: "Target Progression",
      value: progression,
      sub: "Progressive Overload",
      icon: ArrowTrendingUpIcon,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-400">
                {s.label}
              </span>
              <div className={`p-2 rounded-xl ${s.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#111111]">{s.value}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{s.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
