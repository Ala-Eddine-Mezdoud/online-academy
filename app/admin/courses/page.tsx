'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/admin/ui/alert-dialog';
import { Badge } from '@/components/admin/ui/badge';
import { courses as initialCourses, teachers, categories, Course } from '@/lib/mockData';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    teacher_id: '',
    category_id: '',
    overview: '',
    description: '',
    num_weeks: '',
    price: '',
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    const teacher = teachers.find(t => t.id === formData.teacher_id);
    const category = categories.find(c => c.id === Number(formData.category_id));
    
    const newCourse: Course = {
      id: Date.now(),
      title: formData.title,
      teacher_id: formData.teacher_id,
      teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : '',
      category_id: Number(formData.category_id),
      category_name: category?.name || '',
      overview: formData.overview,
      description: formData.description,
      num_weeks: Number(formData.num_weeks),
      price: Number(formData.price),
      created_at: new Date().toISOString(),
      enrollments_count: 0
    };
    setCourses([...courses, newCourse]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCourse) return;
    
    const teacher = teachers.find(t => t.id === formData.teacher_id);
    const category = categories.find(c => c.id === Number(formData.category_id));
    
    setCourses(courses.map(c => 
      c.id === selectedCourse.id 
        ? { 
            ...c,
            title: formData.title,
            teacher_id: formData.teacher_id,
            teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : c.teacher_name,
            category_id: Number(formData.category_id),
            category_name: category?.name || c.category_name,
            overview: formData.overview,
            description: formData.description,
            num_weeks: Number(formData.num_weeks),
            price: Number(formData.price),
          }
        : c
    ));
    setIsEditOpen(false);
    setSelectedCourse(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedCourse) return;
    setCourses(courses.filter(c => c.id !== selectedCourse.id));
    setIsDeleteOpen(false);
    setSelectedCourse(null);
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      teacher_id: course.teacher_id,
      category_id: String(course.category_id),
      overview: course.overview || '',
      description: course.description || '',
      num_weeks: String(course.num_weeks),
      price: String(course.price),
    });
    setIsEditOpen(true);
  };

  const openDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      teacher_id: '',
      category_id: '',
      overview: '',
      description: '',
      num_weeks: '',
      price: '',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
          <p className="text-gray-500">Manage your platform courses</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Enrollments</th>
                
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <div className="truncate">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.teacher_name}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {course.category_name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.num_weeks} weeks</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.price.toLocaleString()} DZD</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.enrollments_count}</td>
                  
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(course)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(course)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course for the platform. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Complete Web Development Bootcamp"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher *</Label>
                <Select value={formData.teacher_id} onValueChange={(value: string) => setFormData({ ...formData, teacher_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value: string) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview">Overview</Label>
              <Input
                id="overview"
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="A brief one-line description of the course"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed course description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weeks">Number of Weeks *</Label>
                <Input
                  id="weeks"
                  type="number"
                  min="1"
                  value={formData.num_weeks}
                  onChange={(e) => setFormData({ ...formData, num_weeks: e.target.value })}
                  placeholder="12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (DZD) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="15000"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Course Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-teacher">Teacher *</Label>
                <Select value={formData.teacher_id} onValueChange={(value: string) => setFormData({ ...formData, teacher_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value: string) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-overview">Overview</Label>
              <Input
                id="edit-overview"
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-weeks">Number of Weeks *</Label>
                <Input
                  id="edit-weeks"
                  type="number"
                  min="1"
                  value={formData.num_weeks}
                  onChange={(e) => setFormData({ ...formData, num_weeks: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (DZD) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedCourse(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
              Update Course
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
              This will permanently delete the course &quot;{selectedCourse?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsDeleteOpen(false); setSelectedCourse(null); }}>
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
