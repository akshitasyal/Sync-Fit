"use client";

import { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function RestTimer({
  initialSeconds = 90,
  isOpen,
  onClose,
}: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(initialSeconds);
      setTotalSeconds(initialSeconds);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  // Countdown loop
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;

  const add30Sec = () => {
    setSecondsLeft((s) => s + 30);
    setTotalSeconds((t) => t + 30);
  };

  const setPreset = (sec: number) => {
    setSecondsLeft(sec);
    setTotalSeconds(sec);
    setIsRunning(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white border border-white/10 rounded-3xl p-5 shadow-2xl w-80 sm:w-96 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-[#c1ff00]" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            Rest Timer
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Countdown Display */}
      <div className="py-4 text-center space-y-2">
        <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
          {timeFormatted}
        </div>
        <p className="text-[11px] font-bold text-gray-400">
          {secondsLeft === 0 ? "🔔 Rest over! Next set ready." : "Recover & hydrate for next set"}
        </p>

        {/* Progress track */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#c1ff00] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 pb-4">
        {[45, 60, 90, 120].map((preset) => (
          <button
            key={preset}
            onClick={() => setPreset(preset)}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
              totalSeconds === preset
                ? "bg-[#c1ff00]/20 border-[#c1ff00] text-[#c1ff00]"
                : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {preset}s
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          {isRunning ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          <span>{isRunning ? "Pause" : "Resume"}</span>
        </button>

        <button
          onClick={add30Sec}
          className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>30s</span>
        </button>

        <button
          onClick={onClose}
          className="py-2.5 px-4 bg-[#c1ff00] hover:bg-[#aadf00] text-black rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-colors shadow-sm"
        >
          <ForwardIcon className="w-3.5 h-3.5" />
          <span>Skip</span>
        </button>
      </div>
    </div>
  );
}
