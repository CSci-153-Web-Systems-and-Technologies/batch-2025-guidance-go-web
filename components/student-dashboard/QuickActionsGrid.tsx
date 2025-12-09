"use client";

import { Calendar, Video, BookOpen, MessageSquare } from "lucide-react";

const icons = { Calendar, Video, BookOpen, MessageSquare };

type Action = { title: string; icon: keyof typeof icons; href: string };

export function QuickActionsGrid({ actions }: { actions: Action[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((a, i) => {
        const Icon = icons[a.icon];
        return (
          <a
            key={i}
            href={a.href}
            className="flex items-center gap-3 rounded-lg border bg-white px-4 py-4 hover:bg-muted transition-colors overflow-hidden"
          >
            <div className="flex-shrink-0 rounded-md border bg-card p-2">
              <Icon className="h-5 w-5 text-muted" />
            </div>
            <span className="min-w-0 truncate text-sm font-medium">{a.title}</span>
          </a>
        );
      })}
    </div>
  );
}
