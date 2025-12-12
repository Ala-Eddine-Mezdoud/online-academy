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
import CoursesManager from './_components/pages/CoursesManager';
import StudentsManager from './_components/pages/StudentsManager';
import ProfileManager from './_components/pages/ProfileManager';
import RecentCourses from './_components/dashboard/RecentCourses';
import NotificationsList from './_components/dashboard/NotificationsList';
import StatsCard from './_components/dashboard/StatsCard';

type Page = 'dashboard' | 'courses' | 'students' | 'profile';

export default function TeacherDashboard() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        avgRating: 0,
        hoursTaught: 0,
    });
    const [recentCourses, setRecentCourses] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [coursesData, enrollmentsData, notificationsData] = await Promise.all([
                getMyCourses(),
                getAllEnrollments(),
                getMyNotifications(),
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

            // Format notifications
            const formattedNotifications = (notificationsData || []).slice(0, 5).map((notif: any) => ({
                id: notif.id,
                text: notif.message || notif.title || 'New notification',
                time: notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Just now',
                type: notif.is_read ? 'info' : 'success',
            }));
            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses' as Page, label: 'Courses', icon: BookOpen },
        { id: 'students' as Page, label: 'Students', icon: Users },
        { id: 'profile' as Page, label: 'Profile', icon: User },
    ];

    const teacherStats = [
        { label: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: 'Active Courses', value: stats.activeCourses.toString(), icon: BookOpen, color: 'bg-green-500', trend: '+2' },
        { label: 'Avg. Rating', value: stats.avgRating.toString(), icon: Award, color: 'bg-yellow-500', trend: '+0.3' },
        { label: 'Hours Taught', value: stats.hoursTaught.toString(), icon: Clock, color: 'bg-purple-500', trend: '+24h' },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-lg text-gray-900">EduConnect</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                title={!isSidebarOpen ? item.label : undefined}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                {isSidebarOpen && (
                                    <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                        title={!isSidebarOpen ? 'Logout' : undefined}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>

                {isSidebarOpen && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">JD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                                <p className="text-xs text-gray-500 truncate">Teacher</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4 flex-1">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>

                        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                {currentPage === 'dashboard' && (
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
                            <p className="text-gray-600">Here's what's happening with your courses today.</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {teacherStats.map((stat, index) => (
                                        <StatsCard key={index} stat={stat} />
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <RecentCourses courses={recentCourses} />
                                    <div className="space-y-6">
                                        <NotificationsList notifications={notifications} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Courses Page */}
                {currentPage === 'courses' && <CoursesManager />}

                {/* Students Page */}
                {currentPage === 'students' && <StudentsManager />}

                {/* Profile Page */}
                {currentPage === 'profile' && <ProfileManager />}
            </main>
        </div>
    );
}
