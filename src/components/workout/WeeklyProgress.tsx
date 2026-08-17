"use client";

import { CheckCircleIcon, FireIcon } from "@heroicons/react/24/solid";
import { IWorkoutDay } from "@/types/workout";

interface WeeklyProgressProps {
  days: IWorkoutDay[];
  activeDayIdx: number;
  onSelectDay: (idx: number) => void;
  streakCount?: number;
}

export default function WeeklyProgress({
  days,
  activeDayIdx,
  onSelectDay,
  streakCount = 3,
}: WeeklyProgressProps) {
  const workoutDays = days.filter((d) => d.focus !== "Rest");
  const totalPlanned = workoutDays.length || 5;
  const completedCount = days.filter((d) => d.isCompleted && d.focus !== "Rest").length;
  const percentage = Math.min(100, Math.round((completedCount / totalPlanned) * 100));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[26px] p-3.5 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
      {/* Top Header Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
              This Week
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black text-[#111111]">
                {completedCount} / {totalPlanned}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                Workouts Done
              </span>
            </div>
          </div>
        </div>

        {/* Streak Badge & Percentage */}
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-xs">
            <FireIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
            <span>{streakCount} DAY STREAK</span>
          </div>
          <div className="bg-gray-50 border border-gray-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black text-[#111111]">
            {percentage}% DONE
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
        <div
          className="bg-[#c1ff00] h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 7-Day Interactive Timeline */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-0.5">
        {days.map((day, idx) => {
          const isRest = day.focus === "Rest";
          const isCompleted = day.isCompleted;
          const isActive = activeDayIdx === idx;
          const dayDate = new Date(day.date);
          const dayNum = isNaN(dayDate.getDate()) ? idx + 1 : dayDate.getDate();

          return (
            <button
              key={day.date || idx}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`p-1 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[64px] sm:min-h-[88px] relative cursor-pointer ${
                isActive
                  ? "bg-[#111111] text-white border-[#111111] shadow-md -translate-y-0.5"
                  : isCompleted
                  ? "bg-[#c1ff00]/10 border-[#c1ff00]/40 text-[#111111] hover:bg-[#c1ff00]/20"
                  : isRest
                  ? "bg-gray-50/70 border-dashed border-gray-200 text-gray-400 hover:bg-gray-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {/* Day Name */}
              <span
                className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider ${
                  isActive ? "text-[#c1ff00]" : "text-gray-400"
                }`}
              >
                {day.dayOfWeek ? day.dayOfWeek.slice(0, 3) : `D${idx + 1}`}
              </span>

              {/* Day Number */}
              <span
                className={`text-xs sm:text-base font-black ${
                  isActive ? "text-white" : isCompleted ? "text-[#111111]" : "text-gray-800"
                }`}
              >
                {dayNum}
              </span>

              {/* Status Indicator */}
              <div className="h-3.5 sm:h-4 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircleIcon
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isActive ? "text-[#c1ff00]" : "text-[#8bb900]"
                    }`}
                  />
                ) : isRest ? (
                  <span className="text-[9px] sm:text-[10px]">😴</span>
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-[#c1ff00]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
