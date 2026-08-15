"use client";

interface MuscleSilhouetteVisualProps {
  focus?: string;
  className?: string;
}

export default function MuscleSilhouetteVisual({
  focus = "Legs",
  className = "",
}: MuscleSilhouetteVisualProps) {
  const f = focus.toLowerCase();

  // Determine active muscle groups
  const isChestActive = f.includes("chest") || f.includes("push") || f.includes("full");
  const isBackActive = f.includes("back") || f.includes("pull") || f.includes("deadlift") || f.includes("full");
  const isShouldersActive = f.includes("shoulder") || f.includes("push") || f.includes("overhead");
  const isArmsActive = f.includes("arm") || f.includes("bicep") || f.includes("tricep") || f.includes("push") || f.includes("pull");
  const isQuadsActive = f.includes("leg") || f.includes("quad") || f.includes("lower") || f.includes("squat") || f.includes("full");
  const isHamstringsActive = f.includes("leg") || f.includes("pull") || f.includes("deadlift") || f.includes("lower");
  const isGlutesActive = f.includes("leg") || f.includes("quad") || f.includes("deadlift") || f.includes("lower");
  const isCoreActive = f.includes("core") || f.includes("abs") || f.includes("hiit") || f.includes("full");

  return (
    <div className={`bg-[#14161d] border border-white/10 rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
          Target Muscle Map
        </span>
        <div className="flex items-center gap-3 text-[9px] font-bold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#c1ff00] shadow-[0_0_8px_#c1ff00]" />
            <span className="text-gray-300">Primary</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
            <span className="text-gray-300">Secondary</span>
          </span>
        </div>
      </div>

      {/* SVG Anatomical Silhouette */}
      <div className="py-4 flex items-center justify-center">
        <svg
          viewBox="0 0 160 220"
          className="w-32 h-44 sm:w-36 sm:h-48 drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head & Neck */}
          <circle cx="80" cy="22" r="12" fill="#333846" />
          <path d="M76 34 H84 V42 H76 Z" fill="#333846" />

          {/* Shoulders / Deltoids */}
          <path
            d="M50 44 Q44 48 42 58 Q48 64 56 60 Z"
            className={`transition-colors duration-300 ${
              isShouldersActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_6px_rgba(193,255,0,0.8)]"
                : "fill-[#2a2e3a]"
            }`}
          />
          <path
            d="M110 44 Q116 48 118 58 Q112 64 104 60 Z"
            className={`transition-colors duration-300 ${
              isShouldersActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_6px_rgba(193,255,0,0.8)]"
                : "fill-[#2a2e3a]"
            }`}
          />

          {/* Chest (Pectorals) */}
          <path
            d="M58 44 Q80 46 80 62 Q62 64 58 44 Z"
            className={`transition-colors duration-300 ${
              isChestActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_6px_rgba(193,255,0,0.8)]"
                : "fill-[#2a2e3a]"
            }`}
          />
          <path
            d="M102 44 Q80 46 80 62 Q98 64 102 44 Z"
            className={`transition-colors duration-300 ${
              isChestActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_6px_rgba(193,255,0,0.8)]"
                : "fill-[#2a2e3a]"
            }`}
          />

          {/* Arms / Biceps / Triceps */}
          <path
            d="M40 60 Q34 80 32 100 Q38 102 44 88 Q46 72 44 60 Z"
            className={`transition-colors duration-300 ${
              isArmsActive ? "fill-purple-400 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" : "fill-[#222530]"
            }`}
          />
          <path
            d="M120 60 Q126 80 128 100 Q122 102 116 88 Q114 72 116 60 Z"
            className={`transition-colors duration-300 ${
              isArmsActive ? "fill-purple-400 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" : "fill-[#222530]"
            }`}
          />

          {/* Core / Abdominals */}
          <path
            d="M62 66 H98 V106 Q80 110 62 106 Z"
            className={`transition-colors duration-300 ${
              isCoreActive
                ? "fill-purple-400 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]"
                : "fill-[#262a36]"
            }`}
          />

          {/* Hips & Glutes */}
          <path
            d="M60 108 Q80 112 100 108 Q104 122 96 130 Q80 128 64 130 Q56 122 60 108 Z"
            className={`transition-colors duration-300 ${
              isGlutesActive ? "fill-purple-400 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" : "fill-[#222530]"
            }`}
          />

          {/* Thighs / Quadriceps & Hamstrings */}
          <path
            d="M62 132 Q58 160 60 176 Q72 176 76 156 Q76 134 62 132 Z"
            className={`transition-colors duration-300 ${
              isQuadsActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_8px_rgba(193,255,0,0.9)]"
                : "fill-[#2a2e3a]"
            }`}
          />
          <path
            d="M98 132 Q102 160 100 176 Q88 176 84 156 Q84 134 98 132 Z"
            className={`transition-colors duration-300 ${
              isQuadsActive
                ? "fill-[#c1ff00] filter drop-shadow-[0_0_8px_rgba(193,255,0,0.9)]"
                : "fill-[#2a2e3a]"
            }`}
          />

          {/* Calves / Lower Leg */}
          <path
            d="M60 180 Q56 198 62 212 Q70 212 72 196 Q70 180 60 180 Z"
            className={`transition-colors duration-300 ${
              isQuadsActive || isHamstringsActive ? "fill-[#2a2e3a]" : "fill-[#1d2029]"
            }`}
          />
          <path
            d="M100 180 Q104 198 98 212 Q90 212 88 196 Q90 180 100 180 Z"
            className={`transition-colors duration-300 ${
              isQuadsActive || isHamstringsActive ? "fill-[#2a2e3a]" : "fill-[#1d2029]"
            }`}
          />
        </svg>
      </div>

      {/* Target Focus Description */}
      <div className="text-center pt-2 border-t border-white/10">
        <span className="text-[11px] font-bold text-gray-300 capitalize">
          {focus} Activation
        </span>
      </div>
    </div>
  );
}
