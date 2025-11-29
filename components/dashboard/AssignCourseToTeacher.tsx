"use client";
import React, { useState } from 'react';

type Course = {
  id: number;
  title: string;
  code?: string;
};

type Teacher = {
  id: string;
  name: string;
};

interface Props {
  courses: Course[];
  teachers: Teacher[];
  onAssign: (courseId: number, teacherId: string) => void;
}

export default function AssignCourseToTeacher({ courses, teachers, onAssign }: Props) {
  const [courseId, setCourseId] = useState<number | ''>(courses?.[0]?.id ?? '');
  const [teacherId, setTeacherId] = useState<string>(teachers?.[0]?.id ?? '');

  // Searchable query states
  const [courseQuery, setCourseQuery] = useState('');
  const [teacherQuery, setTeacherQuery] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  const filteredCourses = courses.filter((c) => {
    const label = c.code ? `${c.code} — ${c.title}` : c.title;
    return label.toLowerCase().includes(courseQuery.toLowerCase());
  });

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(teacherQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!courseId || !teacherId) {
      alert('Please select both a course and a teacher');
      return;
    }
    onAssign(Number(courseId), teacherId);
    // clear queries after assign
    setCourseQuery('');
    setTeacherQuery('');
    setShowCourseDropdown(false);
    setShowTeacherDropdown(false);
  };

  const selectCourse = (c: Course) => {
    setCourseId(c.id);
    setCourseQuery(c.code ? `${c.code} — ${c.title}` : c.title);
    setShowCourseDropdown(false);
  };

  const selectTeacher = (t: Teacher) => {
    setTeacherId(t.id);
    setTeacherQuery(t.name);
    setShowTeacherDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-md font-medium mb-2">Assign Course</h3>
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
          <label className="block text-xs text-gray-500 mb-1">Teacher</label>
          <input
            value={teacherQuery}
            onChange={(e) => { setTeacherQuery(e.target.value); setShowTeacherDropdown(true); }}
            onFocus={() => setShowTeacherDropdown(true)}
            placeholder="Type to search teachers..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {showTeacherDropdown && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-auto">
              {filteredTeachers.length === 0 ? (
                <li className="p-2 text-sm text-gray-500">No teachers found</li>
              ) : (
                filteredTeachers.map((t) => (
                  <li
                    key={t.id}
                    onMouseDown={() => selectTeacher(t)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    {t.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAssign}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
