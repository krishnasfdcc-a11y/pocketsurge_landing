export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="text-center">
        <p className="text-6xl font-bold text-surface-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-surface-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}
