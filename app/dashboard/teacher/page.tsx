"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Clock, Loader2 } from "lucide-react";
import { getMyCourses } from "@/app/models/course.model";
import { getMyNotifications } from "@/app/models/notification.model";
import { createBrowserSupabase } from "@/app/lib/supabase/supabase";
import StatsCard from "./_components/dashboard/StatsCard";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    sessionsTaught: 0,
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const supabase = createBrowserSupabase();

  const cards = [
    {
      label: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-blue-500",
      trend: "0% From last month",
    },
    {
      label: "My Active Courses",
      value: stats.activeCourses.toString(),
      icon: BookOpen,
      color: "bg-green-500",
      trend: "0% From last month",
    },
    {
      label: "Sessions Taught",
      value: stats.sessionsTaught.toString(),
      icon: Clock,
      color: "bg-purple-500",
      trend: "0% From last month",
    },
  ];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const coursesData = await getMyCourses();
      const totalCourses = coursesData?.length || 0;
      const activeCourses = totalCourses; // by design: active = owned courses

      // Sessions taught: completed sessions across teacher's courses
      let sessionsTaught = 0;
      const { data: authData } = await supabase.auth.getUser();
      const teacherId = authData?.user?.id;
      if (teacherId) {
        const now = new Date().toISOString();
        const { count, error } = await supabase
          .from("live_sessions")
          .select("id", { count: "exact", head: true })
          .eq("teacher_id", teacherId)
          .lte("end_time", now)
          .is("deleted_at", null);
        if (error) throw error;
        sessionsTaught = count || 0;
      }

      setStats({ totalCourses, activeCourses, sessionsTaught });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );

  return (
    <div className="p-8">
      {/* Main Content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      </div>

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
