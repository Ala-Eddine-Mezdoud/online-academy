import CourseCard from "@/components/course/CourseCard";
import { TeacherHighlight } from "@/components/teacher/details/TeacherHighlight";
import { getProfileById } from "@/app/lib/profiles.client";
import { getCoursesByTeacher } from "@/app/lib/courses.client";

export default async function TeacherDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = (await getProfileById(id)) ?? null;
  const courses = (await getCoursesByTeacher(id)) ?? [];

  const teacherName = profile?.name ?? "Instructor";
  const teacherTitle = profile?.role_title ?? "Instructor";
  const teacherBio = profile?.description ?? "";
  const teacherImage = profile?.profile_image ?? "/images/teacher-pic.avif";

  return (
    <div>
      <div className="px-6 py-12 md:px-24 bg-white">
        <TeacherHighlight
          name={teacherName}
          title={teacherTitle}
          bio={teacherBio}
          image={teacherImage}
        />
      </div>
      <section className="px-6 md:px-24 mt-16 py-6 bg-neutral-100 w-full">
        <h2 className="text-3xl py-10 font-bold text-slate-900 text-center">
          Courses taught by {teacherName}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course: any) => (
            <CourseCard
              key={String(course.id)}
              id={String(course.id)}
              image={course.image ?? "/images/default-teacher.jpg"}
              category={course?.categories?.[0]?.name ?? "General"}
              title={course.title ?? "Untitled Course"}
              instructor={course?.teacher?.name ?? teacherName}
              duration={
                course.num_weeks
                  ? `${course.num_weeks} week${course.num_weeks === 1 ? "" : "s"}`
                  : "Self-paced"
              }
              description={course.overview ?? course.description ?? ""}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
