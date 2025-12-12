import Image from "next/image";
import { ReactNode } from "react";

const FILE_ICON = "/icons/file-icon.svg";
const ARROW_ICON = "/icons/Arrow-down.svg";

export type AccordionItem = {
  title: string;
  subtitle?: string;
  content: ReactNode;
};

interface AccordionSectionProps {
  title: string;
  items: AccordionItem[];
  variant?: "default" | "muted";
}

export function AccordionSection({
  title,
  items,
  variant = "default",
}: AccordionSectionProps) {
  const cardBg = variant === "muted" ? "bg-neutral-100" : "bg-white";

  return (
    <section className={`rounded-3xl ${cardBg} p-8  ring-1 ring-slate-100`}>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <span className={`block border-t border-neutral-300`} />
      </div>
      <div className={`mt-6 divide-y border-neutral-300 text-neutral-300`}>
        {items.map((item, index) => (
          <details key={item.title} className="group py-4" open={index === 0}>
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
              <span>
                {item.title}
                {item.subtitle && (
                  <span className="font-normal text-slate-500">
                    {item.subtitle}
                  </span>
                )}
              </span>
              <span className="transition group-open:rotate-180">
                <Image
                  src={ARROW_ICON}
                  alt="Toggle section"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </span>
            </summary>
            <div className="mt-3 space-y-2 pl-1 text-sm text-slate-700">
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

interface LessonModule {
  title: string;
  lessons: string[];
}

interface CourseSyllabusProps {
  modules: LessonModule[];
}

export function CourseSyllabus({ modules }: CourseSyllabusProps) {
  const items: AccordionItem[] = modules.map((module) => ({
    title: `${module.title} `,
    subtitle: `(${module.lessons.length} Lessons)`,
    content: (
      <ul className="space-y-2">
        {module.lessons.map((lesson) => (
          <li
            key={lesson}
            className="flex items-center gap-3 rounded-2xl  px-4 py-2"
          >
            <Image
              src={FILE_ICON}
              alt="Lesson"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>{lesson}</span>
          </li>
        ))}
      </ul>
    ),
  }));

  return <AccordionSection title="Course Syllabus" items={items} />;
}
