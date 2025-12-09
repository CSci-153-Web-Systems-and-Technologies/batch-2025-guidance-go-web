"use client";

import { CalendarDays, MessageSquare, BookOpen, Video, Home } from "lucide-react";

const items = [
  { label: "Overview", icon: Home },
  { label: "Calendar", icon: CalendarDays },
  { label: "Messages", icon: MessageSquare },
  { label: "Resources", icon: BookOpen },
  { label: "Meetings", icon: Video },
];

export function Sidebar() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-sm font-semibold px-2 py-2">Student View</div>
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
