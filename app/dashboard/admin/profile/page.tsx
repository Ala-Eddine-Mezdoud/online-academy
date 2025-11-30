"use client";
import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Upload,
  Lock,
} from "lucide-react";
import Modal from "@/modals/AddModal";
import Link from "next/link";
import { createBrowserSupabase } from '@/app/lib/supabase/supabase';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: "Evelyn Reed",
    role: "System Administrator",
    employeeId: "ADMIN-001",
    email: "evelyn.reed@example.com",
    phone: "+1 555 123 4567",
    location: "New York, USA",
    gender: "Female",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarUrl(url);
      // In a real app you'd upload the file here.
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // replace with real save logic / API call
    alert("Profile saved");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    // replace with real password change flow
    setPasswords({ current: "", newPass: "", confirm: "" });
    alert("Password updated");
  };

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      // ignore errors in mock/dev environment
      console.warn('Logout failed', err);
    }
    router.push('/');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      

      <div className="p-8 space-y-6">
        {/* Top card: avatar + basic */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400">
                <User className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{profile.fullName}</h2>
                <p className="text-sm text-gray-500">{profile.role}</p>
                <p className="text-xs text-gray-400 mt-1">Admin ID: {profile.employeeId}</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-gray-600" /> Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Contact / Personal info */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h3>
          <p className="text-xs text-gray-500 mb-4">Update your contact details and personal info.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">Full Name</label>
              <input
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Email</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Location</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Gender (Optional)</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{profile.role}</span>
              </div>
              <div className="ml-auto">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Profile Picture
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() =>
                setProfile({
                  fullName: "Evelyn Reed",
                  role: "System Administrator",
                  employeeId: "ADMIN-001",
                  email: "evelyn.reed@example.com",
                  phone: "+1 555 123 4567",
                  location: "New York, USA",
                  gender: "Female",
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Reset
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Save Changes
            </button>
          </div>
        </form>

        {/* Card: Change password (full width) */}
        <form onSubmit={handleSavePassword} className="bg-white rounded-lg border border-gray-200 p-6 w-full">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Change Password</h3>
          <p className="text-xs text-gray-500 mb-4">Update your account password.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10"
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setPasswords({ current: "", newPass: "", confirm: "" })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Reset
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Save Password
            </button>
          </div>
        </form>
        {/* Logout button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Session</h3>
          <p className="text-xs text-gray-500 mb-4">End your current session safely.</p>
          <div className="flex justify-end">
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

