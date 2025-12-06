export function StatsCard({ title, value, accent }: { title: string; value: string | number; accent?: "blue" | "green" | "yellow" }) {
  const accentClass = accent === "green" ? "text-green-600" : accent === "yellow" ? "text-yellow-600" : "text-blue-600";
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-muted">{title}</div>
      <div className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}
