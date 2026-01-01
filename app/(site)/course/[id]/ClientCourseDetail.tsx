"use client";

import { useCallback, useEffect, useState } from "react";

import { CourseFAQ } from "@/components/course/details/CourseFAQ";
import { CourseHero } from "@/components/course/details/CourseHero";
import { CourseLearnings } from "@/components/course/details/CourseLearnings";
import { CourseOverview } from "@/components/course/details/CourseOverview";
import { CourseSyllabus } from "@/components/course/details/CourseSyllabus";
import { InstructorSpotlight } from "@/components/course/details/InstructorSpotlight";
import { StudentReviews } from "@/components/course/details/StudentReviews";
import {
  getFaqByCourse,
  getLearningsByCourse,
  getReviewsByCourse,
  getSyllabusByCourse,
} from "@/app/models/course-content.model";
import { getEnrollmentsByCourse } from "@/app/models/enrollment.model";
import { getCourseById } from "@/app/models/course.model";
import { getProfileById } from "@/app/models/profile.model";
import type { Database } from "@/app/lib/supabase/database.types";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LearningRow = Database["public"]["Tables"]["course_learnings"]["Row"];
type SyllabusRow = Database["public"]["Tables"]["course_syllabus"]["Row"];
type FaqRow = Database["public"]["Tables"]["course_faq"]["Row"];
type ReviewResponse = Awaited<ReturnType<typeof getReviewsByCourse>>;
type ReviewRow = ReviewResponse extends Array<infer R> ? R : never;

