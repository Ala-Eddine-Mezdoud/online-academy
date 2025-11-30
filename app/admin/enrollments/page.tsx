'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/admin/ui/alert-dialog';
import { Badge } from '@/components/admin/ui/badge';
import { Progress } from '@/components/admin/ui/progress';
import { enrollments as initialEnrollments, students, courses, Enrollment } from '@/lib/mockData';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    progress: '',
    status: 'active' as 'active' | 'completed' | 'dropped',
  });

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || enrollment.course_id === Number(courseFilter);
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleCreate = () => {
    const student = students.find(s => s.id === formData.student_id);
    const course = courses.find(c => c.id === Number(formData.course_id));
    
    const newEnrollment: Enrollment = {
      id: Date.now(),
      student_id: formData.student_id,
      student_name: student ? `${student.first_name} ${student.last_name}` : '',
      course_id: Number(formData.course_id),
      course_title: course?.title || '',
      enrollment_date: new Date().toISOString(),
      progress: Number(formData.progress),
      status: formData.status,
    };
    setEnrollments([...enrollments, newEnrollment]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedEnrollment) return;
    
    const student = students.find(s => s.id === formData.student_id);
    const course = courses.find(c => c.id === Number(formData.course_id));
    
    setEnrollments(enrollments.map(e => 
      e.id === selectedEnrollment.id 
        ? { 
            ...e,
            student_id: formData.student_id,
            student_name: student ? `${student.first_name} ${student.last_name}` : e.student_name,
            course_id: Number(formData.course_id),
            course_title: course?.title || e.course_title,
            progress: Number(formData.progress),
            status: formData.status,
          }
        : e
    ));
    setIsEditOpen(false);
    setSelectedEnrollment(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedEnrollment) return;
    setEnrollments(enrollments.filter(e => e.id !== selectedEnrollment.id));
    setIsDeleteOpen(false);
    setSelectedEnrollment(null);
  };

  const openEdit = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setFormData({
      student_id: enrollment.student_id,
      course_id: String(enrollment.course_id),
      progress: String(enrollment.progress),
      status: enrollment.status,
    });
    setIsEditOpen(true);
  };

  const openDelete = (enrollment: Enrollment) => {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'outline';
      case 'dropped':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'dropped':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return '';
    }
  };

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
                  <SelectItem value="dropped">Dropped</SelectItem>
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
                    {enrollment.student_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">{enrollment.course_title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Progress value={enrollment.progress} className="w-20 h-2" />
                      <span className="text-xs text-gray-600 min-w-[3rem]">{enrollment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={getStatusBadgeVariant(enrollment.status)} className={getStatusColor(enrollment.status)}>
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
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
              Enroll a student in a course. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student *</Label>
              <Select value={formData.student_id} onValueChange={(value: string) => setFormData({ ...formData, student_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select value={formData.course_id} onValueChange={(value: string) => setFormData({ ...formData, course_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
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

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (0-100) *</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'completed' | 'dropped') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">
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
              Update the enrollment information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-student">Student *</Label>
              <Select value={formData.student_id} onValueChange={(value: string) => setFormData({ ...formData, student_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course">Course *</Label>
              <Select value={formData.course_id} onValueChange={(value: string) => setFormData({ ...formData, course_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
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

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'completed' | 'dropped') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
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
              This will permanently delete the enrollment for &quot;{selectedEnrollment?.student_name}&quot; in &quot;{selectedEnrollment?.course_title}&quot;. This action cannot be undone.
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
