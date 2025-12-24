'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    User,
    LogOut,
    Bell,
    Search,
    TrendingUp,
    Clock,
    Award,
    Loader2
} from 'lucide-react';
import { getMyCourses } from '@/app/lib/courses.client';
import { getAllEnrollments } from '@/app/lib/enrollments.client';
import { getMyNotifications } from '@/app/lib/notifications.client';
import StatsCard from './_components/dashboard/StatsCard';


export default function TeacherDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        avgRating: 0,
        hoursTaught: 0,
    });
    const [recentCourses, setRecentCourses] = useState<any[]>([]);




    const teacherStats = [
        { label: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Active Courses', value: stats.activeCourses.toString(), icon: BookOpen, color: 'bg-green-500', trend: '+2' },
        { label: 'sessions Taught', value: stats.hoursTaught.toString(), icon: Clock, color: 'bg-purple-500', trend: '+3' },
    ];


    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [coursesData, enrollmentsData] = await Promise.all([
                getMyCourses(),
                getAllEnrollments(),
            ]);

            // Calculate stats
            const totalStudents = enrollmentsData?.length || 0;
            const activeCourses = coursesData?.length || 0;

            setStats({
                totalStudents,
                activeCourses,
                avgRating: 4.8, // This would come from reviews
                hoursTaught: 342, // This would be calculated
            });

            // Format courses for display
            const formattedCourses = (coursesData || []).slice(0, 3).map((course: any) => ({
                id: course.id,
                title: course.title,
                students: enrollmentsData?.filter((e: any) => e.course_id === course.id).length || 0,
                progress: 75, // This would be calculated from actual data
                status: 'active',
            }));
            setRecentCourses(formattedCourses);


        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);


    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="p-8">


            {/* Main Content */}
            <div className='mb-8'>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            </div>


            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {teacherStats.map((stat, index) => (
                        <StatsCard key={index} stat={stat} />
                    ))}
                </div>
            </div>

        </div>
    );
}
