interface CourseOverviewProps {
  title: string;
  content: string;
}

export function CourseOverview({ title, content }: CourseOverviewProps) {
  return (
    <section className="rounded-xl bg-white p-8  ring-1 ring-slate-100">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <span className="block border-t border-slate-100" />
      </div>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{content}</p>
    </section>
  );
}
