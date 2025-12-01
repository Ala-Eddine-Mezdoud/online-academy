"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, Home, Users, GraduationCap, BookOpen, Video, User as UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // derive a human friendly title from the pathname
  function getTitle(path: string) {
    if (path === "/dashboard" || path === "/dashboard/admin") return "Admin Overview";
    if (path.startsWith("/dashboard/admin/teachers")) return "Teachers";
    if (path.startsWith("/dashboard/admin/students")) return "Students";
    if (path.startsWith("/dashboard/admin/courses")) return "Courses";
    if (path.startsWith("/dashboard/admin/profile")) return "My Profile";
    if (path.startsWith("/dashboard/admin/liveManagement")) return "Live Sessions";
    if (path.startsWith("/dashboard/admin/notifications")) return "Notifications";

    if (path === "/dashboard/teacher") return "Teacher Overview";
    if (path.startsWith("/dashboard/teacher/courses")) return "My Courses";
    if (path.startsWith("/dashboard/teacher/livestream")) return "Livestream";
    if (path.startsWith("/dashboard/teacher/profile")) return "My Profile";
    if (path.startsWith("/dashboard/teacher/notifications")) return "Notifications";

    // fallback: take last path segment and title-case it
    const seg = path.split("/").filter(Boolean).pop() || "Dashboard";
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  }

  const title = getTitle(pathname);

  // choose notifications route depending on admin/teacher
  const notificationsRoute = pathname.includes("/dashboard/teacher")
    ? "/dashboard/teacher/notifications"
    : "/dashboard/admin/notifications";

  const isTeacher = pathname.includes('/dashboard/teacher');

  const menuItems = isTeacher
    ? [
        { id: 'overview', label: 'Overview', route: '/dashboard/teacher', icon: Home },
        { id: 'courses', label: 'Courses', route: '/dashboard/teacher/courses', icon: BookOpen },
        { id: 'notifications', label: 'Notifications', route: '/dashboard/teacher/notifications', icon: Bell },
        { id: 'profile', label: 'Profile', route: '/dashboard/teacher/profile', icon: UserIcon },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', route: '/dashboard/admin', icon: Home },
        { id: 'teachers', label: 'Teachers', route: '/dashboard/admin/teachers', icon: Users },
        { id: 'students', label: 'Students', route: '/dashboard/admin/students', icon: GraduationCap },
        { id: 'courses', label: 'Courses', route: '/dashboard/admin/courses', icon: BookOpen },
        { id: 'live', label: 'Live Sessions', route: '/dashboard/admin/liveManagement', icon: Video },
        { id: 'notifications', label: 'Notifications', route: '/dashboard/admin/notifications', icon: Bell },
        { id: 'profile', label: 'Profile', route: '/dashboard/admin/profile', icon: UserIcon },
      ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-9 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open navigation"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href={notificationsRoute} className="relative p-2 hover:bg-gray-100 rounded-lg hidden sm:inline-flex">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
        </div>
      </div>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4 shadow-lg overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((it) => {
                const IconComp = it.icon as any;
                return (
                  <button
                    key={it.id}
                    onClick={() => { setMobileOpen(false); router.push(it.route); }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-left"
                  >
                    <IconComp className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">{it.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
