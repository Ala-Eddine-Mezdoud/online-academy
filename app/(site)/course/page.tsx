import CourseListClient from "@/components/course/CourseListClient";

import { getCoursesPageData } from "../../lib/courses.client";

export default async function Course() {
  const courses = await getCoursesPageData();

  return (
    <section className="py-32 space-y-16 container mx-auto ">
      <header className="space-y-4">
        <h1 className="text-5xl font-bold text-slate-900">
          Explore Our Courses
        </h1>
        <p className="max-w-3xl text-xl text-neutral-700">
          Discover a wide range of courses designed to elevate your skills and
          knowledge. Find the perfect learning path for you.
        </p>
      </header>

      <CourseListClient courses={courses} />
    </section>
  );
}
