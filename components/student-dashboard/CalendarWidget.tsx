"use client";

import { useState } from "react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function CalendarWidget() {
  const now = new Date();
  const [selected, setSelected] = useState<number>(now.getDate());
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = getDaysInMonth(year, month);

  const grid: (number | null)[] = Array(firstDay).fill(null).concat(
    Array.from({ length: days }, (_, i) => i + 1)
  );

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">March {year}</div>
        <div className="text-sm text-muted">Today</div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-muted">
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
              d === selected ? "bg-blue-600 text-white border-blue-600" : ""
            ].join(" ")}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted">Selected: March {selected}, {year}</div>
    </div>
  );
}
