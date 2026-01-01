import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  instructor?: string;
  duration: string;
  description: string;
  price?: number | null;
  buttonLabel?: string;
  showInstructor?: boolean;
  basePath?: string;
}

export default function CourseCard({
  id,
  image,
  category,
  title,
  instructor,
  duration,
  description,
  price,
  buttonLabel = "Enrol Now",
  showInstructor = true,
  basePath = "/course",
}: CourseCardProps) {
  const isRemote = typeof image === "string" && /^https?:\/\//.test(image);
  const isSvg = typeof image === "string" && image.includes(".svg");
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 border border-gray-700 justify-between">
      <div className="relative h-48 w-full overflow-hidden rounded-2xl ">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover"
          unoptimized={isRemote}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-between">
        <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {category}
        </span>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h3>
        <dl className="mt-4 space-y-2 text-sm text-slate-600">
          {showInstructor && instructor && (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4 text-slate-500"
                aria-hidden
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                <path d="M20 21.5a8 8 0 0 0-16 0" />
              </svg>
              <dt className="font-medium text-slate-700">Instructor:</dt>
              <dd className="text-slate-600">{instructor}</dd>
            </div>
          )}
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4 text-slate-500"
              aria-hidden
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 7v5l3 2" />
            </svg>
            <dt className="font-medium text-slate-700">Duration:</dt>
            <dd className="text-slate-600">{duration}</dd>
          </div>
          {typeof price === 'number' ? (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4 text-slate-500"
                aria-hidden
              >
                <path d="M12 1v22M19 5H9.5a3.5 3.5 0 0 0 0 7H14a4 4 0 0 1 0 8H5" />
              </svg>
              <dt className="font-medium text-slate-700">Price:</dt>
              <dd className="text-slate-900 font-semibold">
                {`${price.toLocaleString()} DA`}
              </dd>
            </div>
          ) : null}
        </dl>

        <button className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          <Link href={`${basePath}/${id}`}>{buttonLabel}</Link>
        </button>
      </div>
    </article>
  );
}
