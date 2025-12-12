import React from 'react';
import NotificationsList from '@/app/dashboard/notifications/NotificationsList';
import { notifications as mockNotifications } from '@/app/lib/mockData';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function AdminNotificationsPage() {
  const items = mockNotifications;

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      

      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4">Your recent notifications and alerts.</p>
          <NotificationsList initial={items} />
        </div>
      </div>
    </div>
  );
}
