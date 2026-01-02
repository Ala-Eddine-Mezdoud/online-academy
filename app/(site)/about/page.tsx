import Image from "next/image";
import Link from "next/link";

const principles = [
  {
    id: 1,
    title: "Our Mission",
    icon: (
      <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description:
      "Our mission is to democratize education by providing high-quality, accessible, and engaging online learning experiences for everyone, everywhere. We believe in empowering individuals to achieve their full potential through knowledge.",
  },
  {
    id: 2,
    title: "Our Vision",
    icon: (
      <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    description:
      "To be the global leader in innovative e-learning solutions, constantly evolving to meet the needs of a dynamic world and inspire a lifelong love of learning.",
  },
];

const story = {
  title: "The EduConnect Story: A Path of Innovation",
  subtitle: "Our Journey",
  description:
    "Founded in 2020 by a team of educators and tech enthusiasts, EduConnect began with a simple idea: to make premium education universally available. Starting with a handful of courses, we quickly grew, driven by positive student feedback and a commitment to quality. Over the years, we've expanded our catalog, partnered with leading institutions, and continuously innovated our platform to create a truly immersive learning environment. Today, EduConnect serves millions, fostering a global community of learners and educators.",
  image: "/images/story-illustration.svg",
};

const team = [
  {
    id: 1,
    name: "Dr. Anya Sharma",
    role: "CEO & Founder",
    roleColor: "text-red-500",
    description:
      "A visionary in educational technology, Dr. Sharma founded EduConnect with a passion for accessible learning. Her expertise in AI and pedagogy drives our innovative platform.",
    image: "/images/team-1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Chief Learning Officer",
    roleColor: "text-blue-500",
    description:
      "With over 20 years in curriculum development, Michael ensures our courses are cutting-edge and deeply engaging. He leads content strategy and teacher partnerships.",
    image: "/images/team-2.jpg",
  },
  {
    id: 3,
    name: "Sarah Lee",
    role: "Head of Technology",
    roleColor: "text-green-500",
    description:
      "Sarah is the architect behind EduConnect's robust and user-friendly platform. Her focus on scalable solutions and seamless user experience is paramount.",
    image: "/images/team-3.jpg",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Community Manager",
    roleColor: "text-yellow-600",
    description:
      "David fosters our vibrant learning community, ensuring students and teachers feel connected and supported. He champions user feedback and engagement initiatives.",
    image: "/images/team-4.jpg",
  },
];

const values = [
  {
    id: 1,
    title: "Innovation",
    description:
      "Constantly exploring new ideas, teaching methods, and cutting-edge technologies.",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Community",
    description:
      "Fostering a supportive network where learners and educators collaborate.",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Integrity",
    description:
      "Upholding the highest ethical standards and transparency in every interaction.",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Excellence",
    description:
      "Committing to superior quality in content, instruction, and user support.",
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white ">
      {/* Hero Section */}
      <section className="bg-slate-100 py-20 pt-20 px-10 md:px-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Empowering Minds, Shaping Futures: Our Journey at EduConnect
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Discover the passion, values, and dedicated team driving our mission to revolutionize online learning.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="bg-white py-20 px-10 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
          Our Guiding Principles
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {principles.map((principle) => (
            <div
              key={principle.id}
              className="bg-slate-100 rounded-2xl p-8 text-center space-y-4"
            >
              <div className="flex justify-center mb-4">
                {principle.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {principle.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-slate-100 py-20 px-10 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
            {story.title}
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-900 text-center mb-12">
            {story.subtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-2xl p-2 shadow-sm">
              {/* Placeholder for team illustration - leave space for image */}
              <div className="aspect-4/3 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">Team Illustration</span>
              </div>
            </div>
            <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed">
                {story.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-20 px-10 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-3">
            Meet Our Dedicated Team
          </h2>
          <p className="text-sm text-slate-600 text-center mb-16">
            Behind every great platform is a passionate team committed to excellence.
          </p>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {team.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-6 text-center space-y-4 shadow-sm border border-slate-100"
              >
                <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-slate-100 flex items-center justify-center">
                  {/* Placeholder for team member photo */}
                  <span className="text-slate-400 text-xs">Photo</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <p className={`text-sm font-semibold ${member.roleColor}`}>
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <div className="bg-white rounded-2xl p-6 text-center space-y-4 shadow-sm border border-slate-100 max-w-sm">
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-slate-100 flex items-center justify-center">
                {/* Placeholder for team member photo */}
                <span className="text-slate-400 text-xs">Photo</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {team[3].name}
                </h3>
                <p className={`text-sm font-semibold ${team[3].roleColor}`}>
                  {team[3].role}
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {team[3].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100 py-20 px-10 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-3">
            Our Core Values
          </h2>
          <p className="text-sm text-slate-600 text-center mb-16">
            The principles that guide our work and community.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.id}
                className="bg-white rounded-2xl p-6 text-center space-y-3 shadow-sm"
              >
                <div className="flex justify-center mb-2">{value.icon}</div>
                <h3 className="text-base font-bold text-slate-900">
                  {value.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-200 py-20 px-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Ready to Learn More?
          </h2>
          <p className="text-base text-slate-600">
            Have questions or want to partner with us? Reach out today!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
