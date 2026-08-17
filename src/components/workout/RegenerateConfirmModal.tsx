"use client";

import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface RegenerateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  generating?: boolean;
}

export default function RegenerateConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  generating,
}: RegenerateConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl sm:rounded-[32px] w-full max-w-md p-4 sm:p-6 md:p-8 shadow-2xl z-10 space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#c1ff00]/20 flex items-center justify-center text-[#111111]">
            <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-black text-[#111111]">
            Regenerate Weekly Plan?
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Your current completed workouts will remain saved. Upcoming workouts will be adjusted and recalibrated based on your latest readiness and progressive overload targets.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 sm:py-3.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={generating}
            className="py-3 sm:py-3.5 px-3 sm:px-4 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Calibrating…</span>
              </>
            ) : (
              <span>Regenerate</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
