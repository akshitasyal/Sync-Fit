"use client";

import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { PROGRAMS, ProgramId } from "@/constants/programs";

interface ProgramChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProgram?: string;
  onSelectProgram: (programId: string) => void;
  changingProgram?: string | null;
}

export default function ProgramChangeModal({
  isOpen,
  onClose,
  selectedProgram = "muscle-gain",
  onSelectProgram,
  changingProgram,
}: ProgramChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8bb900]">
              Training Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
              Choose Your Fitness Program
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Switching program recalculates your weekly split and progressive load.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PROGRAMS.map((prog) => {
            const isActive = selectedProgram === prog.id;
            const isLoading = changingProgram === prog.id;

            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => onSelectProgram(prog.id)}
                disabled={!!changingProgram}
                className={`relative text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[110px] ${
                  isActive
                    ? "border-[#111111] bg-[#f8f8f5] shadow-md ring-1 ring-[#111111]"
                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${prog.color}`} />

                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{prog.emoji}</span>
                      <span className="font-black text-[#111111] text-sm">{prog.label}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{prog.desc}</p>
                  </div>

                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-[#111111] animate-spin flex-shrink-0" />
                  ) : isActive ? (
                    <CheckCircleIcon className="w-5 h-5 text-[#111111] flex-shrink-0" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
