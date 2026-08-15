"use client";

import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, BoltIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

export interface ExerciseVideoProps {
  videoSrc: string;
  posterSrc?: string;
  exerciseName: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  variant?: "preview" | "modal" | "hero" | "workoutMode";
  className?: string;
  category?: string;
}

export default function ExerciseVideo({
  videoSrc,
  posterSrc,
  exerciseName,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  variant = "preview",
  className = "",
  category = "legs",
}: ExerciseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Variant-specific aspect ratio and height styling
  let containerStyles = "relative w-full rounded-2xl overflow-hidden bg-[#0d0f14] border border-white/10";
  if (variant === "preview") {
    containerStyles += " aspect-[16/10] sm:aspect-[16/9]";
  } else if (variant === "modal") {
    containerStyles += " aspect-[16/10] sm:aspect-[16/9] max-h-[360px]";
  } else if (variant === "hero") {
    containerStyles += " aspect-[16/10] sm:aspect-[4/3] max-h-[280px]";
  } else if (variant === "workoutMode") {
    containerStyles += " aspect-[16/10] sm:aspect-[16/9] max-h-[420px]";
  }

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Reset error/loaded state if video source changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [videoSrc]);

  const handleError = (e: any) => {
    console.error(`[SyncFit Video Error] Exercise: "${exerciseName}" Source: "${videoSrc}"`, e);
    setHasError(true);
  };

  return (
    <div
      className={`${containerStyles} ${className} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={variant !== "preview" ? togglePlay : undefined}
    >
      {/* ── 1. Video Element (Only if no fatal load error) ── */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="auto"
          controls={controls}
          onLoadedData={() => setIsLoaded(true)}
          onCanPlay={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            variant === "preview" ? "group-hover:scale-105" : ""
          } ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* ── 2. Error Fallback (Only shown if video genuinely failed to load) ── */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#14161d] to-[#08090c]">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 border border-amber-500/30">
            <ExclamationCircleIcon className="w-6 h-6" />
          </div>
          <p className="text-white font-bold text-xs capitalize line-clamp-1">
            {exerciseName}
          </p>
          <span className="text-[10px] text-gray-400 mt-0.5">
            Exercise demonstration unavailable
          </span>
        </div>
      )}

      {/* ── 3. Subtle Play / Pause Overlay on Hover (for Modal & Workout Mode) ── */}
      {variant !== "preview" && isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity flex items-center justify-center cursor-pointer ${
            isHovered || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#c1ff00] text-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6 ml-0.5" />
            )}
          </div>
        </div>
      )}

      {/* ── 4. Live Motion Badge Strip ── */}
      {isLoaded && !hasError && (
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-widest pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c1ff00] animate-pulse" />
          <span>Movement Loop</span>
        </div>
      )}
    </div>
  );
}
