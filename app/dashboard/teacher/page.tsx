"use client";
import React from "react";
import { BookOpen, Camera, Users } from "lucide-react";
import { teachers as mockTeachers, courses as mockCourses, students as mockStudents } from "@/app/lib/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import Link from "next/link";

export default function TeacherOverviewPage() {
  const currentTeacher = mockTeachers[0];
  const teacherCourses = mockCourses.filter(c => c.teacher_id === currentTeacher.id);

  // count unique students in teacher's courses via mock enrollments (simple approximation)
  const studentCount = mockStudents.length;

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">

      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="My Courses" value={teacherCourses.length.toString()} icon={(props) => <BookOpen {...props} />} color="blue" />
          <StatCard title="Total Students" value={studentCount.toString()} icon={(props) => <Users {...props} />} color="blue" />
          <StatCard title="Live Sessions" value={"0"} icon={(props) => <Camera {...props} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">My Courses</h3>
                <p className="text-xs text-gray-500">Courses assigned to you</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Code</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Title</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Department</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {teacherCourses.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 table-text">{c.code}</td>
                        <td className="px-4 py-2 table-text">{c.title}</td>
                        <td className="px-4 py-2 table-text">{c.department ?? '-'}</td>
                        <td className="px-4 py-2 text-sm text-right">
                          <Link href={`/dashboard/teacher/courses`} className="text-xs text-blue-600 hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-72">
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="text-sm font-semibold mb-2">Profile</h3>
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">{(currentTeacher.name || 'T').charAt(0)}</div>
                <div className="mt-3 text-sm">{currentTeacher.name}</div>
                <div className="text-xs text-gray-500">{currentTeacher.email}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
