'use client';

import Link from 'next/link';

// Mock data for demo purposes (same approach as courses/teachers pages)
const studentName = "Alex Johnson";

const enrolledCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    instructor: "by Jane Doe",
    progress: 70,
  },
  {
    id: 2,
    title: "Advanced Data Analytics",
    instructor: "by Michael Chen",
    progress: 45,
  },
];

const notifications = [
  {
    id: 1,
    type: "info" as const,
    title: "New lesson available in Data Science Fundamentals!",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Your Web Development assignment is due tomorrow!",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "success" as const,
    title: "You completed 'Mobile App Design' successfully!",
    time: "2 days ago",
  },
  {
    id: 4,
    type: "info" as const,
    title: "Webinar now live on AI & Machine Learning.",
    time: "3 days ago",
  },
];

const quickActions = [
  {
    id: 1,
    title: "Explore All Courses",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    link: "/course",
  },
  {
    id: 2,
    title: "Go to Profile Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    link: "/profile",
  },
  {
    id: 3,
    title: "View Certificate",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    link: "/certificates",
  },
  {
    id: 4,
    title: "Contact Support",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    link: "/contact",
  },
];

export default function StudentDashboard() {
  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Welcome Section */}
      <section className="py-12 px-10 md:px-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-b from-blue-50 to-white rounded-3xl shadow-lg p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-blue-500 mb-3">
                Welcome back, {studentName}!
              </h1>
              <p className="text-base text-slate-600">
                You have {enrolledCourses.length} courses in progress. Keep up the great work!
              </p>
            </div>
            <Link
              href="/course"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition whitespace-nowrap shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              3 Active Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-10 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Left Column - Recent Courses */}
          <div className="md:col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Your Recent Courses</h2>
              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-md">
                    {/* Course Image */}
                    <div className="w-full">
                      <img 
                        src="/images/webdev-pic.jpg" 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    {/* Course Details */}
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-slate-500 mb-6">By {course.instructor.replace('by ', '')}</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-end text-sm mb-2">
                          <span className="font-semibold text-slate-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        href={`/course/${course.id}`}
                        className="mt-4 w-full block text-center bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:bg-blue-600 transition"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Quick Actions */}
          <div className="space-y-10">
            {/* Notifications */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Notifications</h2>
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-5">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notification.type === 'info' ? 'bg-blue-100' :
                      notification.type === 'warning' ? 'bg-orange-100' :
                      'bg-green-100'
                    }`}>
                      {notification.type === 'info' && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {notification.type === 'warning' && (
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {notification.type === 'success' && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium leading-relaxed mb-1">{notification.title}</p>
                      <p className="text-xs text-slate-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Quick Actions</h2>
              <div className="bg-white rounded-2xl p-6 shadow-md space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.link}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition group"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition">
                      <div className="text-slate-600 group-hover:text-blue-500 transition">
                        {action.icon}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
