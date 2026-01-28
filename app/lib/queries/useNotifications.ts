'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyNotifications } from '@/app/models/notification.model';

export function useMyNotifications() {
  return useQuery({
    queryKey: ['my-notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000, // poll for new notifications
    staleTime: 10000,
  });
}
