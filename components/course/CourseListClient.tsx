"use client";

import { useMemo, useState } from "react";

import CourseFilters from "@/components/course/CourseFilters";
import CourseCard from "@/components/course/CourseCard";

import { getCoursesPageData } from "@/app/models/course.model";

export type CourseListItem = Awaited<
  ReturnType<typeof getCoursesPageData>
>[number];

interface CourseListClientProps {
  courses: CourseListItem[];
  basePath?: string;
  itemsPerPage?: number;
}

export default function CourseListClient({ courses, basePath, itemsPerPage = 6 }: CourseListClientProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: null as string | null,
    instructor: null as string | null,
    duration: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch = search
        ? (course.title || "").toLowerCase().includes(search) ||
          (course.description || "").toLowerCase().includes(search)
        : true;

      const matchesCategory = filters.category
        ? course.categories?.name === filters.category
        : true;

      const matchesInstructor = filters.instructor
        ? course.teacher?.name === filters.instructor
        : true;

      const matchesDuration = filters.duration
        ? String(course.num_weeks ?? "") === filters.duration
        : true;

      return (
        matchesSearch && matchesCategory && matchesInstructor && matchesDuration
      );
    });
  }, [courses, filters]);

  // Reset to page 1 when filters change
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  // Reset page when filters change
  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((course) => {
      if (course.categories?.name) set.add(course.categories.name);
    });
    return Array.from(set).map((name) => ({ value: name, label: name }));
  }, [courses]);

  const instructorOptions = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((course) => {
      if (course.teacher?.name) set.add(course.teacher.name);
    });
    return Array.from(set).map((name) => ({ value: name, label: name }));
  }, [courses]);

  const durationOptions = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((course) => {
      if (typeof course.num_weeks === "number")
        set.add(String(course.num_weeks));
    });
    return Array.from(set)
      .sort((a, b) => Number(a) - Number(b))
      .map((weeks) => ({ value: weeks, label: `${weeks} weeks` }));
  }, [courses]);

  return (
    <div className="space-y-4">
      <CourseFilters
        search={filters.search}
        category={filters.category}
        instructor={filters.instructor}
        duration={filters.duration}
        onSearchChange={(value) => handleFilterChange("search", value)}
        onCategoryChange={(value) => handleFilterChange("category", value)}
        onInstructorChange={(value) => handleFilterChange("instructor", value)}
        onDurationChange={(value) => handleFilterChange("duration", value)}
        categories={categoryOptions}
        instructors={instructorOptions}
        durations={durationOptions}
      />

      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-3xl font-bold text-slate-900">
            Available Courses ({filteredCourses.length})
          </h2>
        </div>

        {filteredCourses.length === 0 ? (
          <p className="text-neutral-600">
            No courses match the selected filters.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={String(course.id)}
                  title={course.title}
                  description={course.description || ""}
                  category={course.categories?.name || "Uncategorized"}
                  instructor={course.teacher?.name || "Unknown"}
                  image={course.image || "/images/default-teacher.jpg"}
                  duration={`${course.num_weeks ?? 0} weeks`}
                  price={typeof course.price === 'number' ? course.price : null}
                  basePath={basePath}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
