'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2, TrendingUp } from 'lucide-react';
import { getAllEnrollments, updateEnrollmentProgress } from '@/app/lib/enrollments.client';
import type { Database } from '@/app/lib/supabase/database.types';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];

interface EnrollmentWithDetails extends Enrollment {
    courses?: {
        title: string;
        teacher_id: string | null;
    } | null;
    profiles?: {
        role: string;
    } | null;
}

export default function StudentsManager() {
    const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingProgress, setUpdatingProgress] = useState<number | null>(null);

    useEffect(() => {
        loadEnrollments();
    }, []);

    const loadEnrollments = async () => {
        try {
            setLoading(true);
            const data = await getAllEnrollments();
            setEnrollments(data as EnrollmentWithDetails[] || []);
            setError(null);
        } catch (err) {
            setError('Failed to load enrollments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async (enrollmentId: number, newProgress: number) => {
        try {
            setUpdatingProgress(enrollmentId);
            await updateEnrollmentProgress(enrollmentId, newProgress);
            await loadEnrollments();
        } catch (err) {
            setError('Failed to update progress');
            console.error(err);
        } finally {
            setUpdatingProgress(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Students & Enrollments</h2>
                <p className="text-gray-600 mt-1">Manage student enrollments and track their progress</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {enrollments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrollments yet</h3>
                        <p className="text-gray-600">Students will appear here once they enroll in courses</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Enrolled At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {enrollment.student_id?.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {enrollment.student_id?.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {enrollment.courses?.title || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {enrollment.profiles?.role || 'Student'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {enrollment.enrolled_at
                                                ? new Date(enrollment.enrolled_at).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="font-medium text-gray-900">
                                                            {enrollment.progress || 0}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${enrollment.progress || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue={enrollment.progress || 0}
                                                    disabled={updatingProgress === enrollment.id}
                                                    onBlur={(e) => {
                                                        const newProgress = parseInt(e.target.value);
                                                        if (newProgress !== enrollment.progress) {
                                                            handleProgressUpdate(enrollment.id, newProgress);
                                                        }
                                                    }}
                                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {updatingProgress === enrollment.id && (
                                                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {enrollments.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Enrollments</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Average Progress</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {Math.round(
                                        enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
                                    )}%
                                </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {enrollments.filter(e => (e.progress || 0) === 100).length}
                                </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-purple-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
