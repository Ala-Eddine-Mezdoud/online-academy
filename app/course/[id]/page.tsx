import { CourseHero } from "@/components/course/details/CourseHero";
import { CourseOverview } from "@/components/course/details/CourseOverview";
import { CourseLearnings } from "@/components/course/details/CourseLearnings";
import { CourseSyllabus } from "@/components/course/details/CourseSyllabus";
import { InstructorSpotlight } from "@/components/course/details/InstructorSpotlight";
import { StudentReviews } from "@/components/course/details/StudentReviews";
import { CourseFAQ } from "@/components/course/details/CourseFAQ";

const learningItems = [
  "Build dynamic and interactive user interfaces with React.",
  "Master React Hooks (useState, useEffect, useContext, useReducer, etc.).",
  "Implement efficient state management patterns for large applications.",
  "Understand and utilize React Router for navigation.",
  "Optimize React applications for maximum performance.",
  "Write maintainable and scalable code following best practices.",
  "Integrate with external APIs and handle asynchronous data.",
  "Deploy React applications to production environments.",
];

const syllabusModules = [
  {
    title: "Module 1: React Fundamentals",
    lessons: [
      "Introduction to React and JSX",
      "Components and Props",
      "State and Lifecycle Methods",
      "Event Handling in React",
    ],
  },
  {
    title: "Module 2: Advanced React Concepts",
    lessons: [
      "Hooks Deep Dive",
      "Context API and Reducers",
      "Performance Optimization",
      "Testing React Apps",
      "Real-world Architecture Patterns",
    ],
  },
  {
    title: "Module 3: State Management & Data Flow",
    lessons: [
      "Redux Toolkit Essentials",
      "Server State with React Query",
      "Data Fetching Strategies",
      "Real-time Updates",
    ],
  },
  {
    title: "Module 4: Performance & Deployment",
    lessons: [
      "Code Splitting and Lazy Loading",
      "SSR and SSG with Next.js",
      "Deployment Pipelines",
    ],
  },
];

const instructor = {
  name: "Dr. Evelyn Reed",
  title: "Senior Software Engineer",
  bio: "Dr. Evelyn Reed is a Senior Software Engineer with over 15 years of experience in web development, specializing in front-end architecture and React. She holds a Ph.D. in Computer Science and is passionate about teaching and mentoring aspiring developers. Her engaging teaching style and deep technical knowledge make complex topics easy to understand.",
  image: "/images/teacher-pic.avif",
  linkLabel: "View All Courses by Dr. Evelyn Reed",
};

const studentReviews = {
  ratingSummary: "5 out of 5",
  reviewCount: 3,
  reviews: [
    {
      id: "alice",
      name: "Alice Johnson",
      date: "October 26, 2023",
      quote:
        "This course completely transformed my understanding of React! The instructor is fantastic and explains everything clearly. Highly recommend for anyone serious about React.",
      rating: 5,
    },
    {
      id: "mark",
      name: "Mark S. Davis",
      date: "November 10, 2023",
      quote:
        "Great content, very thorough. Some parts were challenging but ultimately rewarding. The projects were very helpful for practical application.",
      rating: 4,
    },
    {
      id: "sophia",
      name: "Sophia Chen",
      date: "December 01, 2023",
      quote:
        "Absolutely brilliant! Dr. Reed is an exceptional teacher. I appreciated the balance of theory and hands-on coding. My React skills have leveled up significantly.",
      rating: 5,
    },
  ],
};

const faqs = [
  {
    question: "Is this course suitable for beginners?",
    answer:
      "Yes. We start with the fundamental concepts before progressing to advanced topics, so motivated beginners with JavaScript knowledge can follow along.",
  },
  {
    question: "What software and tools do I need?",
    answer:
      "You will need Node.js, npm or yarn, and a modern editor such as VS Code. Setup instructions and starter templates are provided in Module 0.",
  },
  {
    question: "Will I receive a certificate upon completion?",
    answer:
      "Yes, you will receive a digital certificate once you submit all projects and pass the final assessment.",
  },
  {
    question: "What if I have questions during the course?",
    answer:
      "You can ask questions in the community forum or join the weekly live Q&A sessions led by the instructor team.",
  },
];

export default function CourseDetailPage() {
  return (
    <div className="flex flex-col pt-12 bg-white pd-8 px-8 gap-14 md:px-24">
      <CourseHero
        title="Mastering React: From Beginner to Advanced Developer"
        description="Dive deep into the world of React, build complex applications, and master best practices. Learn hooks, context API, routing, and state management like a pro."
        duration="8 Weeks"
        students="1,500+ Students"
        level="Advanced"
        primaryCta="Enroll Now"
        secondaryCta="View Syllabus"
        image="/images/webdev-pic.jpg"
      />
      <CourseOverview
        title="Overview"
        content="Embark on a comprehensive journey to become a proficient React developer. This course covers everything from the fundamentals of JSX and component-based architecture to advanced topics like performance optimization, server-side rendering, and testing. With hands-on projects and real-world examples, you’ll gain the skills needed to build robust and scalable web applications. We emphasize practical application, ensuring you can immediately apply what you learn to your own projects. Get ready to transform your coding career!"
      />
      <CourseLearnings lessons={learningItems} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-18">
          <CourseSyllabus modules={syllabusModules} />
          <InstructorSpotlight {...instructor} />
        </div>
        <StudentReviews {...studentReviews} />
      </div>
      <div className="max-w-4xl self-center md:w-3/4">
        <CourseFAQ items={faqs} />
      </div>
    </div>
  );
}
