"use client";
import React, { useState } from 'react';

type Course = {
  id: number;
  title: string;
  code?: string;
};

type Student = {
  id: string;
  name: string;
};

interface Props {
  courses: Course[];
  students: Student[];
  onEnroll: (courseId: number, studentId: string) => void;
}

export default function EnrollStudent({ courses, students, onEnroll }: Props) {
  const [courseId, setCourseId] = useState<number | ''>(courses?.[0]?.id ?? '');
  const [studentId, setStudentId] = useState<string>(students?.[0]?.id ?? '');

  // Searchable inputs
  const [courseQuery, setCourseQuery] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const filteredCourses = courses.filter((c) => {
    const label = c.code ? `${c.code} — ${c.title}` : c.title;
    return label.toLowerCase().includes(courseQuery.toLowerCase());
  });

  const filteredStudents = students.filter((s) =>
    (s.name ?? '').toLowerCase().includes(studentQuery.toLowerCase())
  );

  const handleEnroll = () => {
    if (!courseId || !studentId) {
      alert('Please select both a course and a student');
      return;
    }
    onEnroll(Number(courseId), studentId);
    setCourseQuery('');
    setStudentQuery('');
    setShowCourseDropdown(false);
    setShowStudentDropdown(false);
  };

  const selectCourse = (c: Course) => {
    setCourseId(c.id);
    setCourseQuery(c.code ? `${c.code} — ${c.title}` : c.title);
    setShowCourseDropdown(false);
  };

  const selectStudent = (s: Student) => {
    setStudentId(s.id);
    setStudentQuery(s.name);
    setShowStudentDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-md font-medium mb-2">Enroll Student</h3>
      <div className="space-y-3">
        <div className="relative">
          <label className="block text-xs text-gray-500 mb-1">Course</label>
          <input
            value={courseQuery}
            onChange={(e) => { setCourseQuery(e.target.value); setShowCourseDropdown(true); }}
            onFocus={() => setShowCourseDropdown(true)}
            placeholder="Type to search courses..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {showCourseDropdown && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-auto">
              {filteredCourses.length === 0 ? (
                <li className="p-2 text-sm text-gray-500">No courses found</li>
              ) : (
                filteredCourses.map((c) => (
                  <li
                    key={c.id}
                    onMouseDown={() => selectCourse(c)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    {c.code ? `${c.code} — ${c.title}` : c.title}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs text-gray-500 mb-1">Student</label>
          <input
            value={studentQuery}
            onChange={(e) => { setStudentQuery(e.target.value); setShowStudentDropdown(true); }}
            onFocus={() => setShowStudentDropdown(true)}
            placeholder="Type to search students..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {showStudentDropdown && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-auto">
              {filteredStudents.length === 0 ? (
                <li className="p-2 text-sm text-gray-500">No students found</li>
              ) : (
                filteredStudents.map((s) => (
                  <li
                    key={s.id}
                    onMouseDown={() => selectStudent(s)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    {s.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleEnroll}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
