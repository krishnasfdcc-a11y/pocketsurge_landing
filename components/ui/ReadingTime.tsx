export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="text-sm text-surface-400 tabular-nums">
      {minutes} min read
    </span>
  );
}
