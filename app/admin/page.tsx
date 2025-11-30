'use client';

import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { students, teachers, courses } from '@/lib/mockData';

export default function DashboardPage() {
  const totalEnrollments = 10;
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={students.length}
          icon={Users}
          trend={{ value: '12% from last month', isPositive: true }}
        />
        <StatsCard
          title="Total Teachers"
          value={teachers.length}
          icon={GraduationCap}
          trend={{ value: '8% from last month', isPositive: true }}
        />
        <StatsCard
          title="Total Courses"
          value={courses.length}
          icon={BookOpen}
          trend={{ value: '5% from last month', isPositive: true }}
        />
        <StatsCard
          title="Total Enrollments"
          value={totalEnrollments}
          icon={TrendingUp}
          trend={{ value: '18% from last month', isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{student.email}</p>
                  <p className="text-sm text-gray-500">{student.wilaya}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {student.enrollments} courses
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Courses</h3>
          <div className="space-y-4">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-500">by {course.teacher_name}</p>
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
