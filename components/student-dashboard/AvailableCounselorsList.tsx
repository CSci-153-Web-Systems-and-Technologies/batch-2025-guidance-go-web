type Item = { name: string; status: "Online" | "Offline"; specialty: string; avatar?: string };

export function AvailableCounselorsList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-3 rounded-md border p-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1">
            <div className="font-medium">{it.name}</div>
            <div className="text-sm text-muted">{it.specialty}</div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-block h-2 w-2 rounded-full ${it.status === "Online" ? "bg-green-500" : "bg-gray-400"}`} />
            {it.status}
          </div>
          <a className="rounded-md border px-3 py-1 text-sm hover:bg-muted" href="#">Message</a>
        </li>
      ))}
    </ul>
  );
}
