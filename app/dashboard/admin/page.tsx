"use client";
import React, { useState } from "react";
import { Bell, Users, GraduationCap, BookOpen } from "lucide-react";
import {
  teachers as initialTeachers,
  students as initialStudents,
  courses as initialCourses,
  Teacher,
  Student,
  Course,
  NewTeacher,
} from "@/app/lib/mockData";

import AssignCourseToTeacher from "@/components/dashboard/AssignCourseToTeacher";
import EnrollStudent from "@/components/dashboard/EnrollStudent";
import Modal from "@/modals/AddModal";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";

export default function AdminOverviewPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents ?? []);
  const [courses, setCourses] = useState<Course[]>(initialCourses ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredTeachers = teachers.filter((teacher) => {
    const q = searchQuery.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(q) ||
      (teacher.email ?? "").toLowerCase().includes(q) ||
      (teacher.department ?? "").toLowerCase().includes(q)
    );
  });

  const handleAddTeacher = (teacherData: NewTeacher) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const newTeacher: Teacher = { id, ...teacherData };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    const newName = prompt("Edit teacher name:", teacher.name);
    if (newName && newName !== teacher.name) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacher.id ? { ...t, name: newName } : t))
      );
      alert("Teacher updated successfully!");
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      alert("Teacher deleted successfully!");
    }
  };

  const handleAssignCourse = (courseId: number, teacherId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              teacher_id: teacherId,
              assignedTeacher:
                teachers.find((t) => t.id === teacherId)?.name ?? "",
            }
          : c
      )
    );
    alert("Course assigned to teacher successfully");
  };

  const handleEnrollStudent = (courseId: number, studentId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);
    alert(`${student?.name ?? "Student"} enrolled in ${course?.title ?? "course"}`);
  };

  const handleEditStudent = (student: Student) => {
    const currentName = student.name ?? "";
    const newName = prompt("Edit student name:", currentName);
    if (newName !== null && newName !== currentName) {
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, name: newName } : s))
      );
      alert("Student updated successfully!");
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      alert("Student deleted successfully!");
    }
  };

  const handleEditCourse = (course: Course) => {
    const newTitle = prompt("Edit course title:", course.title);
    if (newTitle && newTitle !== course.title) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, title: newTitle } : c
        )
      );
      alert("Course updated successfully!");
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("Course deleted successfully!");
    }
  };

  return (
    <>
      <div className="flex-1 bg-gray-50 overflow-auto">
       

        <div className="p-8">
          {/* Stats Section with StatCard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Teachers"
              value={teachers.length.toString()}
              icon={(props) => <Users {...props} />}
              color="blue"
            />
            <StatCard
              title="Total Students"
              value={students.length.toString()}
              icon={(props) => <GraduationCap {...props} />}
              color="green"
            />
            <StatCard
              title="Total Courses"
              value={courses.length.toString()}
              icon={(props) => <BookOpen {...props} />}
              color="orange"
            />
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            <div>
              <div className="space-y-6">
                {/* Teachers preview */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Teachers</h3>
                    <p className="text-xs text-gray-500">Recent / sample teachers</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Name</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Email</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Department</th>
                              <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {teachers.slice(0, 5).map((t) => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 table-text">{t.name}</td>
                            <td className="px-4 py-2 table-text">{t.email}</td>
                            <td className="px-4 py-2 table-text">{t.department}</td>
                            <td className="px-4 py-2 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditTeacher(t)}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTeacher(t.id)}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end">
                    <Link
                      href="/dashboard/admin/teachers"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                </div>

                {/* Students preview */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Students</h3>
                    <p className="text-xs text-gray-500">Recent / sample students</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Name</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Student ID</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Major</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.slice(0, 5).map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 table-text">{s.name}</td>
                            <td className="px-4 py-2 table-text">{s.studentId ?? "-"}</td>
                            <td className="px-4 py-2 table-text">{s.major ?? "-"}</td>
                            <td className="px-4 py-2 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditStudent(s)}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(s.id)}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end">
                    <Link
                      href="/dashboard/admin/students"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                </div>

                {/* Courses preview */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Courses</h3>
                    <p className="text-xs text-gray-500">Recent / sample courses</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Code</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Title</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Department</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Assigned Teacher</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {courses.slice(0, 5).map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 table-text">{c.code ?? "-"}</td>
                            <td className="px-4 py-2 table-text">{c.title}</td>
                            <td className="px-4 py-2 table-text">{c.department ?? "-"}</td>
                            <td className="px-4 py-2 table-text">
                              {c.assignedTeacher ?? "-"}
                            </td>
                            <td className="px-4 py-2 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditCourse(c)}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end">
                    <Link
                      href="/dashboard/admin/courses"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="w-full lg:w-72">
              <div className="space-y-4">
                <AssignCourseToTeacher
                  courses={courses}
                  teachers={teachers}
                  onAssign={handleAssignCourse}
                />
                <EnrollStudent
                  courses={courses}
                  students={students}
                  onEnroll={handleEnrollStudent}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);

            const teacherData = {
              name: String(formData.get("name") || ""),
              email: String(formData.get("email") || ""),
              department: String(formData.get("department") || "Computer Science"),
            } as NewTeacher;

            handleAddTeacher(teacherData);
            setIsAddModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-2">Teacher Name</label>
            <input
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Department</label>
            <select
              name="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Add Teacher
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
