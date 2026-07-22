import { cn } from "@/utils/cn";

export function Container({
  children,
  className,
  size = "page",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "page" | "article";
}) {
  return (
    <div
      className={cn(
        size === "page" ? "container-page" : "container-article",
        className
      )}
    >
      {children}
    </div>
  );
}
