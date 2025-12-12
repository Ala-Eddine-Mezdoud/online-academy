"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Play,
  XCircle,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Modal from "@/modals/AddModal";
import { teachers as mockTeachers, courses as mockCourses, liveSessions as initialSessions } from "@/app/lib/mockData";
import { StatCard } from "@/components/dashboard/StatCard";

type SessionStatus = "Live" | "Upcoming" | "Completed" | "Canceled";

type LiveSession = {
  id: string;
  date: string; // human friendly: "Nov 20, 2023"
  time: string; // "10:00 AM"
  teacher: string;
  courseTitle: string;
  status: SessionStatus;
};


export default function LiveManagementPage() {

  const [sessions, setSessions] = useState<LiveSession[]>(initialSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSession | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(mockCourses?.[0]?.id ?? null);
  const [createTeacherName, setCreateTeacherName] = useState<string>("");
  const [createDate, setCreateDate] = useState<string>("");
  const [createTime, setCreateTime] = useState<string>("");


  useEffect(() => {
    const course = mockCourses.find((c) => c.id === selectedCourseId);
    const teacher = mockTeachers.find((t) => t.id === course?.teacher_id);
    setCreateTeacherName(teacher?.name ?? "Unassigned");
  }, [selectedCourseId]);


  const totalSessions = sessions.length;
  const upcomingCount = sessions.filter((s) => s.status === "Upcoming").length;
  const liveCount = sessions.filter((s) => s.status === "Live").length;
  const canceledCount = sessions.filter((s) => s.status === "Canceled").length;


  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sessions.filter((s) => {
      const matchesQuery =
        q === "" ||
        s.teacher.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q) ||
        s.date.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);


  
  const openEdit = (session: LiveSession) => {
    setEditingSession(session);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updated: LiveSession) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsEditOpen(false);
    setEditingSession(null);
    alert("Session updated successfully!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      alert("Session deleted");
    }
  };

  const badgeFor = (status: SessionStatus) => {
    switch (status) {
      case "Live":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            {status}
          </span>
        );
      case "Upcoming":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">
            {status}
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
      case "Canceled":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            {status}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <div className="flex-1 bg-gray-50 overflow-auto">

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Sessions"
              value={totalSessions.toString()}
              icon={(props) => <Calendar {...props} />}
              color="blue"
            />

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Live Session" size="md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!selectedCourseId) return alert("Please select a course");
                  if (!createDate) return alert("Please choose a date");
                  if (!createTime) return alert("Please choose a time");

                  const course = mockCourses.find((c) => c.id === selectedCourseId);
                  const teacherName = createTeacherName || "Unassigned";

                  let formattedDate = createDate;
                  try {
                    const d = new Date(createDate + "T" + (createTime || "00:00"));
                    formattedDate = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                  } catch (e) {}

                  const newSession: LiveSession = {
                    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    date: formattedDate,
                    time: createTime,
                    teacher: teacherName,
                    courseTitle: course?.title ?? "Unknown Course",
                    status: "Upcoming",
                  };

                  setSessions((prev) => [newSession, ...prev]);
                  setIsCreateOpen(false);
                  // reset create form
                  setCreateDate("");
                  setCreateTime("");
                  setSelectedCourseId(mockCourses?.[0]?.id ?? null);
                  alert("Session created successfully (mock).");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2">Course</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={String(selectedCourseId ?? "")}
                    onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  >
                    {mockCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Assigned Teacher</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" readOnly value={createTeacherName} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-2">Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={createDate} onChange={(e) => setCreateDate(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Time</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={createTime} onChange={(e) => setCreateTime(e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Create Session</button>
                </div>
              </form>
            </Modal>
            <StatCard
              title="Upcoming Sessions"
              value={upcomingCount.toString()}
              icon={(props) => <Clock {...props} />}
              color="orange"
            />
            <StatCard
              title="Live Sessions"
              value={liveCount.toString()}
              icon={(props) => <Play {...props} />}
              color="green"
            />
            <StatCard
              title="Canceled Sessions"
              value={canceledCount.toString()}
              icon={(props) => <XCircle {...props} />}
              color="red"
            />
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-center gap-3 w-full md:w-1/2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions..."
                  className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option>All</option>
                <option>Live</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Canceled</option>
              </select>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">All Live Sessions</h3>
                  <p className="text-xs text-gray-500">Manage live sessions from here</p>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg"
                  >
                    Create Session
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 w-36">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 w-28">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Teacher</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Course Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 w-28">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 table-text">{s.date}</td>
                      <td className="px-4 py-3 table-text">{s.time}</td>
                      <td className="px-4 py-3 table-text">{s.teacher}</td>
                      <td className="px-4 py-3 table-text">{s.courseTitle}</td>
                      <td className="px-4 py-3">{badgeFor(s.status)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            title="Edit"
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            title="Delete"
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                        No sessions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100" />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingSession(null);
        }}
        title="Edit Session"
      >
        {editingSession ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);
              const updated: LiveSession = {
                ...editingSession,
                date: String(fd.get("date") || editingSession.date),
                time: String(fd.get("time") || editingSession.time),
                teacher: String(fd.get("teacher") || editingSession.teacher),
                courseTitle: String(fd.get("courseTitle") || editingSession.courseTitle),
                status: (String(fd.get("status")) || editingSession.status) as SessionStatus,
              };
              handleSaveEdit(updated);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm mb-2">Date</label>
              <input name="date" defaultValue={editingSession.date} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-2">Time</label>
              <input name="time" defaultValue={editingSession.time} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-2">Teacher</label>
              <input name="teacher" defaultValue={editingSession.teacher} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-2">Course Title</label>
              <input name="courseTitle" defaultValue={editingSession.courseTitle} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-2">Status</label>
              <select name="status" defaultValue={editingSession.status} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Live</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Canceled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingSession(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
                Save
              </button>
            </div>
          </form>
        ) : (
          <p>No session selected.</p>
        )}
      </Modal>
    </>
  );
}