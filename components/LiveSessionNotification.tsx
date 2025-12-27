'use client';

import { useEffect, useState } from 'react';
import { useActiveLiveSessions } from '@/app/lib/queries/useLiveSessions';
import Link from 'next/link';

export function LiveSessionNotification() {
  const { data: activeSessions = [] } = useActiveLiveSessions();
  const [showNotification, setShowNotification] = useState(false);
  const [dismissedSessions, setDismissedSessions] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Show notification if there are active sessions that haven't been dismissed
    const newSessions = activeSessions.filter(
      (session: any) => !dismissedSessions.has(session.id)
    );
    
    if (newSessions.length > 0) {
      setShowNotification(true);
    }
  }, [activeSessions, dismissedSessions]);

  const handleDismiss = (sessionId: number) => {
    setDismissedSessions(prev => new Set([...prev, sessionId]));
    if (activeSessions.length === dismissedSessions.size + 1) {
      setShowNotification(false);
    }
  };

  if (!showNotification || activeSessions.length === 0) return null;

  const undismissedSessions = activeSessions.filter(
    (session: any) => !dismissedSessions.has(session.id)
  );

  if (undismissedSessions.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md space-y-3">
      {undismissedSessions.map((session: any) => (
        <div
          key={session.id}
          className="bg-white rounded-lg shadow-2xl border-2 border-green-500 p-4 animate-slide-up"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="font-bold text-slate-900">Live Class Started!</h4>
              </div>
              <p className="text-sm text-slate-700 mb-1">
                {session.session_title || 'Live Session'}
              </p>
              <p className="text-xs text-slate-500 mb-3">
                {session.courses?.title || 'Course'}
              </p>
              <div className="flex gap-2">
                <a
                  href={session.session_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  JOIN NOW
                </a>
                <button
                  onClick={() => handleDismiss(session.id)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(session.id)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
