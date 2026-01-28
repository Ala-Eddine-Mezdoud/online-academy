import CourseListClient from "@/components/course/CourseListClient";
import { getCoursesPageData } from "@/app/models/course.model";
import { getMyEnrollments } from "@/app/models/enrollment.model";

export default async function EnrollInCoursesPage() {
  const [allCourses, myEnrollments] = await Promise.all([
    getCoursesPageData(),
    getMyEnrollments(),
  ]);

  // Exclude courses the student is already enrolled in
  const enrolledCourseIds = new Set(
    (myEnrollments || []).map((e) => e.course_id)
  );
  const courses = allCourses.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <section className="py-8 px-6 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Enroll in Courses
        </h1>
        <p className="max-w-2xl text-base text-neutral-600">
          Browse available courses and enroll to start learning.
        </p>
      </header>

      <CourseListClient courses={courses} basePath="/dashboard/student/enroll" />
    </section>
  );
}

