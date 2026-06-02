export function AdminMessage({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm ${
        error
          ? "border border-red-200 bg-red-50 text-red-700"
          : "border border-sage/30 bg-sage-muted/40 text-forest"
      }`}
      role="alert"
    >
      {error ?? success}
    </div>
  );
}
