"use client";
import React, { useState } from 'react';
import { Bell, BookOpen, Layers, Search, Users } from 'lucide-react';
import { teachers as initialTeachers, courses as initialCourses, Teacher, NewTeacher, Course } from '@/app/lib/mockData';
import Modal from '@/modals/AddModal';
import AssignCourseToTeacher from '@/components/dashboard/AssignCourseToTeacher';
import Link from 'next/link'; 
import { StatCard } from "@/components/dashboard/StatCard";
export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [courses, setCourses] = useState<Course[]>(initialCourses ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const uniqueMajorsCount = new Set(teachers.map((t) => t.department ?? '')).size;

  const filteredTeachers = teachers.filter((teacher) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = teacher.name.toLowerCase().includes(q) ||
                         (teacher.email ?? '').toLowerCase().includes(q) ||
                         (teacher.department ?? '').toLowerCase().includes(q);
    return matchesSearch;
  });

  const handleAddTeacher = (teacherData: NewTeacher) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : `${Date.now()}-${Math.floor(Math.random()*100000)}`;
    const newTeacher: Teacher = {
      id,
      ...teacherData,
    };
    setTeachers([...teachers, newTeacher]);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    const newName = prompt('Edit teacher name:', teacher.name);
    if (newName && newName !== teacher.name) {
      setTeachers(teachers.map(t => 
        t.id === teacher.id ? { ...t, name: newName } : t
      ));
      alert('Teacher updated successfully!');
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== teacherId));
      alert('Teacher deleted successfully!');
    }
  };

  const handleAssignCourse = (courseId: number, teacherId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, teacher_id: teacherId, assignedTeacher: teachers.find(t => t.id === teacherId)?.name ?? '' } : c));
    alert('Course assigned to teacher successfully');
  };

  

return (
  <>
    {/* MAIN PAGE CONTENT */}
    <div className="flex-1 bg-gray-50 overflow-auto">
     

      <div className="p-8">
      
         {/* Stats */}
<div className="grid grid-cols-3 gap-4 mb-8">
  <StatCard
              title="Total Teachers"
              value={teachers.length.toString()}
              icon={(props) => <Users {...props} />}
              color="blue"
            />

  <StatCard
    title="Total Courses"
    value={courses.length.toString()}
    icon={() => <BookOpen />}
    color="orange"
  />

  <StatCard
    title="Total Departements"
    value={uniqueMajorsCount.toString()}
    icon={() => < Layers/>}
    color="cyan"
  />
</div>

        {/* TABLE + Actions (two-column) */}
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">All Teachers</h3>
                    <p className="text-xs text-gray-500">Complete list of all teacher accounts.</p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                  >
                    + Add Teacher
                  </button>
                </div>

                {/* Search + Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search teachers..."
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
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Department</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 table-text">{teacher.name}</td>
                        <td className="px-4 py-2 table-text">{teacher.email}</td>
                        <td className="px-4 py-2 table-text">{teacher.department}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleEditTeacher(teacher)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                            <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-xs text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTeachers.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">No teachers found matching your criteria.</div>
              )}
            </div>
          </div>

          <aside className="w-80">
            <AssignCourseToTeacher courses={courses} teachers={teachers} onAssign={handleAssignCourse} />
          </aside>
        </div>
      </div>
    </div>

    {/* MODAL — now outside the scrollable page */}
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
            name: String(formData.get('name') || ''),
            email: String(formData.get('email') || ''),
            department: String(formData.get('department') || 'Computer Science'),
          };

          handleAddTeacher(teacherData);
          setIsAddModalOpen(false);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm mb-2">Teacher Name</label>
          <input name="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>

        <div>
          <label className="block text-sm mb-2">Email Address</label>
          <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>

        <div>
          <label className="block text-sm mb-2">Department</label>
          <select name="department" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Status</label>
          <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Active</option>
            <option>Inactive</option>
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
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Add Teacher
          </button>
        </div>
      </form>
    </Modal>
  </>
);
}