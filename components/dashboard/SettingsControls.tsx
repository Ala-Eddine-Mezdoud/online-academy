"use client";
import React, { useState } from 'react';

export default function SettingsControls() {
  const [settings, setSettings] = useState({
    siteName: 'EduAdmin',
    email: 'admin@eduadmin.com',
    notifications: true,
    emailNotifications: true,
    autoEnrollment: false,
  });

  const handleSave = () => {
    // Replace with Server Action or API call when ready
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive push notifications for important updates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email notifications for updates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Course Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg mb-4">Course Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Auto Enrollment</p>
                <p className="text-xs text-gray-500">Automatically enroll students in courses</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoEnrollment}
                onChange={(e) => setSettings({ ...settings, autoEnrollment: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
