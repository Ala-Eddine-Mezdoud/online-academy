import Image from "next/image";

interface TeacherHighlightProps {
  name: string;
  title: string;
  bio: string;
  image: string;
}

export function TeacherHighlight({
  name,
  title,
  bio,
  image,
}: TeacherHighlightProps) {
  return (
    <section className="grid gap-4 bg-white px-6 py-10  ring-slate-100 md:grid-cols-[220px_1fr] md:items-center">
      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full md:mx-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">{name}</h1>
          <p className="text-lg font-semibold text-blue-600">{title}</p>
        </div>
        <p className="text-base leading-relaxed text-slate-600">{bio}</p>
      </div>
    </section>
  );
}
