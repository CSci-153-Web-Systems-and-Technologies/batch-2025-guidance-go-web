"use client";

import { CalendarDays, ClipboardList, Users, Settings } from "lucide-react";

const items = [
  { label: "Pending", icon: ClipboardList },
  { label: "Calendar", icon: CalendarDays },
  { label: "Students", icon: Users },
  { label: "Settings", icon: Settings },
];

export function CounselorSidebar() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-sm font-semibold px-2 py-2">Counselor View</div>
      <nav className="space-y-1">
        {items.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <Icon className="h-5 w-5 text-muted" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
