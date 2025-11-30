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
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '@/app/lib/courses.client';
import { getAllProfiles } from '@/app/lib/profiles.client';
import { getAllCategories } from '@/app/lib/categories.client';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, teachersData, categoriesData] = await Promise.all([
        getAllCourses(),
        getAllProfiles('teacher'),
        getAllCategories()
      ]);
      setCourses(coursesData || []);
      setTeachers(teachersData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // Note: We might need to join teacher/category names if they are not in the course object
    // Assuming course object has teacher_id and category_id, we might need to lookup names
    // For now, let's just filter by title
    teachers.find(t => t.id === course.teacher_id)?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categories.find(c => c.id === course.category_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createCourse({
        title: formData.title,
        teacher_id: formData.teacher_id,
        category_id: Number(formData.category_id),
        overview: formData.overview,
        description: formData.description,
        num_weeks: Number(formData.num_weeks),
        price: Number(formData.price),
      });
      await fetchData();
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedCourse) return;
    try {
      await updateCourse(selectedCourse.id, {
        title: formData.title,
        teacher_id: formData.teacher_id,
        category_id: Number(formData.category_id),
        overview: formData.overview,
        description: formData.description,
        num_weeks: Number(formData.num_weeks),
        price: Number(formData.price),
      });
      await fetchData();
      setIsEditOpen(false);
      setSelectedCourse(null);
      resetForm();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id);
      await fetchData();
      setIsDeleteOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const openEdit = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      teacher_id: course.teacher_id || '',
      category_id: String(course.category_id || ''),
      overview: course.overview || '',
      description: course.description || '',
      num_weeks: String(course.num_weeks || ''),
      price: String(course.price || ''),
    });
    setIsEditOpen(true);
  };

  const openDelete = (course: any) => {
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

  const getTeacherName = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
  };

  const getCategoryName = (id: number) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };

  if (loading) return <div className="p-8">Loading courses...</div>;

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
                {/* <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Enrollments</th> */}
                
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <div className="truncate">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{getTeacherName(course.teacher_id)}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {getCategoryName(course.category_id)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.num_weeks} weeks</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.price?.toLocaleString()} DZD</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-500">{course.enrollments_count}</td> */}
                  
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
