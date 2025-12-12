import CourseCard from "@/components/course/CourseCard";
import { TeacherHighlight } from "@/components/teacher/details/TeacherHighlight";

const teacher = {
  name: "Dr. Eleanor Vance",
  title: "Lead Instructor in AI & Machine Learning",
  bio: "Dr. Vance is a distinguished AI researcher and passionate educator with over 15 years of experience. Her expertise spans deep learning, natural language processing, and computer vision. She is dedicated to making complex AI concepts accessible to students of all levels, fostering innovation and critical thinking.",
  image: "/images/teacher-pic.avif",
  statusLabel: "Live",
};

const teacherCourses = [
  {
    id: "ai-foundations",
    image: "/images/webdev-pic.jpg",
    category: "AI & Data",
    title: "Foundations of Machine Intelligence",
    duration: "8 Weeks",
    description:
      "Build rock-solid intuition for supervised, unsupervised, and reinforcement learning with projects grounded in real datasets.",
  },
  {
    id: "nlp-lab",
    image: "/images/webdev-pic.jpg",
    category: "AI Research",
    title: "Natural Language Processing Lab",
    duration: "6 Weeks",
    description:
      "Design modern NLP pipelines covering transformers, prompt engineering, and evaluation strategies for enterprise use cases.",
  },
  {
    id: "vision-systems",
    image: "/images/webdev-pic.jpg",
    category: "Computer Vision",
    title: "Intelligent Vision Systems",
    duration: "10 Weeks",
    description:
      "Prototype end-to-end vision solutions that combine detection, segmentation, and deployment patterns using popular frameworks.",
  },
];

export default function TeacherDetails() {
  return (
    <div>
      <div className="px-6 py-12 md:px-24 bg-white">
        <TeacherHighlight {...teacher} />
      </div>
      <section className="px-6 md:px-24 mt-16 py-6 bg-neutral-100 w-full">
        <h2 className="text-3xl py-10 font-bold text-slate-900 text-center">
          Courses taught by {teacher.name}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {teacherCourses.map(({ id, ...course }) => (
            <CourseCard
              key={id}
              {...course}
              showInstructor={false}
              buttonLabel="View course"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
