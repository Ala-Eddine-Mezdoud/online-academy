'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import type { Page, MenuItem } from '../types';

interface HeaderProps {
    currentPage: Page;
    menuItems: MenuItem[];
}

export default function Header({ currentPage, menuItems }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 flex-1">
                <h1 className="text-xl font-semibold text-gray-900">
                    {menuItems.find((item) => item.id === currentPage)?.label || 'Dashboard'}
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
    );
}
