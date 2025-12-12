'use client';

import React from 'react';
import type { Notification } from '../types';

interface NotificationsListProps {
    notifications: Notification[];
}

export default function NotificationsList({ notifications }: NotificationsListProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'info'
                                        ? 'bg-blue-500'
                                        : notification.type === 'success'
                                            ? 'bg-green-500'
                                            : 'bg-yellow-500'
                                    }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 mb-1">{notification.text}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
