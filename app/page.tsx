'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const stats = [
  {
    id: 1,
    number: "150+",
    label: "Expert Instructors",
  },
  {
    id: 2,
    number: "500+",
    label: "Premium Courses",
  },
  {
    id: 3,
    number: "100K+",
    label: "Active Students",
  },
  {
    id: 4,
    number: "10K+",
    label: "Enrolled Students",
  },
];

const popularCourses = [
  {
    id: 1,
    title: "User Research and Analysis",
    badge: "Design",
    image: "/images/course-1.jpg",
  },
  {
    id: 2,
    title: "Web3: Embrace the Future",
    badge: "20% OFF",
    image: "/images/course-2.jpg",
  },
  {
    id: 3,
    title: "Mastering Digital Marketing",
    badge: "Marketing",
    image: "/images/course-3.jpg",
  },
];

const faqs = [
  {
    id: 1,
    question: "How do I register for a course?",
    answer: "To register for a course, simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account or sign in if you already have one. Once registered, you'll have immediate access to the course materials."
  },
  {
    id: 2,
    question: "Are the courses self-paced?",
    answer: "Yes, most of our courses are self-paced, allowing you to learn at your own convenience. However, some specialized programs may have specific schedules with live sessions. Check the course details for specific information about pacing and deadlines."
  },
  {
    id: 3,
    question: "Do I receive a certificate upon course completion?",
    answer: "Absolutely! Upon successfully completing a course and passing all required assessments, you will receive a digital certificate of completion. This certificate can be shared on your LinkedIn profile or included in your professional portfolio."
  },
  {
    id: 4,
    question: "What if I need help with a course?",
    answer: "We offer comprehensive support through multiple channels. You can reach out to instructors directly through the course platform, join discussion forums with fellow students, or contact our support team via email. We're here to help ensure your learning success."
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 px-10 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Your Journey to Knowledge Starts Here
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Offer real eLearning tools across 20,000+ courses led by industry experts. Empower your team with cutting-edge skills and knowledge through our comprehensive learning platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/course"
                className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Browse Courses
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {/* Placeholder for hero image */}
            <div className="aspect-4/3 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-slate-400 text-sm">Hero Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-slate-50 py-16 px-10 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6 max-w-3xl">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Empowering individuals with quality education and career-advancing skills. We provide comprehensive online courses designed to meet the evolving needs of learners worldwide, fostering innovation and professional excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="bg-white py-16 px-10 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.number}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="bg-slate-50 py-16 px-10 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Popular Courses
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="relative">
                  {/* Placeholder for course image */}
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">Course Image</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {course.badge}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                  <Link
                    href={`/course/${course.id}`}
                    className="block w-full text-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-10 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <p className="text-sm font-medium text-slate-900 text-left">{faq.question}</p>
                  <svg 
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === faq.id ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {openFaq === faq.id && (
                  <div className="px-5 pb-5 pt-2">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
