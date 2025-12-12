'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, TriangleAlert } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { getAllProfiles } from '@/app/lib/profiles.client';
import { getAllCourses } from '@/app/lib/courses.client';
import { getAllEnrollments } from '@/app/lib/enrollments.client';
import { checkAdminConfig } from '@/app/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/admin/ui/alert';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    enrollments: 0
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, teachersData, coursesData, enrollmentsData, config] = await Promise.all([
          getAllProfiles('student'),
          getAllProfiles('teacher'),
          getAllCourses(),
          getAllEnrollments(),
          checkAdminConfig()
        ]);

        if (config.missingKey) {
          setConfigError(true);
        }

        setStats({
          students: studentsData?.length || 0,
          teachers: teachersData?.length || 0,
          courses: coursesData?.length || 0,
          enrollments: enrollmentsData?.length || 0
        });

        setRecentStudents(studentsData?.slice(0, 5) || []);
        
        // Calculate popular courses based on enrollments
        const courseEnrollmentCounts: Record<number, number> = {};
        enrollmentsData?.forEach((e: any) => {
          if (e.course_id) {
            courseEnrollmentCounts[e.course_id] = (courseEnrollmentCounts[e.course_id] || 0) + 1;
          }
        });

        const sortedCourses = coursesData?.map((c: any) => ({
          ...c,
          enrollments_count: courseEnrollmentCounts[c.id] || 0
        })).sort((a: any, b: any) => b.enrollments_count - a.enrollments_count).slice(0, 4) || [];

        setPopularCourses(sortedCourses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your platform.</p>
      </div>
      
      {configError && (
        <Alert variant="destructive" className="mb-6">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            The Supabase Service Role Key is missing. You will not be able to create new users (Students/Teachers).
            Please add <code>SUPABASE_SERVICE_ROLE_KEY</code> to your <code>.env</code> file.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          trend={{ value: 'From database', isPositive: true }}
        />
        <StatsCard
          title="Total Teachers"
          value={stats.teachers}
          icon={GraduationCap}
          trend={{ value: 'From database', isPositive: true }}
        />
        <StatsCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          trend={{ value: 'From database', isPositive: true }}
        />
        <StatsCard
          title="Total Enrollments"
          value={stats.enrollments}
          icon={TrendingUp}
          trend={{ value: 'From database', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{student.role_title || 'Unknown Name'}</p>
                  <p className="text-sm text-gray-500">{student.wilaya || 'No location'}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {/* We don't have enrollment count per student easily available without more queries, skipping for now */}
                  Student
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Courses</h3>
          <div className="space-y-4">
            {popularCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-500">ID: {course.id}</p>
                </div>
                <span className="text-sm text-blue-600">
                  {course.enrollments_count} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
