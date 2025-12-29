import Image from "next/image";

type CourseHeroProps = {
  title: string;
  description: string;
  duration: string;
  students: string;
  level: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
};

export function CourseHero({
  title,
  description,
  duration,
  students,
  level,
  primaryCta,
  secondaryCta,
  image,
}: CourseHeroProps) {
  const handleViewSyllabus = () => {
    const el = document.getElementById("course-syllabus");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <section className="grid gap-10 py-8  ring-slate-100 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-5xl font-black leading-tight text-slate-900 lg:text-5xl">
            {title}
          </p>
          <p className="max-w-xl text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {/*icons */}
        <div className="flex justify-start flex-wrap gap-4 text-sm font-medium text-slate-700">
          <div className="inline-flex items-center gap-2  py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 text-blue-500"
              aria-hidden
            >
              <circle cx="12" cy="12" r="8" />
              <path d="m12 8 .01 4.01L15 15" />
            </svg>
            {duration}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 text-blue-500"
              aria-hidden
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {students}
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {level}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="w-48! px-12 cursor-pointer rounded-md bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            {primaryCta}
          </button>
          <button
            type="button"
            onClick={handleViewSyllabus}
            className="w-48! px-12 cursor-pointer rounded-md border border-slate-200 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-600"
          >
            {secondaryCta}
          </button>
        </div>
      </div>
      <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-inner lg:h-[320px]">
        {(() => {
          const isRemote =
            typeof image === "string" && /^https?:\/\//.test(image);
          return (
            <Image
              src={image}
              alt="Course preview"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
              unoptimized={isRemote}
            />
          );
        })()}
      </div>
    </section>
  );
}
