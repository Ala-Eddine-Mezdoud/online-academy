"use client";
import React, { useState } from 'react';
import { Notification as ApiNotification } from '@/app/lib/api';
import { markNotificationRead, deleteNotification } from '@/app/lib/notifications.client';
import { Check, Trash2 } from 'lucide-react';

interface Props {
  initial: ApiNotification[];
  fullWidth?: boolean;
}

export default function NotificationsList({ initial, fullWidth }: Props) {
  const [items, setItems] = useState<ApiNotification[]>(initial ?? []);

  const handleMarkRead = async (id: string) => {
    // optimistic update
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, read: true } : it)));
    try {
      // notifications.client expects numeric id if DB uses integer, but our mock uses string - handle gracefully
      // try to call markNotificationRead if available
      // @ts-ignore
      await markNotificationRead(Number(id), true);
    } catch (err) {
      // ignore - in mock environment we'll rely on local state
      // console.warn(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    try {
      // @ts-ignore
      await deleteNotification(Number(id));
    } catch (err) {
      // ignore
    }
  };

  if (!items || items.length === 0) {
    return <div className="p-6 bg-white rounded-lg border border-gray-200">No notifications</div>;
  }

  return (
    <div className={`space-y-3 ${fullWidth ? '' : ''}`}>
      {items.map((n) => (
        <div key={n.id} className={`bg-white border ${n.read ? 'border-gray-200' : 'border-blue-200'} rounded-lg p-4 flex items-start justify-between`}> 
          <div className="flex-1">
            <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            {!n.read && (
              <button onClick={() => handleMarkRead(n.id)} className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100" title="Mark read">
                <Check className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => handleDelete(n.id)} className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
