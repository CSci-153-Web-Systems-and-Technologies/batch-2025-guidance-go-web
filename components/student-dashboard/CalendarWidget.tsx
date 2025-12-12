"use client";

import { useMemo, useState } from "react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export type CalendarAppointment = { date: string; time?: string | null; mode?: string | null };

export function CalendarWidget({ appointments }: { appointments?: CalendarAppointment[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [selected, setSelected] = useState<number>(today.getDate());
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = getDaysInMonth(viewYear, viewMonth);

  const grid: (number | null)[] = Array(firstDay).fill(null).concat(
    Array.from({ length: days }, (_, i) => i + 1)
  );

  const byDay = useMemo(() => {
    const map = new Map<number, { time?: string | null; mode?: string | null }[]>();
    (appointments ?? []).forEach(a => {
      // Expect a.date as YYYY-MM-DD
      const d = new Date(`${a.date}T${a.time ?? "00:00"}`);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        const list = map.get(day) ?? [];
        list.push({ time: a.time ?? null, mode: a.mode ?? null });
        map.set(day, list);
      }
    });
    return map;
  }, [appointments, viewYear, viewMonth]);

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          {new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long" })} {viewYear}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
            onClick={() => {
              const m = viewMonth - 1;
              if (m < 0) { setViewMonth(11); setViewYear(viewYear - 1); } else { setViewMonth(m); }
              setSelected(1);
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
            onClick={() => {
              const m = viewMonth + 1;
              if (m > 11) { setViewMonth(0); setViewYear(viewYear + 1); } else { setViewMonth(m); }
              setSelected(1);
            }}
          >
            Next
          </button>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs hover:bg-zinc-50"
            onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelected(today.getDate()); }}
          >
            Today
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-zinc-600">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center">{d[0]}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {grid.map((d, idx) => (
          <button
            key={idx}
            disabled={!d}
            onClick={() => d && setSelected(d)}
            className={[
              "aspect-square rounded-md border text-sm",
              d ? "bg-white hover:bg-blue-50" : "opacity-0 pointer-events-none",
              d === selected ? "bg-blue-600 text-white border-blue-600" : "",
              d && byDay.has(d) ? "ring-2 ring-yellow-300" : ""
            ].join(" ")}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-zinc-600">
        Selected: {new Date(viewYear, viewMonth, selected).toLocaleString(undefined, { month: "long" })} {selected}, {viewYear}
      </div>
      {byDay.has(selected) && (
        <div className="mt-3 rounded-lg border bg-white p-3 text-sm">
          <div className="font-medium">Scheduled on {new Date(viewYear, viewMonth, selected).toLocaleString(undefined, { month: "long" })} {selected}, {viewYear}</div>
          <ul className="mt-2 space-y-1">
            {(byDay.get(selected) ?? []).map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-zinc-700">
                <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs">{a.time ? formatTime(a.time) : "Time TBA"}</span>
                <span className="inline-block rounded bg-purple-100 px-2 py-0.5 text-xs">{a.mode ?? "Mode TBA"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatTime(t?: string | null) {
  if (!t) return "";
  const h = parseInt(String(t).slice(0,2), 10);
  const m = parseInt(String(t).slice(3,5), 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}
