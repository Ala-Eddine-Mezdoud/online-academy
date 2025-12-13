'use client';

import React from 'react';
import StatsCard from '../dashboard/StatsCard';
import RecentCourses from '../dashboard/RecentCourses';
import RecentStudents from '../dashboard/RecentStudents';
import NotificationsList from '../dashboard/NotificationsList';
import type { TeacherStat, Course, Student, Notification } from '../types';

interface DashboardContentProps {
    stats: TeacherStat[];
    courses: Course[];
    students: Student[];
    notifications: Notification[];
}

export default function DashboardContent({
    stats,
    courses,
    students,
    notifications,
}: DashboardContentProps) {
    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h2>
                <p className="text-gray-600">Here's what's happening with your courses today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatsCard key={index} stat={stat} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Courses */}
                <RecentCourses courses={courses} />

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Recent Students */}
                    <RecentStudents students={students} />

                    {/* Notifications */}
                    <NotificationsList notifications={notifications} />
                </div>
            </div>
        </div>
    );
}