type LessonModule = {
  title: string;
  lessons: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

const parseLessonContent = (value?: string | null) => {
  if (!value) return [] as string[];
  return value
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const normalizeLearnings = (rows: LearningRow[] = []) =>
  rows
    .map((item) => item.content?.trim() ?? "")
    .filter((lesson): lesson is string => Boolean(lesson));

const normalizeSyllabus = (rows: SyllabusRow[] = []): LessonModule[] =>
  rows.map((row) => ({
    title:
      row.title?.trim() ??
      (typeof row.week_number === "number"
        ? `Week ${row.week_number}`
        : "Course Module"),
    lessons: parseLessonContent(row.content),
  }));

const normalizeFaqs = (rows: FaqRow[] = []): FaqItem[] =>
  rows
    .map((row) => ({
      question: row.question?.trim() ?? "",
      answer: row.answer?.trim() ?? "",
    }))
    .filter((item) => item.question && item.answer);

const formatReviewDate = (value?: string | null) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function ClientCourseDetail({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [teacher, setTeacher] = useState<ProfileRow | null>(null);
  const [learningItems, setLearningItems] = useState<string[]>([]);
  const [syllabusModules, setSyllabusModules] = useState<LessonModule[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    const numericCourseId = Number(courseId);
    if (!courseId || Number.isNaN(numericCourseId)) {
      setError("Invalid course identifier.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const courseResponse = await getCourseById(courseId);
      if (!courseResponse) {
        throw new Error("Course not found.");
      }

      const [
        learningsResponse,
        syllabusResponse,
        faqResponse,
        reviewsResponse,
        enrollmentsResponse,
        teacherProfile,
      ] = await Promise.all([
        getLearningsByCourse(numericCourseId),
        getSyllabusByCourse(numericCourseId),
        getFaqByCourse(numericCourseId),
        getReviewsByCourse(numericCourseId),
        getEnrollmentsByCourse(numericCourseId),
        courseResponse.teacher_id
          ? getProfileById(courseResponse.teacher_id)
          : Promise.resolve(null),
      ]);

      setCourse(courseResponse as CourseRow);
      setTeacher((teacherProfile ?? null) as ProfileRow | null);
      setLearningItems(normalizeLearnings(learningsResponse as LearningRow[]));
      setSyllabusModules(normalizeSyllabus(syllabusResponse as SyllabusRow[]));
      setFaqItems(normalizeFaqs(faqResponse as FaqRow[]));
      setReviews((reviewsResponse ?? []) as ReviewRow[]);
      setEnrollmentCount(enrollmentsResponse?.length ?? 0);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unable to load course details."
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <p className="text-base font-medium text-slate-600">
          Loading course details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-lg font-semibold text-slate-900">
          We could not load this course.
        </p>
        <p className="text-sm text-slate-600">{error}</p>
        <button
          type="button"
          className="rounded-md bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-400"
          onClick={loadCourse}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <p className="text-base text-slate-600">
          Course details are unavailable.
        </p>
      </div>
    );
  }

  const lessonsToDisplay = learningItems.length
    ? learningItems
    : ["Learning outcomes will be published soon."];

  const modulesToDisplay = (
    syllabusModules.length
      ? syllabusModules
      : [
          {
            title: "Syllabus coming soon",
            lessons: [
              "We are curating the detailed breakdown for this course.",
            ],
          },
        ]
  ).map((module) => ({
    title: module.title,
    lessons: module.lessons.length
      ? module.lessons
      : ["Module content will be shared shortly."],
  }));

  const faqToDisplay = faqItems.length
    ? faqItems
    : [
        {
          question: "Need course specifics?",
          answer:
            "The teaching team is updating the FAQ for this course. Please check back soon.",
        },
      ];

  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
      reviewCount
    : 0;
  const ratingSummary = `${averageRating.toFixed(1)} out of 5`;

  const reviewEntries = reviews.map((review) => ({
    id: String(review.id),
    name: review.student?.name ?? "Anonymous Learner",
    date: formatReviewDate(review.created_at),
    quote:
      review.comment?.trim() ??
      "This learner left a rating without a written review.",
    rating: Math.max(0, Math.min(5, review.rating ?? 0)),
    avatar: review.student?.profile_image ?? undefined,
  }));

  const durationLabel = course.num_weeks
    ? `${course.num_weeks} Week${course.num_weeks === 1 ? "" : "s"}`
    : "Self-paced";
  const studentsLabel = enrollmentCount
    ? `${enrollmentCount.toLocaleString()} Learner${enrollmentCount === 1 ? "" : "s"}`
    : "Be the first learner";
  const levelLabel = "All Levels";
  const heroImage = course.image ?? "/images/webdev-pic.jpg";
  const courseDescription =
    course.description ??
    course.overview ??
    "Description will be available soon.";
  const overviewContent =
    course.overview ?? course.description ?? "Overview will be available soon.";

  const instructorProps = {
    name: teacher?.name ?? "Course Instructor",
    title: teacher?.role_title ?? "Instructor",
    bio: teacher?.description ?? "Instructor biography is being updated.",
    image: teacher?.profile_image ?? "/images/teacher-pic.avif",
    linkLabel: teacher?.name
      ? `See all courses by ${teacher.name}`
      : "Meet the instructor",
  };

  return (
    <div className=" py-8 ">
      <div className="container mx-auto flex flex-col gap-14 ">
        <CourseHero
          title={course.title}
          description={courseDescription}
          duration={durationLabel}
          students={studentsLabel}
          level={levelLabel}
          primaryCta="Enroll Now"
          secondaryCta="View Syllabus"
          image={heroImage}
        />
        <CourseOverview title="Overview" content={overviewContent} />
        <CourseLearnings lessons={lessonsToDisplay} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
          <div className="flex flex-col gap-6">
            <CourseSyllabus modules={modulesToDisplay} />
            <InstructorSpotlight {...instructorProps} />
          </div>
          <StudentReviews
            ratingSummary={ratingSummary}
            reviewCount={reviewCount}
            reviews={reviewEntries}
          />
        </div>
        <div className="max-w-4xl self-center md:w-3/4">
          <CourseFAQ items={faqToDisplay} />
        </div>
      </div>
    </div>
  );
}
