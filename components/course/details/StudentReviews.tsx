import Image from "next/image";

interface Review {
  id: string;
  name: string;
  date: string;
  quote: string;
  rating: number;
  avatar?: string;
}

interface StudentReviewsProps {
  ratingSummary: string;
  reviewCount: number;
  reviews: Review[];
}

const Star = ({ filled }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill={filled ? "#FACC15" : "#d1d5db"}
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M12 3.5 14.8 9l5.7.8-4.1 4 1 5.7L12 16.8 6.6 19.5l1-5.7-4.1-4 5.7-.8Z" />
  </svg>
);

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  if (!avatar) {
    const initials = name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      <Image
        src={avatar}
        alt={name}
        fill
        sizes="40px"
        className="object-cover"
      />
    </div>
  );
}

export function StudentReviews({
  ratingSummary,
  reviewCount,
  reviews,
}: StudentReviewsProps) {
  return (
    <section className="rounded-3xl bg-white p-8 ring-1 ring-slate-100">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Student Reviews
        </h2>
        <span className="block border-t border-neutral-300" />
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} filled />
            ))}
            <span>{ratingSummary}</span>
            <span className="text-xs font-normal text-slate-500">
              ({reviewCount} Reviews)
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-slate-100 bg-white px-5 py-4 "
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={review.name} avatar={review.avatar} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-500">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} filled={idx < review.rating} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {review.quote}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
