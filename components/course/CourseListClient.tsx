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
}

export default function CourseListClient({ courses }: CourseListClientProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: null as string | null,
    instructor: null as string | null,
    duration: null as string | null,
  });

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
        onSearchChange={(value) =>
          setFilters((prev) => ({ ...prev, search: value }))
        }
        onCategoryChange={(value) =>
          setFilters((prev) => ({ ...prev, category: value }))
        }
        onInstructorChange={(value) =>
          setFilters((prev) => ({ ...prev, instructor: value }))
        }
        onDurationChange={(value) =>
          setFilters((prev) => ({ ...prev, duration: value }))
        }
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={String(course.id)}
                title={course.title}
                description={course.description || ""}
                category={course.categories?.name || "Uncategorized"}
                instructor={course.teacher?.name || "Unknown"}
                image={course.image || "/images/default-teacher.jpg"}
                duration={`${course.num_weeks ?? 0} weeks`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
