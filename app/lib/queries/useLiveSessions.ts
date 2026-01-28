'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveSessionsForStudent } from '@/app/models/live-session.model';

export function useActiveLiveSessions() {
  return useQuery({
    queryKey: ['active-live-sessions'],
    queryFn: getActiveSessionsForStudent,
    refetchInterval: 30000, // Refetch every 30 seconds to check for new sessions
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
