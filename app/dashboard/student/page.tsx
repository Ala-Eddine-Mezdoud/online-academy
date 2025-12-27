'use client';

import React, { useState, useEffect } from 'react';
import { useActiveLiveSessions } from '@/app/lib/queries/useLiveSessions';
import { LiveSessionNotification } from '@/components/LiveSessionNotification';
import Link from 'next/link';
import { Loader2, BookOpen, Clock } from 'lucide-react';
import { getMyEnrollments } from '@/app/lib/enrollments.client';
import { createBrowserSupabase } from '@/app/lib/supabase/supabase';
import StatsCard from './_components/dashboard/StatsCard';


export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    sessionsStudied: 0,
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const { data: activeSessions = [], isLoading: sessionsLoading } = useActiveLiveSessions();
  const supabase = createBrowserSupabase();




  const cards = [
    { label: 'Total Courses', value: stats.totalCourses.toString(), icon: BookOpen, color: 'bg-blue-500' },
    { label: 'My Active Courses', value: stats.activeCourses.toString(), icon: BookOpen, color: 'bg-green-500' },
    { label: 'Sessions Studied', value: stats.sessionsStudied.toString(), icon: Clock, color: 'bg-purple-500' },
  ];


  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const myEnrollments = await getMyEnrollments();
      const totalCourses = myEnrollments?.length || 0;
      const activeCourses = myEnrollments?.length || 0; // Active courses = enrolled courses

      // Sessions studied: count of completed sessions across enrolled courses
      const enrolledIds = (myEnrollments || []).map((e: any) => e.course_id).filter(Boolean);
      let sessionsStudied = 0;
      if (enrolledIds.length > 0) {
        const now = new Date().toISOString();
        const { count, error } = await supabase
          .from('live_sessions')
          .select('id', { count: 'exact', head: true })
          .in('course_id', enrolledIds)
          .lte('end_time', now)
          .is('deleted_at', null);
        if (error) throw error;
        sessionsStudied = count || 0;
      }

      setStats({ totalCourses, activeCourses, sessionsStudied });


    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // No dynamic override: Active courses = enrolled courses by design


  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-8">
      {/* Live session toast notifications */}
      <LiveSessionNotification />


      {/* Main Content */}
      <div className='mb-8'>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      </div>


      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>
      </div>

      {/* Active sessions section for enrolled courses */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Sessions</h2>
        {sessionsLoading ? (
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking for live classes...
          </div>
        ) : activeSessions.length === 0 ? (
          <p className="text-slate-600">No live sessions right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map((s: any) => (
              <div key={s.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-green-700">Live</span>
                </div>
                <p className="text-sm text-slate-900 font-medium">{s.session_title || 'Live Session'}</p>
                <p className="text-xs text-slate-500 mb-3">{s.courses?.title || 'Course'}</p>
                <a
                  href={s.session_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  JOIN NOW
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
