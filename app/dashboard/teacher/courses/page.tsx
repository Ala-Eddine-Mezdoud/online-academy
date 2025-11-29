"use client";
import React, { useState } from "react";
import { teachers as mockTeachers, courses as mockCourses, liveSessions as mockLiveSessions, studentEnrollments } from "@/app/lib/mockData";
import Link from "next/link";
import { Calendar, Clock, Users, Play } from "lucide-react";

type SessionStatus = "Live" | "Upcoming" | "Completed" | "Canceled";

type TeacherSession = {
  id: string;
  date: string;
  time: string;
  title: string;
  studentsCount: number;
  status: SessionStatus;
};

// Map mockData.liveSessions to the UI-friendly TeacherSession shape and derive studentsCount from studentEnrollments
const initialSessions: TeacherSession[] = mockLiveSessions.map((s) => {
  // try to find a course id by matching courseTitle to mockCourses.title
  const course = mockCourses.find((c) => c.title === s.courseTitle);
  const studentsCount = course
    ? studentEnrollments.filter((e) => e.course_id === course.id).length
    : 0;

  return {
    id: s.id,
    date: s.date,
    time: s.time,
    title: s.courseTitle,
    studentsCount,
    status: s.status as SessionStatus,
  };
});

function StatusBadge({ status }: { status: SessionStatus }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  switch (status) {
    case "Live":
      return <span className={`${base} bg-green-100 text-green-700`}>Live</span>;
    case "Upcoming":
      return <span className={`${base} bg-sky-100 text-sky-700`}>Upcoming</span>;
    case "Completed":
      return <span className={`${base} bg-gray-100 text-gray-700`}>Completed</span>;
    case "Canceled":
      return <span className={`${base} bg-red-100 text-red-700`}>Canceled</span>;
    default:
      return <span className={base}>{status}</span>;
  }
}

export default function TeacherCoursesPage() {
  const teacher = mockTeachers[0];
  const [courses, setCourses] = useState(() => mockCourses.filter((c) => c.teacher_id === teacher.id));
  const [sessions, setSessions] = useState<TeacherSession[]>(initialSessions);

  // Teachers cannot edit or remove courses from the UI; actions are handled by admins.

  const startSession = (id: string) => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    if (s.status === "Completed") {
      alert("This session is already completed.");
      return;
    }
    if (s.status === "Live") {
      alert(`Joining live session: ${s.title}`);
      return;
    }
    if (!confirm(`Start live session "${s.title}"?`)) return;
    setSessions((prev) => prev.map((sess) => (sess.id === id ? { ...sess, status: "Live" } : sess)));
    alert(`Session "${s.title}" is now Live.`);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Courses</h3>
            <p className="text-xs text-gray-500">Manage your courses</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Code</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Department</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 table-text">{c.code}</td>
                    <td className="px-4 py-2 table-text">{c.title}</td>
                    <td className="px-4 py-2 table-text">{c.department ?? "-"}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/teacher/courses`} className="text-xs text-gray-600 hover:underline">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Livestream Sessions</h3>
              <p className="text-xs text-gray-500">Start or join your scheduled live sessions</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="relative bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{s.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{s.time}</span>
                    </div>
                  </div>

                  <div className="ml-3">
                    <StatusBadge status={s.status} />
                  </div>
                </div>

                <h4 className="mt-3 font-semibold text-sm">{s.title}</h4>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{s.studentsCount} Students</span>
                  </div>

                  <div>
                    <button onClick={() => startSession(s.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>{s.status === "Live" ? "Join Live" : s.status === "Completed" ? "View" : "Start Live"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

