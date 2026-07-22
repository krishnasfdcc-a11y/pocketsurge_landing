import { cn } from "@/utils/cn";

export function PlaceholderImage({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-surface-100",
        className
      )}
    >
      <svg
        className="h-16 w-16 text-surface-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
      {text && (
        <span className="sr-only">{text}</span>
      )}
    </div>
  );
}
