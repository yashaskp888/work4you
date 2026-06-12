export function AdminLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading admin panel…</p>
    </div>
  );
}
