"use client";
import React from "react";
import NotificationsList from "@/app/dashboard/notifications/NotificationsList";
import { notifications as mockNotifications } from "@/app/lib/mockData";

export default function TeacherNotificationsPage() {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      

      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <NotificationsList initial={mockNotifications} fullWidth />
        </div>
      </div>
    </div>
  );
}
