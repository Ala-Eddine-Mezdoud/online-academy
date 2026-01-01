'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, TriangleAlert } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { getAllProfiles } from '@/app/lib/profiles.client';
import { getAllCourses } from '@/app/lib/courses.client';
import { adminGetAllEnrollments, checkAdminConfig } from '@/app/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/admin/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface RegistrationData {
  date: string;
  students: number;
  teachers: number;
}

interface EnrollmentData {
  date: string;
  enrollments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    enrollments: 0
  });
  const [trends, setTrends] = useState({
    students: { value: 0, isPositive: true },
    teachers: { value: 0, isPositive: true },
    courses: { value: 0, isPositive: true },
    enrollments: { value: 0, isPositive: true }
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [averageProgress, setAverageProgress] = useState(0);
  const [progressDistribution, setProgressDistribution] = useState({
    notStarted: 0,
    inProgress: 0,
    halfway: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, teachersData, coursesData, enrollmentsData, config] = await Promise.all([
          getAllProfiles('student'),
          getAllProfiles('teacher'),
          getAllCourses(),
          adminGetAllEnrollments(),
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

        // Store teachers for lookup
        setTeachers(teachersData || []);

        // Calculate trends (compare this month vs last month)
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const calculateTrend = (data: any[], dateField: string) => {
          const thisMonth = data?.filter((item: any) => {
            const date = new Date(item[dateField]);
            return date >= thisMonthStart;
          }).length || 0;

          const lastMonth = data?.filter((item: any) => {
            const date = new Date(item[dateField]);
            return date >= lastMonthStart && date <= lastMonthEnd;
          }).length || 0;

          if (lastMonth === 0) {
            return { value: thisMonth > 0 ? 100 : 0, isPositive: true };
          }
          const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
          return { value: Math.abs(change), isPositive: change >= 0 };
        };

        setTrends({
          students: calculateTrend(studentsData || [], 'created_at'),
          teachers: calculateTrend(teachersData || [], 'created_at'),
          courses: calculateTrend(coursesData || [], 'created_at'),
          enrollments: calculateTrend(enrollmentsData || [], 'enrolled_at')
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

        // Calculate registration data by day (last 14 days)
        const last14Days = Array.from({ length: 14 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (13 - i));
          return date.toISOString().split('T')[0];
        });

        const registrationByDay: Record<string, { students: number; teachers: number }> = {};
        last14Days.forEach(day => {
          registrationByDay[day] = { students: 0, teachers: 0 };
        });

        studentsData?.forEach((student: any) => {
          if (student.created_at) {
            const day = student.created_at.split('T')[0];
            if (registrationByDay[day]) {
              registrationByDay[day].students += 1;
            }
          }
        });

        teachersData?.forEach((teacher: any) => {
          if (teacher.created_at) {
            const day = teacher.created_at.split('T')[0];
            if (registrationByDay[day]) {
              registrationByDay[day].teachers += 1;
            }
          }
        });

        const chartData = last14Days.map(day => ({
          date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          students: registrationByDay[day].students,
          teachers: registrationByDay[day].teachers,
        }));

        setRegistrationData(chartData);

        // Calculate enrollment data by day (last 14 days)
        const enrollmentByDay: Record<string, number> = {};
        last14Days.forEach(day => {
          enrollmentByDay[day] = 0;
        });

        enrollmentsData?.forEach((enrollment: any) => {
          if (enrollment.enrolled_at) {
            const day = enrollment.enrolled_at.split('T')[0];
            if (enrollmentByDay[day] !== undefined) {
              enrollmentByDay[day] += 1;
            }
          }
        });

        const enrollmentChartData = last14Days.map(day => ({
          date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          enrollments: enrollmentByDay[day],
        }));

        setEnrollmentData(enrollmentChartData);

        // Calculate average student progress and distribution
        if (enrollmentsData && enrollmentsData.length > 0) {
          const totalProgress = enrollmentsData.reduce((sum: number, e: any) => sum + (e.progress || 0), 0);
          const avgProgress = Math.round(totalProgress / enrollmentsData.length);
          setAverageProgress(avgProgress);

          // Calculate progress distribution
          let notStarted = 0;
          let inProgress = 0;
          let halfway = 0;
          let completed = 0;

          enrollmentsData.forEach((e: any) => {
            const progress = e.progress || 0;
            if (progress === 0) {
              notStarted++;
            } else if (progress < 50) {
              inProgress++;
            } else if (progress < 80) {
              halfway++;
            } else {
              completed++;
            }
          });

          setProgressDistribution({ notStarted, inProgress, halfway, completed });
        }
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
          <AlertTitle>User Creation Disabled</AlertTitle>
          <AlertDescription>
            The Supabase Service Role Key is missing. Creating new users (Students/Teachers) is disabled.
            Other admin operations (viewing, editing, deleting) will work using your RLS policies.
            To enable user creation, add <code>SUPABASE_SERVICE_ROLE_KEY</code> to your <code>.env</code> file.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          trend={{ value: `${trends.students.value}% From last month`, isPositive: true }}
        />
        <StatsCard
          title="Total Teachers"
          value={stats.teachers}
          icon={GraduationCap}
          trend={{ value: `${trends.teachers.value}% From last month`, isPositive: true }}
        />
        <StatsCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          trend={{ value: `${trends.courses.value}% From last month`, isPositive: true }}
        />
        <StatsCard
          title="Total Enrollments"
          value={stats.enrollments}
          icon={TrendingUp}
          trend={{ value: `${trends.enrollments.value}% From last month`, isPositive: true }}
        />
      </div>

      {/* Registration Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Registrations Over Time</h3>
        <p className="text-sm text-gray-500 mb-4">Number of students and teachers registered in the last 14 days</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Students"
              />
              <Line 
                type="monotone" 
                dataKey="teachers" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Teachers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollments Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Enrollments Over Time</h3>
        <p className="text-sm text-gray-500 mb-4">Number of course enrollments in the last 14 days</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name="Enrollments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row - Progress Circle and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Average Student Progress Circle */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Average Student Progress</h3>
          <p className="text-sm text-gray-500 mb-4">Overall course completion rate</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={[{ name: 'Progress', value: averageProgress, fill: '#3b82f6' }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: '#e5e7eb' }}
                  dataKey="value"
                  cornerRadius={10}
                  angleAxisId={0}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-900"
                >
                  <tspan x="50%" dy="-0.5em" fontSize="36" fontWeight="bold">
                    {averageProgress}%
                  </tspan>
                  <tspan x="50%" dy="1.8em" fontSize="14" fill="#6b7280">
                    Average
                  </tspan>
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Student progress breakdown by completion level</p>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Not Started (0%)</span>
                <span className="text-sm text-gray-500">{progressDistribution.notStarted} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gray-400 h-3 rounded-full" style={{ width: `${stats.enrollments > 0 ? (progressDistribution.notStarted / stats.enrollments) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">In Progress (1-49%)</span>
                <span className="text-sm text-gray-500">{progressDistribution.inProgress} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${stats.enrollments > 0 ? (progressDistribution.inProgress / stats.enrollments) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Halfway (50-79%)</span>
                <span className="text-sm text-gray-500">{progressDistribution.halfway} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${stats.enrollments > 0 ? (progressDistribution.halfway / stats.enrollments) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Completed (80-100%)</span>
                <span className="text-sm text-gray-500">{progressDistribution.completed} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${stats.enrollments > 0 ? (progressDistribution.completed / stats.enrollments) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Students</h3>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{student.name || 'Unknown Name'}</p>
                  <p className="text-sm text-gray-500">{student.wilaya || 'No location'}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {student.email || 'Student'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Courses</h3>
          <div className="space-y-4">
            {popularCourses.map((course) => {
              const teacher = teachers.find(t => t.id === course.teacher_id);
              return (
                <div key={course.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">By: {teacher?.name || 'Unknown Teacher'}</p>
                  </div>
                  <span className="text-sm text-blue-600">
                    {course.enrollments_count} students
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}