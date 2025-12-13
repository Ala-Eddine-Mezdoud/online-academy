import TeacherCard from "@/components/teacher/TeacherCard";
import { getAllProfiles } from "@/app/lib/profiles.client";

export default async function Teacher() {
  const teachers = (await getAllProfiles("teacher")) ?? [];

  const instructorItems = teachers.map((t) => ({
    id: String(t.id),
    image: t.profile_image ?? "/images/teacher-pic.avif",
    name: t.name ?? "Instructor",
    title: t.role_title ?? "Instructor",
    bio: t.description ?? "",
    email: t.email ?? "",
    skills: [], //TODO: add skills table
  }));
  return (
    <div>
      <section className="space-y-10 bg-white py-32 container mx-auto">
        <header className="space-y-4 text-center">
          <h1 className="text-5xl font-bold text-slate-900">
            Meet Our Expert Instructors
          </h1>
          <p className="mx-auto max-w-4xl text-xl text-neutral-700">
            Discover the passionate educators who bring learning to life at
            EduConnect. Each instructor is a leading expert in their field,
            dedicated to guiding you through your educational journey.
          </p>
        </header>
        <div className="mt-20  grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {instructorItems.map((teacher) => (
            <TeacherCard key={teacher.id} {...teacher} />
          ))}
        </div>
      </section>
    </div>
  );
}
