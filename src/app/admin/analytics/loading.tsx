import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminAnalyticsLoading() {
  return (
    <>
      <AdminHeader
        title="Analytics"
        description="Carregando métricas…"
        email=""
        role="admin"
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-sage-muted/30"
            />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border bg-sage-muted/20"
            />
          ))}
        </div>
      </main>
    </>
  );
}
