import TeacherCard from "@/components/teacher/TeacherCard";

const instructors = [
  {
    id: "marcus-chen",
    image: "/images/teacher-pic.avif",
    name: "Prof. Marcus Chen",
    title: "Lead Instructor of Data Science",
    bio: "Professor Chen is a data science expert with over 15 years of industry experience and a passion for making analytics accessible to everyone.",
    email: "marcus.chen@educonnect.com",
    skills: [
      "Python for Data Analysis",
      "Machine Learning Fundamentals",
      "Big Data Technologies",
    ],
  },
  {
    id: "amelia-ross",
    image: "/images/teacher-pic.avif",
    name: "Dr. Amelia Ross",
    title: "Principal UX Design Mentor",
    bio: "Dr. Ross has designed award-winning digital products for global brands and now mentors aspiring designers through human-centered methodologies.",
    email: "amelia.ross@educonnect.com",
    skills: ["UX Research", "Design Systems", "Design Thinking"],
  },
  {
    id: "david-nguyen",
    image: "/images/teacher-pic.avif",
    name: "David Nguyen",
    title: "Senior Full-Stack Coach",
    bio: "David brings a decade of experience building SaaS platforms and loves helping engineers grow confident with modern web tooling.",
    email: "david.nguyen@educonnect.com",
    skills: ["React & Next.js", "Node.js", "Cloud Deployments"],
  },
  {
    id: "lina-haddad",
    image: "/images/teacher-pic.avif",
    name: "Lina Haddad",
    title: "AI Ethics & Strategy Advisor",
    bio: "Lina helps organizations launch responsible AI programs and teaches practical frameworks for fairness, transparency, and governance.",
    email: "lina.haddad@educonnect.com",
    skills: ["Responsible AI", "Product Strategy", "MLOps"],
  },
];

export default function Teacher() {
  return (
    <div>
      <section className="space-y-10 bg-white pt-18 pb-32 px-10 md:px-20">
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
          {instructors.map((teacher) => (
            <TeacherCard key={teacher.id} {...teacher} />
          ))}
        </div>
      </section>{" "}
      <div className="bg-neutral-100 flex flex-col justify-center items-center pt-28 pb-28 gap-5 pr-10 pl-10">
        <h1 className="text-4xl font-bold text-slate-900 max-w-96 text-center">
          Ready to Learn from the Best?
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-neutral-700 text-center">
          Explore our extensive catalog of courses and find the perfect learning
          path with our world-class instructors.
        </p>
        <div className="">
          <button className="text-white bg-blue-500 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-8 py-3 text-sm font-semibold transition hover:border-black hover:text-black">
            Explore All Courses
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="m10 7 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
