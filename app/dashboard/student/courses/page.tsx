'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/admin/ui/alert-dialog';
import { Badge } from '@/components/admin/ui/badge';
import { getMyEnrolledCourses, createCourse, updateCourse, deleteCourse } from '@/app/lib/courses.client';
import { useActiveLiveSessions } from '@/app/lib/queries/useLiveSessions';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  // teachers/categories removed; use nested values from course objects
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    teacher_id: '',
    category_id: '',
    overview: '',
    description: '',
    num_weeks: '',
    price: '',
  });

  // Active live sessions for courses the current student is enrolled in
  const { data: activeSessions = [], isLoading: sessionsLoading } = useActiveLiveSessions();
  // Notifications removed per request

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesData = await getMyEnrolledCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course: any) => {
    const q = searchQuery.toLowerCase();
    const title = (course.title || '').toLowerCase();
    const teacher = (course.teacher?.name || '').toLowerCase();
    const category = (course.categories?.name || '').toLowerCase();
    return title.includes(q) || teacher.includes(q) || category.includes(q);
  });





  const getTeacherName = (course: any) => {
    return course?.teacher?.name || 'Unknown';
  };

  const getCategoryName = (course: any) => {
    return course?.categories?.name || 'Unknown';
  };

  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
          <p className="text-gray-500">Manage your platform courses</p>
        </div>
        {/* Notifications UI removed */}
      </div>

      {/* Notifications list removed */}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses by title, teacher, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredCourses.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-6">
                      Teacher: <span className="font-medium text-gray-900">{getTeacherName(course)}</span>
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">
                      </div>
                      {/* Join session button if a live session is active for this course */}
                      {(() => {
                        const session = activeSessions.find((s: any) => s.course_id === course.id);
                        if (session) {
                          return (
                            <a
                              href={session.session_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600 transition"
                            >
                              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                              Join Session
                            </a>
                          );
                        }
                        return <span className="text-xs text-slate-500">No live session</span>;
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification dialog removed */}




    </div>
  );
}
