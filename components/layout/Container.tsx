import { cn } from "@/utils/cn";

export function Container({
  children,
  className,
  size = "page",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "page" | "article" | "article-wide";
}) {
  return (
    <div
      className={cn(
        size === "page"
          ? "container-page"
          : size === "article-wide"
            ? "article-layout"
            : "container-article",
        className
      )}
    >
      {children}
    </div>
  );
}
