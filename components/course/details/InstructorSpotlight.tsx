import Image from "next/image";

interface InstructorSpotlightProps {
  name: string;
  title: string;
  bio: string;
  image: string;
  linkLabel: string;
}

export function InstructorSpotlight({
  name,
  title,
  bio,
  image,
  linkLabel,
}: InstructorSpotlightProps) {
  return (
    <section className="rounded-3xl bg-neutral-100 p-8 ring-1 ring-slate-100">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          About the Instructor
        </h2>
        <span className="block border-t border-neutral-300" />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="text-xl font-semibold text-slate-900">{name}</p>
          <p className="font-medium text-blue-600">{title}</p>
          <button className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500">
            {linkLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
