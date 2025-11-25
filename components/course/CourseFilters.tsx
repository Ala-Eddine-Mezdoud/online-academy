"use client";

import { useEffect, useRef, useState } from "react";

type FilterOption = {
  value: string;
  label: string;
};

interface FilterSelectProps {
  label: string;
  placeholder: string;
  options: FilterOption[];
}

function FilterSelect({ label, placeholder, options }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FilterOption | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: FilterOption) => {
    setSelected(option);
    setOpen(false);
  };

  const displayText = selected?.label ?? placeholder;

  return (
    <div
      ref={containerRef}
      className="relative w-full text-sm sm:flex-1 sm:min-w-48"
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${displayText}`}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-neutral-300 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
      >
        <span className="text-sm font-medium text-neutral-900">
          {displayText}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 text-neutral-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <ul role="listbox" className="max-h-52 overflow-auto py-2">
            {options.map((option) => {
              const isActive = selected?.value === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {option.label}
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CourseFilters() {
  const categoryOptions: FilterOption[] = [
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
  ];

  const instructorOptions: FilterOption[] = [
    { value: "ahmed", label: "Ahmed" },
    { value: "mohamed", label: "Mohamed" },
    { value: "yassine", label: "Yassine" },
  ];

  const durationOptions: FilterOption[] = [
    { value: "7-weeks", label: "7 weeks" },
    { value: "8-weeks", label: "8 weeks" },
    { value: "9-weeks", label: "9 weeks" },
  ];

  return (
    <div className="rounded-2xl bg-neutral-100 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:items-start lg:gap-6">
        <div className="relative w-full lg:flex-1 lg:min-w-60">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full rounded-2xl border border-gray-200 bg-white/80 px-12 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex w-full flex-wrap gap-4 lg:flex-[1.2]">
          <FilterSelect
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
          />
          <FilterSelect
            label="Instructor"
            placeholder="Select instructor"
            options={instructorOptions}
          />
          <FilterSelect
            label="Duration"
            placeholder="Select duration"
            options={durationOptions}
          />
        </div>
      </div>
    </div>
  );
}
