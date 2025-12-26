'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/admin/ui/alert-dialog';
import { Badge } from '@/components/admin/ui/badge';
import { Progress } from '@/components/admin/ui/progress';
import { getAllEnrollments, deleteEnrollment, updateEnrollmentProgress } from '@/app/lib/enrollments.client';
import { getAllCourses } from '@/app/lib/courses.client';
import { getAllProfiles } from '@/app/lib/profiles.client';
import { adminEnrollAction } from '@/app/lib/actions';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    progress: '',
    status: 'active' as 'active' | 'completed' | 'dropped',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        getAllEnrollments(),
        getAllProfiles('student'),
        getAllCourses()
      ]);
      setEnrollments(enrollmentsData || []);
      setStudents(studentsData || []);
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

  const filteredEnrollments = enrollments.filter(enrollment => {
    const studentName = enrollment.profiles?.name || enrollment.profiles?.email || 'Unknown';
    const courseTitle = enrollment.courses?.title || 'Unknown';
    
    const matchesSearch = 
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || String(enrollment.course_id) === courseFilter;
    // Status is not in the schema I saw earlier?
    // `enrollments` table: course_id, student_id, enrolled_at, progress.
    // It does NOT have status.
    // So status is likely derived from progress (100% = completed) or just not there.
    // I will assume status is not supported in DB yet, or I should check schema.
    // Schema: id, course_id, student_id, enrolled_at, progress, deleted_at.
    // No status column.
    // I will remove status filter and logic, or derive it.
    // Derived status: progress === 100 ? 'completed' : 'active'.
    const status = enrollment.progress === 100 ? 'completed' : 'active';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleCreate = async () => {
    try {
      const result = await adminEnrollAction(Number(formData.course_id), formData.student_id);
      if (!result.success) {
        throw new Error(result.error);
      }
      await fetchData();
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      alert(`Failed to create enrollment: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = async () => {
    if (!selectedEnrollment) return;
    try {
      await updateEnrollmentProgress(selectedEnrollment.id, Number(formData.progress));
      await fetchData();
      setIsEditOpen(false);
      setSelectedEnrollment(null);
      resetForm();
    } catch (error: any) {
      console.error('Error updating enrollment:', error);
      alert(`Failed to update enrollment: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedEnrollment) return;
    try {
      await deleteEnrollment(selectedEnrollment.id);
      await fetchData();
      setIsDeleteOpen(false);
      setSelectedEnrollment(null);
    } catch (error: any) {
      console.error('Error deleting enrollment:', error);
      alert(`Failed to delete enrollment: ${error.message || 'Unknown error'}`);
    }
  };

  const openEdit = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setFormData({
      student_id: enrollment.student_id,
      course_id: String(enrollment.course_id),
      progress: String(enrollment.progress),
      status: enrollment.progress === 100 ? 'completed' : 'active',
    });
    setIsEditOpen(true);
  };

  const openDelete = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      course_id: '',
      progress: '',
      status: 'active',
    });
  };

  const getStatusBadgeVariant = (progress: number) => {
    return progress === 100 ? 'default' : 'outline';
  };

  const getStatusColor = (progress: number) => {
    return progress === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200';
  };

  if (loading) return <div className="p-8">Loading enrollments...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrollments Management</h1>
          <p className="text-gray-500">Manage student course enrollments</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Enrollment
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by student or course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {enrollment.profiles?.name || enrollment.profiles?.email || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">{enrollment.courses?.title || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Progress value={enrollment.progress} className="w-20 h-2" />
                      <span className="text-xs text-gray-600 min-w-[3rem]">{enrollment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={getStatusBadgeVariant(enrollment.progress)} className={getStatusColor(enrollment.progress)}>
                      {enrollment.progress === 100 ? 'Completed' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(enrollment)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(enrollment)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Enrollment</DialogTitle>
            <DialogDescription>
              Enroll a student in a course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student *</Label>
              <Select value={formData.student_id} onValueChange={(value) => setFormData({ ...formData, student_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name || student.email || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select value={formData.course_id} onValueChange={(value) => setFormData({ ...formData, course_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!formData.student_id || !formData.course_id}
            >
              Create Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Enrollment</DialogTitle>
            <DialogDescription>
              Update the enrollment progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-progress">Progress (0-100) *</Label>
              <Input
                id="edit-progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedEnrollment(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
              Update Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the enrollment for &quot;{selectedEnrollment?.profiles?.name || 'Unknown'}&quot; from &quot;{selectedEnrollment?.courses?.title || 'Unknown'}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteOpen(false); setSelectedEnrollment(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
