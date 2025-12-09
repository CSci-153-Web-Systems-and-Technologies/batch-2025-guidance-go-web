import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border bg-white p-6 md:p-8 shadow-sm ${className ?? ""}`}>
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
        </div>
        {right && <div className="text-right text-sm">{right}</div>}
      </div>
      {children}
    </section>
  );
}
