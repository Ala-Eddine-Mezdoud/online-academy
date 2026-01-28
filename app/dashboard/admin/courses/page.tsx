'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
import { getLearningsByCourse } from '@/app/lib/course_learnings.client';
import { getSyllabusByCourse } from '@/app/lib/course_syllabus.client';
import { getFaqByCourse } from '@/app/lib/course_faq.client';
import { 
  adminCreateCourseLearnings, 
  adminCreateCourseSyllabus, 
  adminCreateCourseFaq,
  adminUpdateCourseLearnings,
  adminUpdateCourseSyllabus,
  adminUpdateCourseFaq
} from '@/app/lib/actions';

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
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data for course basic info
  const [formData, setFormData] = useState({
    title: '',
    teacher_id: '',
    category_id: '',
    overview: '',
    description: '',
    num_weeks: '',
    price: '',
  });

  // Form data for course learnings (what you'll learn)
  const [learnings, setLearnings] = useState<{ id?: number; content: string }[]>([]);
  
  // Form data for course syllabus
  const [syllabus, setSyllabus] = useState<{ id?: number; week_number: number; title: string; content: string }[]>([]);
  
  // Form data for course FAQ
  const [faqs, setFaqs] = useState<{ id?: number; question: string; answer: string }[]>([]);

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'What You\'ll Learn' },
    { number: 3, title: 'Syllabus' },
    { number: 4, title: 'FAQ' },
  ];

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
    teachers.find(t => t.id === course.teacher_id)?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categories.find(c => c.id === course.category_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      // Step 1: Create the course
      const newCourse = await createCourse({
        title: formData.title,
        teacher_id: formData.teacher_id,
        category_id: Number(formData.category_id),
        overview: formData.overview,
        description: formData.description,
        num_weeks: Number(formData.num_weeks),
        price: Number(formData.price),
      });

      if (newCourse?.id) {
        // Step 2: Create learnings
        if (learnings.length > 0) {
          await adminCreateCourseLearnings(newCourse.id, learnings);
        }

        // Step 3: Create syllabus
        if (syllabus.length > 0) {
          await adminCreateCourseSyllabus(newCourse.id, syllabus);
        }

        // Step 4: Create FAQs
        if (faqs.length > 0) {
          await adminCreateCourseFaq(newCourse.id, faqs);
        }
      }

      await fetchData();
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating course:', error?.message || error);
      alert('Failed to create course: ' + (error?.message || 'Unknown error'));
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

      // Update learnings
      await adminUpdateCourseLearnings(selectedCourse.id, learnings);

      // Update syllabus
      await adminUpdateCourseSyllabus(selectedCourse.id, syllabus);

      // Update FAQs
      await adminUpdateCourseFaq(selectedCourse.id, faqs);

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

  const openEdit = async (course: any) => {
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

    // Fetch existing course details
    try {
      const [courseLearnings, courseSyllabus, courseFaqs] = await Promise.all([
        getLearningsByCourse(course.id),
        getSyllabusByCourse(course.id),
        getFaqByCourse(course.id)
      ]);
      
      setLearnings(courseLearnings?.map(l => ({ id: l.id, content: l.content || '' })) || []);
      setSyllabus(courseSyllabus?.map(s => ({ id: s.id, week_number: s.week_number || 1, title: s.title || '', content: s.content || '' })) || []);
      setFaqs(courseFaqs?.map(f => ({ id: f.id, question: f.question || '', answer: f.answer || '' })) || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setLearnings([]);
      setSyllabus([]);
      setFaqs([]);
    }

    setCurrentStep(1);
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
    setLearnings([]);
    setSyllabus([]);
    setFaqs([]);
    setCurrentStep(1);
  };

  const openCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const getTeacherName = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    return teacher ? teacher.name : 'Unknown';
  };

  const getCategoryName = (id: number) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Render step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === step.number
                ? 'bg-blue-500 text-white'
                : currentStep > step.number
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
          </div>
          <span className={`ml-2 text-sm ${currentStep === step.number ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // Render Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-4">
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
                  {teacher.name || 'Unknown'}
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
  );

  // Render Step 2: What You'll Learn
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>What You&apos;ll Learn</Label>
          <p className="text-sm text-gray-500">Add the key learning outcomes for this course</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLearnings([...learnings, { content: '' }])}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Learning
        </Button>
      </div>
      
      {learnings.map((learning, index) => (
        <div key={index} className="flex gap-2 items-start">
          <Input
            placeholder="e.g., Build responsive websites with HTML, CSS, and JavaScript"
            value={learning.content}
            onChange={(e) => {
              const newLearnings = [...learnings];
              newLearnings[index].content = e.target.value;
              setLearnings(newLearnings);
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLearnings(learnings.filter((_, i) => i !== index))}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      
      {learnings.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No learning outcomes added yet. Click &quot;Add Learning&quot; to add one.</p>
      )}
    </div>
  );

  // Render Step 3: Syllabus
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Course Syllabus</Label>
          <p className="text-sm text-gray-500">Add weekly topics and content</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSyllabus([...syllabus, { week_number: syllabus.length + 1, title: '', content: '' }])}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Week
        </Button>
      </div>
      
      {syllabus.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Week {item.week_number}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSyllabus(syllabus.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Input
                type="number"
                min="1"
                placeholder="Week #"
                value={item.week_number}
                onChange={(e) => {
                  const newSyllabus = [...syllabus];
                  newSyllabus[index].week_number = Number(e.target.value);
                  setSyllabus(newSyllabus);
                }}
              />
            </div>
            <div className="col-span-3">
              <Input
                placeholder="Week title (e.g., Introduction to HTML)"
                value={item.title}
                onChange={(e) => {
                  const newSyllabus = [...syllabus];
                  newSyllabus[index].title = e.target.value;
                  setSyllabus(newSyllabus);
                }}
              />
            </div>
          </div>
          <Textarea
            placeholder="Week content/description..."
            value={item.content}
            onChange={(e) => {
              const newSyllabus = [...syllabus];
              newSyllabus[index].content = e.target.value;
              setSyllabus(newSyllabus);
            }}
            rows={2}
          />
        </div>
      ))}
      
      {syllabus.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No syllabus items added yet. Click &quot;Add Week&quot; to add one.</p>
      )}
    </div>
  );

  // Render Step 4: FAQ
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Frequently Asked Questions</Label>
          <p className="text-sm text-gray-500">Add common questions and answers about the course</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add FAQ
        </Button>
      </div>
      
      {faqs.map((faq, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">FAQ #{index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Input
            placeholder="Question (e.g., What prerequisites do I need?)"
            value={faq.question}
            onChange={(e) => {
              const newFaqs = [...faqs];
              newFaqs[index].question = e.target.value;
              setFaqs(newFaqs);
            }}
          />
          <Textarea
            placeholder="Answer..."
            value={faq.answer}
            onChange={(e) => {
              const newFaqs = [...faqs];
              newFaqs[index].answer = e.target.value;
              setFaqs(newFaqs);
            }}
            rows={2}
          />
        </div>
      ))}
      
      {faqs.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No FAQs added yet. Click &quot;Add FAQ&quot; to add one.</p>
      )}
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
          <p className="text-gray-500">Manage your platform courses</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-500 hover:bg-blue-600">
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

      {/* Create Dialog - Multi-step wizard */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsCreateOpen(open); }}>
        <DialogContent className="sm:max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course for the platform. Complete all steps to add the course.
            </DialogDescription>
          </DialogHeader>
          
          <StepIndicator />
          
          <div className="py-4">
            {renderStepContent()}
          </div>
          
          <DialogFooter className="flex justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                Cancel
              </Button>
              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleCreate} className="bg-green-500 hover:bg-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  Create Course
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Multi-step wizard */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) { setSelectedCourse(null); resetForm(); } setIsEditOpen(open); }}>
        <DialogContent className="sm:max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course information. Navigate through the steps to edit all details.
            </DialogDescription>
          </DialogHeader>
          
          <StepIndicator />
          
          <div className="py-4">
            {renderStepContent()}
          </div>
          
          <DialogFooter className="flex justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedCourse(null); resetForm(); }}>
                Cancel
              </Button>
              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleEdit} className="bg-green-500 hover:bg-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  Update Course
                </Button>
              )}
            </div>
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
