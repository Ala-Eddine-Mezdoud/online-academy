import CourseFilters from "@/components/course/CourseFilters";
import CourseCard from "@/components/course/CourseCard";
import TeacherCard from "@/components/teacher/TeacherCard";

const courses = [
  {
    id: "1",
    image: "/images/webdev-pic.jpg",
    category: "Web Development",
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Jane Doe",
    duration: "12 Weeks",
    description:
      "Master front-end and back-end skills with this intensive program covering React, Node.js, databases, and deployment best practices.",
  },
  {
    id: "2",
    image: "/images/webdev-pic.jpg",
    category: "Product Design",
    title: "UI/UX Design Accelerator",
    instructor: "Samuel Green",
    duration: "10 Weeks",
    description:
      "Build intuitive experiences through user research, wireframing, prototyping, and modern design systems using Figma.",
  },
  {
    id: "3",
    image: "/images/webdev-pic.jpg",
    category: "AI & Data",
    title: "Applied AI Specialist Program",
    instructor: "Leila Kamal",
    duration: "14 Weeks",
    description:
      "Learn to build intelligent products with Python, TensorFlow, and real-world ML pipelines focused on deployable outcomes.",
  },
  {
    id: "4",
    image: "/images/webdev-pic.jpg",
    category: "Product",
    title: "Product Management Launchpad",
    instructor: "Noah Park",
    duration: "8 Weeks",
    description:
      "Go from idea to launch with practical frameworks for market research, roadmapping, stakeholder alignment, and go-to-market strategy.",
  },
  {
    id: "5",
    image: "/images/webdev-pic.jpg",
    category: "Data Analytics",
    title: "Modern Data Analytics Intensive",
    instructor: "Olivia Mendes",
    duration: "9 Weeks",
    description:
      "Analyze business data with SQL, Python, and Looker Studio while learning to craft dashboards and data stories executives care about.",
  },
  {
    id: "6",
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

      <CourseFilters />
      <h2 className="text-3xl font-bold text-slate-900">
        Available Courses (6)
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

    </section>
  );
}
