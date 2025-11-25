import { AccordionItem, AccordionSection } from "./CourseSyllabus";

interface FaqItem {
  question: string;
  answer: string;
}

interface CourseFAQProps {
  items: FaqItem[];
}

export function CourseFAQ({ items }: CourseFAQProps) {
  const accordionItems: AccordionItem[] = items.map((faq) => ({
    title: faq.question,
    content: (
      <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
    ),
  }));

  return (
    <AccordionSection
      title="Frequently Asked Questions"
      items={accordionItems}
      variant="muted"
    />
  );
}
