import type { ReactNode } from "react";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">{children}</div>
    </div>
  );
}
