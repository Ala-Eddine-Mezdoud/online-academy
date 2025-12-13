'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, GraduationCap, BookOpen, UserCheck, LogOut } from 'lucide-react';

export function TeacherSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { path: '/dashboard/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/teacher/courses', label: 'Courses', icon: BookOpen },
    { path: '/dashboard/teacher/students', label: 'Students', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-500">Teacher</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
