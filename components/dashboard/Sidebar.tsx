"use client";
import React from 'react';
import { Home, Users, GraduationCap, BookOpen, User, Video, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export type PageType = 'dashboard' | 'teachers' | 'students' | 'courses' | 'profile' | 'live' | 'notifications';

interface SidebarProps {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void | Promise<void>;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'teachers' as const, label: 'Teachers', icon: Users },
    { id: 'students' as const, label: 'Students', icon: GraduationCap },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
    { id: 'live' as const, label: 'Live Sessions', icon: Video },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const router = useRouter();
  const pathname = usePathname() || '';

  // derive page from pathname if currentPage prop not provided
  let activePage: PageType | undefined = currentPage;
  if (!activePage) {
    if (pathname.startsWith('/dashboard/admin/teachers')) activePage = 'teachers';
    else if (pathname.startsWith('/dashboard/admin/students')) activePage = 'students';
    else if (pathname.startsWith('/dashboard/admin/courses')) activePage = 'courses';
    else if (pathname.startsWith('/dashboard/admin/liveManagement')) activePage = 'live';
    else if (pathname.startsWith('/dashboard/admin/notifications')) activePage = 'notifications';
    else if (pathname.startsWith('/dashboard/admin/profile')) activePage = 'profile';
    else if (pathname === '/dashboard' || pathname.startsWith('/dashboard/admin')) activePage = 'dashboard';
  }

  function toRoute(page: PageType) {
    switch (page) {
      case 'dashboard':
        return '/dashboard/admin';
      case 'teachers':
        return '/dashboard/admin/teachers';
      case 'students':
        return '/dashboard/admin/students';
      case 'courses':
        return '/dashboard/admin/courses';
      case 'live':
        return '/dashboard/admin/liveManagement';
      case 'notifications':
        return '/dashboard/admin/notifications';
      case 'profile':
        return '/dashboard/admin/profile';
      default:
        return '/dashboard/admin';
    }
  }

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col pt-10" >
      {/* Logo */}
      <div className="p-7 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-blue-500">EduAdmin</span>
        </div>
      </div>

      {/* Navigation */}
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
                    } catch (err) {
                      // swallow errors from server action for now
                      // you may want to handle/log them
                      // console.error(err);
                    }
                    const route = toRoute(item.id as PageType);
                    if (router && typeof router.push === 'function') {
                      router.push(route);
                    } else {
                      // fallback for environments where router isn't available
                      window.location.href = route;
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
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

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@eduadmin.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
