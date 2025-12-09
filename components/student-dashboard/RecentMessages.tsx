type Message = { from: string; preview: string; time: string; avatar?: string; unread?: boolean };

export function RecentMessages({ items }: { items: Message[] }) {
  return (
    <ul className="space-y-3">
      {items.map((m, i) => (
        <li key={i} className="flex items-center gap-3 rounded-md border p-3">
          <div className="relative h-10 w-10 rounded-full bg-muted">
            {m.unread && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{m.from}</span>
              <span className="text-xs text-muted">{m.time}</span>
            </div>
            <div className="text-sm text-muted truncate">{m.preview}</div>
          </div>
          <a className="rounded-md border px-3 py-1 text-sm hover:bg-muted" href="#">Open</a>
        </li>
      ))}
    </ul>
  );
}
