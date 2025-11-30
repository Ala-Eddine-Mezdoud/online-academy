"use client";
import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname() || "";

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

  return (
    <div className="bg-white border-b border-gray-200 px-9 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

        <Link href={notificationsRoute} className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Link>
      </div>
    </div>
  );
}
