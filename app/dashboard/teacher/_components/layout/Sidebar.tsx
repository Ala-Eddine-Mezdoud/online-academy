'use client';

import React from 'react';
import { LogOut, BookOpen } from 'lucide-react';
import type { Page, MenuItem } from '../types';

interface UserProfileProps {
    name: string;
    role: string;
    initials: string;
}

function UserProfile({ name, role, initials }: UserProfileProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{role}</p>
            </div>
        </div>
    );
}

interface SidebarProps {
    isOpen: boolean;
    currentPage: Page;
    menuItems: MenuItem[];
    onPageChange: (page: Page) => void;
    onLogout: () => void;
}

export default function Sidebar({
    isOpen,
    currentPage,
    menuItems,
    onPageChange,
    onLogout,
}: SidebarProps) {
    return (
        <aside
            className={`${isOpen ? 'w-64' : 'w-20'
                } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                {isOpen ? (
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
                            onClick={() => onPageChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            title={!isOpen ? item.label : undefined}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            {isOpen && (
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
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    title={!isOpen ? 'Logout' : undefined}
                >
                    <LogOut className="w-5 h-5" />
                    {isOpen && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>

            {/* User Profile */}
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    <UserProfile name="John Doe" role="Teacher" initials="JD" />
                </div>
            )}
        </aside>
    );
}
