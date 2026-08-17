"use client";

import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { IExercise } from "@/types/workout";
import ExerciseVideo from "@/components/workout/ExerciseVideo";
import { getExerciseMedia } from "@/constants/exerciseMedia";

interface ExerciseFormModalProps {
  exercise: IExercise | null;
  onClose: () => void;
}

export default function ExerciseFormModal({ exercise, onClose }: ExerciseFormModalProps) {
  if (!exercise) return null;

  const media = getExerciseMedia(exercise.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl sm:rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 shadow-2xl z-10 space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-3 sm:pb-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-[#c1ff00]/20 text-[#111111] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#c1ff00]/40">
                Technique Guide
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                {media.category}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
                {media.bodyPosition}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 uppercase">
                {media.equipment}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#111111] tracking-tight truncate">
              {exercise.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── 1. Looping Exercise Demonstration Video (Visual Centerpiece) ── */}
        <div className="space-y-2">
          <ExerciseVideo
            videoSrc={media.videoSrc}
            posterSrc={media.posterSrc}
            exerciseName={exercise.name}
            variant="modal"
            category={exercise.category}
          />
          <p className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Biomechanical Loop • {media.movementPattern}
          </p>
        </div>

        {/* ── 2. Target Muscles (Primary & Secondary) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              Primary Target
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#111111]">
              {media.primaryMuscles.join(", ")}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Secondary / Synergists
            </span>
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              {media.secondaryMuscles.join(", ")}
            </p>
          </div>
        </div>

        {/* ── 3. Step-by-Step Execution ── */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-[#c1ff00]" />
            Step-by-Step Execution
          </h4>
          <div className="space-y-2">
            {media.stepByStep.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-[#c1ff00] text-black font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Optimal Form Cues & Common Mistakes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cues */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
              Optimal Form Cues
            </h5>
            <ul className="text-xs text-emerald-900 space-y-1.5 font-medium">
              {media.formCues.map((cue, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mistakes */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <ExclamationTriangleIcon className="w-4 h-4 text-rose-600" />
              Common Mistakes
            </h5>
            <ul className="text-xs text-rose-900 space-y-1.5 font-medium">
              {media.commonMistakes.map((mis, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">×</span>
                  <span>{mis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 5. Breathing & Tempo Cues ── */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🫁</span>
          <div>
            <p className="text-xs font-black uppercase text-blue-900 tracking-wider">
              Breathing &amp; Tempo ({media.tempo})
            </p>
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              {media.breathingCue}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#111111] hover:bg-[#333] text-white font-black py-4 rounded-2xl text-sm transition-all shadow-lg"
        >
          Got It, Let's Train →
        </button>
      </div>
    </div>
  );
}
