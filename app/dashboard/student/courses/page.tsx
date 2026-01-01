'use client';

import { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/admin/ui/input';
import { Button } from '@/components/admin/ui/button';
import { Textarea } from '@/components/admin/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/admin/ui/dialog';
import { Label } from '@/components/admin/ui/label';
import { useActiveLiveSessions } from '@/app/lib/queries/useLiveSessions';
import { createBrowserSupabase } from '@/app/lib/supabase/supabase';
import { createReview, updateReview } from '@/app/lib/course_reviews.client';

type EnrolledCourse = {
  id: number;
  title: string;
  image: string | null;
  num_weeks: number | null;
  enrolled_at: string;
  teacher: { name: string } | null;
  categories: { name: string } | null;
  myReview: {
    id: number;
    rating: number;
    comment: string | null;
  } | null;
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: activeSessions = [] } = useActiveLiveSessions();

  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserSupabase();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setCourses([]);
        return;
      }

      const userId = authData.user.id;
      const { data: enrollments, error: enrollErr } = await supabase
        .from('enrollments')
        .select(`
          enrolled_at,
          courses (
            id,
            title,
            image,
            num_weeks,
            teacher:teacher_id (name),
            categories:category_id (name)
          )
        `)
        .eq('student_id', userId)
        .is('deleted_at', null);

      if (enrollErr) throw enrollErr;

      // Fetch user's reviews
      const { data: reviews, error: reviewErr } = await supabase
        .from('course_reviews')
        .select('id, course_id, rating, comment')
        .eq('student_id', userId);

      if (reviewErr) throw reviewErr;

      const mappedCourses: EnrolledCourse[] = (enrollments || [])
        .filter((e: any) => e.courses)
        .map((e: any) => {
          const course = e.courses;
          const review = reviews?.find((r: any) => r.course_id === course.id && r.rating !== null);
          return {
            id: course.id,
            title: course.title,
            image: course.image,
            num_weeks: course.num_weeks,
            enrolled_at: e.enrolled_at,
            teacher: course.teacher,
            categories: course.categories,
            myReview: review ? {
              id: review.id,
              rating: review.rating as number,
              comment: review.comment
            } : null
          };
        });

      setCourses(mappedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.toLowerCase();
    const title = (course.title || '').toLowerCase();
    const teacher = (course.teacher?.name || '').toLowerCase();
    const category = (course.categories?.name || '').toLowerCase();
    return title.includes(q) || teacher.includes(q) || category.includes(q);
  });

  const getTeacherName = (course: EnrolledCourse) => {
    return course.teacher?.name || 'Unknown';
  };

  // Check if course is completed (enrolled_at + num_weeks <= today)
  const isCourseCompleted = (course: EnrolledCourse): boolean => {
    if (!course.enrolled_at) return false;
    if (!course.num_weeks || course.num_weeks === 0) return true;
    const enrolledDate = new Date(course.enrolled_at);
    const completionDate = new Date(enrolledDate);
    completionDate.setDate(completionDate.getDate() + (course.num_weeks * 7));
    return new Date() >= completionDate;
  };

  const openReviewModal = (course: EnrolledCourse) => {
    setSelectedCourse(course);
    setRating(course.myReview?.rating || 0);
    setComment(course.myReview?.comment || '');
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedCourse || rating === 0) return;
    setSubmitting(true);
    try {
      if (selectedCourse.myReview) {
        await updateReview(selectedCourse.myReview.id, { rating, comment: comment || null });
      } else {
        await createReview(selectedCourse.id, { rating, comment: comment || null });
      }
      await fetchData();
      setIsReviewOpen(false);
      setSelectedCourse(null);
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review: ' + (error?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-500">View your enrolled courses</p>
        </div>
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
          {filteredCourses.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCourses.map((course) => {
                const completed = isCourseCompleted(course);
                const hasReview = !!course.myReview;
                return (
                <div key={course.id} className="flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                  {/* Course Image */}
                  <div className="relative h-40 w-full bg-gray-200">
                    <img
                      src={course.image || '/images/webdev-pic.jpg'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/webdev-pic.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Teacher: <span className="font-medium text-gray-900">{getTeacherName(course)}</span>
                    </p>

                    {/* Review Section - only show when course is completed */}
                    {completed && (
                      <div className="mb-4">
                        {hasReview ? (
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= (course.myReview?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">Your rating</span>
                            <button onClick={() => openReviewModal(course)} className="text-xs text-blue-600 hover:underline ml-auto">Edit</button>
                          </div>
                        ) : (
                          <button onClick={() => openReviewModal(course)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Star className="w-4 h-4" />
                            Leave a review
                          </button>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end">
                      {(() => {
                        const session = activeSessions.find((s: any) => s.course_id === course.id);
                        if (session && session.session_link) {
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
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.myReview ? 'Edit Your Review' : 'Leave a Review'}</DialogTitle>
            <DialogDescription>Rate your experience with "{selectedCourse?.title}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 1 && 'Poor'}{rating === 2 && 'Fair'}{rating === 3 && 'Good'}{rating === 4 && 'Very Good'}{rating === 5 && 'Excellent'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea id="comment" placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={rating === 0 || submitting} className="bg-blue-500 hover:bg-blue-600">
              {submitting ? 'Submitting...' : selectedCourse?.myReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

