import CourseFilters from "@/components/course/CourseFilters";
import CourseCard from "@/components/course/CourseCard";
import TeacherCard from "@/components/teacher/TeacherCard";

const courses = [
  {
    id: "web-dev-bootcamp",
    image: "/images/webdev-pic.jpg",
    category: "Web Development",
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Jane Doe",
    duration: "12 Weeks",
    description:
      "Master front-end and back-end skills with this intensive program covering React, Node.js, databases, and deployment best practices.",
  },
  {
    id: "ui-ux-design",
    image: "/images/webdev-pic.jpg",
    category: "Product Design",
    title: "UI/UX Design Accelerator",
    instructor: "Samuel Green",
    duration: "10 Weeks",
    description:
      "Build intuitive experiences through user research, wireframing, prototyping, and modern design systems using Figma.",
  },
  {
    id: "ai-specialist",
    image: "/images/webdev-pic.jpg",
    category: "AI & Data",
    title: "Applied AI Specialist Program",
    instructor: "Leila Kamal",
    duration: "14 Weeks",
    description:
      "Learn to build intelligent products with Python, TensorFlow, and real-world ML pipelines focused on deployable outcomes.",
  },
  {
    id: "product-management",
    image: "/images/webdev-pic.jpg",
    category: "Product",
    title: "Product Management Launchpad",
    instructor: "Noah Park",
    duration: "8 Weeks",
    description:
      "Go from idea to launch with practical frameworks for market research, roadmapping, stakeholder alignment, and go-to-market strategy.",
  },
  {
    id: "data-analytics",
    image: "/images/webdev-pic.jpg",
    category: "Data Analytics",
    title: "Modern Data Analytics Intensive",
    instructor: "Olivia Mendes",
    duration: "9 Weeks",
    description:
      "Analyze business data with SQL, Python, and Looker Studio while learning to craft dashboards and data stories executives care about.",
  },
  {
    id: "mobile-dev",
    image: "/images/webdev-pic.jpg",
    category: "Mobile",
    title: "React Native App Mastery",
    instructor: "Kamila Idris",
    duration: "11 Weeks",
    description:
      "Design and ship polished cross-platform apps using React Native, Expo, animations, and real-world deployment workflows.",
  },
];
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
];

export default function Course() {
  return (
    <section className="space-y-10 bg-white py-8 px-8 md:px-24">
      <header className="space-y-4">
        <h1 className="text-5xl font-bold text-slate-900">
          Explore Our Courses
        </h1>
        <p className="max-w-3xl text-xl text-neutral-700">
          Discover a wide range of courses designed to elevate your skills and
          knowledge. Find the perfect learning path for you.
        </p>
      </header>

      <CourseFilters />
      <h2 className="text-3xl font-bold text-slate-900">
        Available Courses (6)
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
            Instructors
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            Meet Your Teachers
          </h2>
          <p className="max-w-3xl text-base text-slate-600">
            Learn from industry practitioners who guide you with real-world
            scenarios, career advice, and personalized feedback.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {instructors.map((teacher) => (
            <TeacherCard key={teacher.id} {...teacher} />
          ))}
        </div>
      </div>
    </section>
  );
}
