"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export type ScheduledItem = {
  date: string;
  time?: string | null;
  mode?: string | null;
  studentName?: string | null;
  studentEmail?: string | null;
  type?: string | null;
  notes?: string | null;
};

export function ScheduleCalendar({ items }: { items: ScheduledItem[] }) {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const modifiers = React.useMemo(() => {
    const scheduled = (day: Date) => {
      return items.some(i => {
        const d = new Date(`${i.date}T${i.time ?? "00:00"}`);
        return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
      });
    };
    return { scheduled };
  }, [items]);

  return (
    <div>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(d) => {
          setSelected(d);
          setActiveIdx(0);
          if (d) {
            const hasAppt = items.some(i => {
              const dt = new Date(`${i.date}T${i.time ?? "00:00"}`);
              return dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth() && dt.getDate() === d.getDate();
            });
            if (hasAppt) setOpen(true);
          }
        }}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
        month={month}
        onMonthChange={setMonth}
        modifiers={modifiers}
        modifiersClassNames={{ scheduled: "ring-2 ring-yellow-300" }}
      />
      {selected && (
        <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
          <div className="font-semibold text-zinc-800">Scheduled on {selected.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</div>
          <ul className="mt-3 space-y-3">
            {items.filter(i => {
              const d = new Date(`${i.date}T${i.time ?? "00:00"}`);
              return d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth() && d.getDate() === selected.getDate();
            }).map((i, idx) => (
              <li key={idx} className="rounded-lg border bg-zinc-50 p-3 text-zinc-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium">{formatTime(i.time)}</span>
                  <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium">{i.mode === 'online' ? 'virtual' : (i.mode ?? 'in-person')}</span>
                  {i.type && (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium">{i.type}</span>
                  )}
                </div>
                {(i.studentName || i.studentEmail) && (
                  <div className="mt-2 text-sm leading-relaxed">
                    <span className="font-medium">{i.studentName ?? "Student"}</span>
                    {i.studentEmail && <span className="ml-2 text-zinc-600">{i.studentEmail}</span>}
                  </div>
                )}
                {i.notes && <div className="mt-1 text-sm text-zinc-700">{i.notes}</div>}
              </li>
            ))}
          </ul>
          {/* Drawer opens automatically on date select; removed manual trigger button */}
        </div>
      )}

      {open && selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md overflow-hidden rounded-t-2xl border bg-white shadow-lg">
            <div className="h-10 w-full bg-blue-600" />
            <div className="p-4">
              <div className="mb-3">
                <div className="text-base font-semibold">Appointment Details</div>
                <div className="text-xs text-zinc-600">Session Information</div>
              </div>
              {(() => {
                const dayItems = items.filter(i => {
                  const d = new Date(`${i.date}T${i.time ?? "00:00"}`);
                  return d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth() && d.getDate() === selected.getDate();
                });
                if (dayItems.length === 0) return null;
                const current = dayItems[Math.min(activeIdx, dayItems.length - 1)];
                return (
                  <div>
                    {dayItems.length > 1 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {dayItems.map((di, idx) => (
                          <button
                            key={idx}
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${idx === activeIdx ? 'bg-zinc-900 text-white' : 'text-zinc-800 hover:bg-zinc-50'}`}
                            onClick={() => setActiveIdx(idx)}
                          >
                            {formatTime(di.time)}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="max-h-[50vh] overflow-y-auto rounded-lg border p-3">
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="text-zinc-600">Date:</div>
                        <div className="text-right text-zinc-800">{selected.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-zinc-600">Time:</div>
                        <div className="text-right text-zinc-800">{formatTime(current.time)}</div>
                        <div className="text-zinc-600">Duration:</div>
                        <div className="text-right text-zinc-800">{deriveDuration(current.type)}</div>
                        <div className="text-zinc-600">Type:</div>
                        <div className="text-right text-zinc-800">{current.type ?? '—'}</div>
                        <div className="text-zinc-600">Mode:</div>
                        <div className="text-right text-zinc-800">{current.mode === 'online' ? 'virtual' : (current.mode ?? 'in-person')}</div>
                        <div className="text-zinc-600">Status:</div>
                        <div className="text-right">
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">✓ Approved by counselor</span>
                        </div>
                      </div>
                      {(current.studentName || current.studentEmail) && (
                        <div className="mt-3 text-sm">
                          <div className="text-zinc-600">Student:</div>
                          <div className="text-zinc-800">
                            <span className="font-medium">{current.studentName ?? 'Student'}</span>
                            {current.studentEmail && <span className="ml-2 text-zinc-600">{current.studentEmail}</span>}
                          </div>
                        </div>
                      )}
                      {current.notes && (
                        <div className="mt-2 text-sm">
                          <div className="text-zinc-600">Notes:</div>
                          <div className="text-zinc-800">{current.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white" onClick={() => setOpen(false)}>Close</button>
                <button className="inline-flex flex-1 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium text-zinc-800">Message</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(t?: string | null) {
  if (!t) return "Time TBA";
  const h = parseInt(String(t).slice(0,2), 10);
  const m = parseInt(String(t).slice(3,5), 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

function deriveDuration(type?: string | null) {
  if (!type) return "—";
  const lower = type.toLowerCase();
  if (lower.includes("90")) return "90 minutes";
  if (lower.includes("60")) return "60 minutes";
  if (lower.includes("50")) return "50 minutes";
  if (lower.includes("45")) return "45 minutes";
  if (lower.includes("30")) return "30 minutes";
  return "—";
}
