"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-[#f7f7f7] text-black border border-gray-300",
        "placeholder:text-gray-500",
        "h-9 w-full rounded-md px-3 py-1 text-sm transition-colors outline-none",
        "focus:bg-white focus:border-gray-400 focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  );
}

export { Input };
