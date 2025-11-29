"use client";
import React from 'react';
import { Home, Bell, BookOpen, Video, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export type TeacherPage = 'overview' | 'courses' |  'notifications' | 'profile';

interface SidebarProps {
  currentPage?: TeacherPage;
  onNavigate?: (page: TeacherPage) => void | Promise<void>;
}

export default function SidebarTeacher({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'overview' as const, label: 'Overview', icon: Home },
    { id: 'courses' as const, label: 'Courses & Livestreams', icon: BookOpen },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const router = useRouter();
  const pathname = usePathname() || '';

  let activePage: TeacherPage | undefined = currentPage;
  if (!activePage) {
    if (pathname.startsWith('/dashboard/teacher/courses')) activePage = 'courses';
    else if (pathname.startsWith('/dashboard/teacher/notifications')) activePage = 'notifications';
    else if (pathname.startsWith('/dashboard/teacher/profile')) activePage = 'profile';
    else if (pathname === '/dashboard' || pathname.startsWith('/dashboard/teacher')) activePage = 'overview';
  }

  function toRoute(page: TeacherPage) {
    switch (page) {
      case 'overview':
        return '/dashboard/teacher';
      case 'courses':
        return '/dashboard/teacher/courses';
      
      case 'notifications':
        return '/dashboard/teacher/notifications';
      case 'profile':
        return '/dashboard/teacher/profile';
      default:
        return '/dashboard/teacher';
    }
  }

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-7 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-blue-500">Teacher</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={async () => {
                    try {
                      if (onNavigate) await onNavigate(item.id);
                    } catch (err) {}
                    const route = toRoute(item.id as TeacherPage);
                    if (router && typeof router.push === 'function') router.push(route);
                    else window.location.href = route;
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Teacher Name</p>
            <p className="text-xs text-gray-500 truncate">teacher@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
