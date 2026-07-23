export default function ArticleLoading() {
  return (
    <div className="container-page animate-pulse py-10">
      <div className="mb-6 h-4 w-48 rounded bg-surface-200 dark:bg-surface-800" />
      <div className="aspect-[21/9] rounded-2xl bg-surface-200 dark:bg-surface-800" />
      <div className="mt-8 space-y-3">
        <div className="h-8 w-3/4 rounded bg-surface-200 dark:bg-surface-800" />
        <div className="h-4 w-full rounded bg-surface-100 dark:bg-surface-900" />
        <div className="h-4 w-5/6 rounded bg-surface-100 dark:bg-surface-900" />
        <div className="h-4 w-2/3 rounded bg-surface-100 dark:bg-surface-900" />
      </div>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-surface-100 dark:bg-surface-900"
            style={{ width: `${85 - i * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
