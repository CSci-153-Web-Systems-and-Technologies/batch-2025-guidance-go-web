type Item = { counselor: string; topic: string; datetime: string; avatar?: string };

export function UpcomingAppointmentsList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-3 rounded-md border p-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1">
            <div className="font-medium">{it.counselor}</div>
            <div className="text-sm text-muted">{it.topic}</div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{it.datetime}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
