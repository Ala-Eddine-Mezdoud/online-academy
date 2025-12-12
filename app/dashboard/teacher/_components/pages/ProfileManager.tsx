'use client';

import React, { useState, useEffect } from 'react';
import { User, Edit2, Loader2, Save } from 'lucide-react';
import { getMyProfile, updateMyProfile } from '@/app/lib/profiles.client';
import type { Database } from '@/app/lib/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileManager() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Profile>>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getMyProfile();
            setProfile(data);
            if (data) {
                setFormData({
                    role_title: data.role_title,
                    description: data.description,
                    phone_number: data.phone_number,
                    wilaya: data.wilaya,
                });
            }
            setError(null);
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateMyProfile(formData);
            await loadProfile();
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError('Failed to update profile');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                role_title: profile.role_title,
                description: profile.description,
                phone_number: profile.phone_number,
                wilaya: profile.wilaya,
            });
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No profile found</h3>
                    <p className="text-gray-600">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit2 className="w-5 h-5" />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end -mt-16 mb-6">
                            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                {profile.profile_image ? (
                                    <img
                                        src={profile.profile_image}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                            <div className="ml-6 mb-4">
                                <h3 className="text-2xl font-bold text-gray-900">{profile.id}</h3>
                                <p className="text-gray-600">{profile.role}</p>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role Title
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.role_title || ''}
                                        onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Senior Developer"
                                    />
                                ) : (
                                    <p className="text-gray-900">{profile.role_title || 'Not set'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tell us about yourself"
                                    />
                                ) : (
                                    <p className="text-gray-900 whitespace-pre-wrap">{profile.description || 'Not set'}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={formData.phone_number || ''}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+213 XXX XXX XXX"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.phone_number || 'Not set'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Wilaya
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.wilaya || ''}
                                            onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Algiers"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.wilaya || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Account Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Created:</span>
                                        <span className="ml-2 text-gray-900">
                                            {profile.created_at
                                                ? new Date(profile.created_at).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Last Updated:</span>
                                        <span className="ml-2 text-gray-900">
                                            {profile.updated_at
                                                ? new Date(profile.updated_at).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
