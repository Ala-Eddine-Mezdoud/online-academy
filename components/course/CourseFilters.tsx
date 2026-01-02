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
  value: string | null;
  onChange: (value: string | null) => void;
}

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? null;

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
    const nextValue = option.value === selected?.value ? null : option.value;
    onChange(nextValue);
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

// export default function CourseFilters() {
interface CourseFiltersProps {
  search: string;
  category: string | null;
  instructor: string | null;
  duration: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onInstructorChange: (value: string | null) => void;
  onDurationChange: (value: string | null) => void;
  categories: FilterOption[];
  instructors: FilterOption[];
  durations: FilterOption[];
}

export default function CourseFilters({
  search,
  category,
  instructor,
  duration,
  onSearchChange,
  onCategoryChange,
  onInstructorChange,
  onDurationChange,
  categories,
  instructors,
  durations,
}: CourseFiltersProps) {
  return (
    <div className="rounded-2xl bg-white p-6 ">
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
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white/80 px-12 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex w-full flex-wrap gap-4 lg:flex-[1.2]">
          <FilterSelect
            label="Category"
            placeholder="Select a category"
            options={categories}
            value={category}
            onChange={onCategoryChange}
          />
          <FilterSelect
            label="Instructor"
            placeholder="Select instructor"
            options={instructors}
            value={instructor}
            onChange={onInstructorChange}
          />
          <FilterSelect
            label="Duration"
            placeholder="Select duration"
            options={durations}
            value={duration}
            onChange={onDurationChange}
          />
        </div>
      </div>
    </div>
  );
}
