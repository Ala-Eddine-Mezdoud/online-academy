'use client';

import React, { useState } from 'react';
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
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

type Page = 'dashboard' | 'courses' | 'students' | 'profile';

// Mock data
const teacherStats = [
    { label: 'Total Students', value: '1,234', icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Active Courses', value: '8', icon: BookOpen, color: 'bg-green-500', trend: '+2' },
    { label: 'Avg. Rating', value: '4.8', icon: Award, color: 'bg-yellow-500', trend: '+0.3' },
    { label: 'Hours Taught', value: '342', icon: Clock, color: 'bg-purple-500', trend: '+24h' },
];

const recentCourses = [
    { id: 1, title: 'Advanced Web Development', students: 156, progress: 75, status: 'active' },
    { id: 2, title: 'React Fundamentals', students: 234, progress: 90, status: 'active' },
    { id: 3, title: 'TypeScript Mastery', students: 98, progress: 45, status: 'active' },
];

const recentStudents = [
    { id: 1, name: 'Sarah Johnson', course: 'Web Development', progress: 85, avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', course: 'React Fundamentals', progress: 92, avatar: 'MC' },
    { id: 3, name: 'Emma Williams', course: 'TypeScript Mastery', progress: 78, avatar: 'EW' },
    { id: 4, name: 'David Brown', course: 'Web Development', progress: 65, avatar: 'DB' },
];

const notifications = [
    { id: 1, text: 'New student enrolled in React Fundamentals', time: '5 min ago', type: 'info' },
    { id: 2, text: 'Assignment submitted by Sarah Johnson', time: '1 hour ago', type: 'success' },
    { id: 3, text: 'Course review pending approval', time: '2 hours ago', type: 'warning' },
];

export default function TeacherDashboard() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses' as Page, label: 'Courses', icon: BookOpen },
        { id: 'students' as Page, label: 'Students', icon: Users },
        { id: 'profile' as Page, label: 'Profile', icon: User },
    ];

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logging out...');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                {/* Logo */}
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

                {/* Navigation */}
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

                {/* Logout Button */}
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

                {/* User Profile */}
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
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4 flex-1">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                {currentPage === 'dashboard' && (
                    <div className="p-8">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h2>
                            <p className="text-gray-600">Here's what's happening with your courses today.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {teacherStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>{stat.trend}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Courses */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
                                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                        View all
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {recentCourses.map((course) => (
                                        <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                                                    <p className="text-sm text-gray-600">{course.students} students enrolled</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Course Progress</span>
                                                    <span className="font-medium text-gray-900">{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Recent Students */}
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {recentStudents.map((student) => (
                                            <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">{student.avatar}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{student.course}</p>
                                                    </div>
                                                </div>
                                                <div className="ml-13">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-green-500 h-1.5 rounded-full"
                                                            style={{ width: `${student.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'info' ? 'bg-blue-500' :
                                                        notification.type === 'success' ? 'bg-green-500' :
                                                            'bg-yellow-500'
                                                        }`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-900 mb-1">{notification.text}</p>
                                                        <p className="text-xs text-gray-500">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Page */}
                {currentPage === 'courses' && (
                    <div className="p-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Courses Management</h3>
                            <p className="text-gray-600">Your courses content will appear here</p>
                        </div>
                    </div>
                )}

                {/* Students Page */}
                {currentPage === 'students' && (
                    <div className="p-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Students Management</h3>
                            <p className="text-gray-600">Your students content will appear here</p>
                        </div>
                    </div>
                )}

                {/* Profile Page */}
                {currentPage === 'profile' && (
                    <div className="p-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h3>
                            <p className="text-gray-600">Your profile settings will appear here</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
