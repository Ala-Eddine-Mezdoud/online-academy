'use client';

import { useEffect } from 'react';

export type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  durationMs?: number;
};

export default function Toast({ message, type = 'info', onClose, durationMs = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [onClose, durationMs]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  const light = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`shadow-lg rounded-lg border px-4 py-3 w-[280px] ${light} animate-[fadeIn_200ms_ease-in-out]`}>
        <div className="flex items-start gap-3">
          <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1 ${colors}`}></span>
          <div className="flex-1 text-sm">
            {message}
          </div>
          <button
            className="text-xs text-slate-500 hover:text-slate-700"
            onClick={onClose}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
