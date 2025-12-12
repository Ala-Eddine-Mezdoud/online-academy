import Image from "next/image";

interface TeacherCardProps {
  image: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  skills: string[];
  linkedin?: string;
  twitter?: string;
}

const ICONS = {
  email: "/icons/email-icon.svg",
  linkedin: "/icons/linkedin-icon.svg",
  twitter: "/icons/X_icon.svg",
};

export default function TeacherCard({
  image,
  name,
  title,
  bio,
  email,
  skills,
  linkedin = "#",
  twitter = "#",
}: TeacherCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_15px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={name}
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="text-2xl font-semibold text-slate-900">{name}</h3>
        <p className="text-sm font-semibold text-blue-600">{title}</p>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Image
              src={ICONS.email}
              alt="Email icon"
              width={18}
              height={18}
              className="h-4 w-4"
              priority={false}
            />
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              {email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {linkedin && (
              <a
                href={linkedin}
                aria-label="LinkedIn"
                className="text-slate-400 transition hover:text-slate-700"
              >
                <Image
                  src={ICONS.linkedin}
                  alt="LinkedIn icon"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                  priority={false}
                />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                aria-label="Twitter"
                className="text-slate-400 transition hover:text-slate-700"
              >
                <Image
                  src={ICONS.twitter}
                  alt="X icon"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                  priority={false}
                />
              </a>
            )}
          </div>
        </div>

        <div className=" pt-6 mt-4">
          <button className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600">
            View Courses
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="m10 7 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
