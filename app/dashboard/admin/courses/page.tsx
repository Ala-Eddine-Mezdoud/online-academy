// contents of file
"use client";
import React, { useState } from "react";
import { Bell, Search, Filter } from "lucide-react";
import {
  courses as initialCourses,
  teachers as initialTeachers,
  Course,
  NewCourse,
  Teacher,
  students,
} from "@/app/lib/mockData";
import Modal from "@/modals/AddModal";
import AssignCourseToTeacher from "@/components/dashboard/AssignCourseToTeacher";
import Link from "next/link";
import { BookOpen, Layers, CheckCircle, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments = [
    "all",
    ...Array.from(
      new Set(courses.map((c) => c.department ?? "").filter(Boolean))
    ),
  ];

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (course.code ?? "").toLowerCase().includes(q) ||
      course.title.toLowerCase().includes(q) ||
      (course.department ?? "").toLowerCase().includes(q) ||
      (course.assignedTeacher ?? "").toLowerCase().includes(q);
    const matchesFilter =
      filterDepartment === "all" ||
      (course.department ?? "") === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleAddCourse = (courseData: NewCourse) => {
    const nextId = courses.length
      ? Math.max(...courses.map((c) => c.id)) + 1
      : 1;
    const newCourse: Course = {
      id: nextId,
      ...courseData,
    };
    setCourses([...courses, newCourse]);
  };

  const handleEditCourse = (course: Course) => {
    const newTitle = prompt("Edit course title:", course.title);
    if (newTitle && newTitle !== course.title) {
      setCourses(
        courses.map((c) => (c.id === course.id ? { ...c, title: newTitle } : c))
      );
      alert("Course updated successfully!");
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== courseId));
      alert("Course deleted successfully!");
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

  return (
    <div className="flex-1 bg-grey-50 overflow-auto">
      <div className="p-8">
        {/* Stats Section with StatCard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Departments"
            value={teachers.length.toString()}
            icon={(props) => <Layers {...props} />}
            color="cyan"
          />

          <StatCard
            title="Total Courses"
            value={courses.length.toString()}
            icon={(props) => <BookOpen {...props} />}
            color="orange"
          />
          <StatCard
            title="Total Enrollements"
            value={students.length.toString()}
            icon={(props) => <Users {...props} />}
            color="pink"
          />
        </div>

        {/* Courses Table + Actions (left table, right aside) */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      All Courses
                    </h3>
                    <p className="text-xs text-gray-500">
                      Comprehensive list of all courses offered.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                  >
                    + Add Course
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                    >
                      <option value="all">All Departments</option>
                      {departments
                        .filter((d) => d !== "all")
                        .map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">
                        Course Code
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">
                        Department
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">
                        Assigned Teacher
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-slate-900 w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 table-text">{course.code}</td>
                        <td className="px-4 py-2 table-text">{course.title}</td>
                        <td className="px-4 py-2 table-text">
                          {course.department ?? "-"}
                        </td>
                        <td className="px-4 py-2 table-text">
                          {course.assignedTeacher ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
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

              {filteredCourses.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No courses found matching your criteria.
                </div>
              )}

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80">
            <AssignCourseToTeacher courses={courses} teachers={teachers} onAssign={handleAssignCourse} />
          </aside>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Course"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const courseData = {
              code: String(formData.get("code") || ""),
              title: String(formData.get("title") || ""),
              department: String(
                formData.get("department") || "Computer Science"
              ),
              assignedTeacher: String(formData.get("assignedTeacher") || ""),
            } as NewCourse;
            handleAddCourse(courseData);
            setIsAddModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-2">Course Title</label>
            <input
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Course Code</label>
            <input
              name="code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
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
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Assigned Teacher</label>
            <input
              name="assignedTeacher"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
            >
              Add Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
