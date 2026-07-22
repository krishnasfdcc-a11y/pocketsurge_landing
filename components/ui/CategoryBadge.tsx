"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/category/${category.toLowerCase()}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          e.preventDefault();
          router.push(`/category/${category.toLowerCase()}`);
        }
      }}
      role="link"
      tabIndex={0}
      className={cn(
        "inline-block cursor-pointer rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 transition-colors hover:bg-brand-100",
        className
      )}
    >
      {category}
    </span>
  );
}
