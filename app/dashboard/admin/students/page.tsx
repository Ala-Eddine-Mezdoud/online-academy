"use client";
import React, { useState } from 'react';
import { Bell, GraduationCap, Search } from 'lucide-react';
import { students as initialStudents, courses as initialCourses, studentEnrollments as initialEnrollments, Student, NewStudent, Course, CourseEnrollment } from '@/app/lib/mockData';
import Modal from '@/modals/AddModal';
import EnrollStudent from '@/components/dashboard/EnrollStudent';
import Link from 'next/link';
import { Users, IdCard, Grid3x3 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";



export default function StudentsPage() {

  const [students, setStudents] = useState<Student[]>(initialStudents ?? []);
  const [courses, setCourses] = useState<Course[]>(initialCourses ?? []);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(initialEnrollments ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const q = searchQuery.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    const name = (student.name ?? '').toLowerCase();
    const studentId = (student.studentId ?? '').toLowerCase();
    const major = (student.major ?? '').toLowerCase();

    const matchesSearch = q === '' || name.includes(q) || studentId.includes(q) || major.includes(q);
    return matchesSearch;
  });

  const handleAddStudent = (studentData: NewStudent) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const newStudent: Student = {
      id,
      ...studentData,
      // Ensure optional fields exist on the new object (match DB-friendly shape)
      studentId: studentData.studentId ?? null,
      major: studentData.major ?? null,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleEditStudent = (student: Student) => {
    const currentName = student.name ?? '';
    const newName = prompt('Edit student name:', currentName);
    if (newName !== null && newName !== currentName) {
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, name: newName } : s))
      );
      alert('Student updated successfully!');
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      alert('Student deleted successfully!');
    }
  };

  const handleEnrollStudent = (courseId: number, studentId: string) => {
    const course = courses.find(c => c.id === courseId);
    const student = students.find(s => s.id === studentId);

    // create a new enrollment record and append to enrollments state
    const nextId = (enrollments?.length ? Math.max(...enrollments.map(e => Number(e.id))) + 1 : Date.now());
    const newEnrollment: CourseEnrollment = {
      id: Number(nextId),
      course_id: courseId,
      student_id: studentId,
      enrolled_at: new Date().toISOString(),
      progress: 0,
    };
    setEnrollments((prev) => [newEnrollment, ...prev]);
    alert(`${student?.name ?? 'Student'} enrolled in ${course?.title ?? 'course'}`);
  };

  const handleDeleteEnrollment = (enrollmentId: number) => {
    if (!confirm('Delete this enrollment?')) return;
    setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    alert('Enrollment removed');
  };

  

  const uniqueMajorsCount = new Set(students.map((s) => s.major ?? '').filter(Boolean)).size;



  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      

      <div className="p-8">
      {/* Stats */}
<div className="grid grid-cols-3 gap-4 mb-8">
  <StatCard
              title="Total Students"
              value={students.length.toString()}
              icon={(props) => <GraduationCap {...props} />}
              color="green"
            />

  <StatCard
    title="Profiles"
    value={students.length.toString()}
    icon={() => <IdCard />}
    color="cyan"
  />

  <StatCard
    title="Total Majors"
    value={uniqueMajorsCount.toString()}
    icon={() => <Grid3x3 />}
    color="green"
  />
</div>


        {/* Students Table + Actions (left table, right aside) */}
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">All Students</h3>
                <p className="text-xs text-gray-500">Complete list of all student accounts.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                + Add Student
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Student ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Major</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 table-text">{student.name ?? '-'}</td>
                    <td className="px-4 py-2 table-text">{student.studentId ?? '-'}</td>
                    <td className="px-4 py-2 table-text">{student.major ?? '-'}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
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

          {filteredStudents.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">No students found matching your criteria.</div>
          )}

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredStudents.length} of {students.length} students
                </p>
              </div>
            </div>
          </div>

          <aside className="w-80">
            <EnrollStudent courses={courses} students={students} onEnroll={handleEnrollStudent} />
          </aside>
        </div>
      </div>
      {/* Enrollments Table (aligned width with Students table) */}
      <div className="p-8">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Enrollments</h3>
                    <p className="text-xs text-gray-500">Recent enrollments made by the admin.</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Student</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Course</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Enrolled At</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enrollments.map((enr) => {
                      const student = students.find((s) => s.id === enr.student_id);
                      const course = courses.find((c) => c.id === enr.course_id);
                      return (
                        <tr key={String(enr.id)} className="hover:bg-gray-50">
                          <td className="px-4 py-2 table-text">{enr.id}</td>
                          <td className="px-4 py-2 table-text">{student?.name ?? enr.student_id}</td>
                          <td className="px-4 py-2 table-text">{course?.title ?? `#${enr.course_id}`}</td>
                          <td className="px-4 py-2 table-text">{enr.enrolled_at ? new Date(enr.enrolled_at).toLocaleString() : '-'}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleDeleteEnrollment(Number(enr.id))}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {enrollments.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">No enrollments yet.</div>
              )}

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {enrollments.length} enrollments</p>
              </div>
            </div>
          </div>
          <aside className="w-80" />
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Student">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const studentData: NewStudent = {
              // NewStudent omits 'id' so this matches the type
              name: String(formData.get('name') || ''),
              studentId: String(formData.get('studentId') || '') || null,
              major: String(formData.get('major') || '') || null,
            };
            handleAddStudent(studentData);
            setIsAddModalOpen(false);
            form.reset();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-2">Student Name</label>
            <input name="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm mb-2">Student ID</label>
            <input name="studentId" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm mb-2">Major</label>
            <select name="major" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Add Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
