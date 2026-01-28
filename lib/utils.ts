import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceDA(amount?: number | null) {
  if (typeof amount !== "number") return undefined;
  if (amount === 0) return "Free";
  return `${amount.toLocaleString()} DA`;
}
