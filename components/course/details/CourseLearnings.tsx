interface CourseLearningsProps {
  lessons: string[];
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4 text-blue-500"
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export function CourseLearnings({ lessons }: CourseLearningsProps) {
  return (
    <section className="rounded-xl bg-neutral-100 p-8 ring-1 ring-slate-100">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          What You&apos;ll Learn
        </h2>
        <span className="block border-t border-neutral-300" />
      </div>
      <div className="mt-6 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {lessons.map((lesson) => (
          <div key={lesson} className="flex items-start gap-3">
            <span className="mt-1">
              <CheckIcon />
            </span>
            <p className="text-sm text-slate-600">{lesson}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
