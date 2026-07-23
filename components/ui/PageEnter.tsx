"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export function PageEnter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={cn("page-enter", className)}>
      {children}
    </div>
  );
}
