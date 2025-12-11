"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DatePickerPopoverProps = {
  value?: Date | null;
  onConfirm: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
};

export default function DatePickerPopover({ value, onConfirm, minDate, maxDate, className = "" }: DatePickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(value ?? undefined);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelected(value ?? undefined);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const display = value ? format(value, "MM/dd/yyyy") : "";

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
        <input
          readOnly
          value={display}
          placeholder="mm/dd/yyyy"
          className="bg-transparent outline-none w-40 text-sm"
          aria-label="Selected date"
          onClick={() => setOpen(true)}
        />
        <button
          type="button"
          aria-label="Open calendar"
          onClick={() => setOpen((s) => !s)}
          className="p-1 rounded-md hover:bg-slate-100"
        >
          <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"></rect>
            <path d="M16 2v4M8 2v4" strokeWidth="1.5"></path>
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <div className="w-[320px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 p-3">
            <div className="flex flex-col gap-2">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(d) => setSelected(d ?? undefined)}
                fromDate={minDate}
                toDate={maxDate}
                numberOfMonths={1}
                captionLayout="dropdown"
              />

              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-slate-500">
                  {selected ? format(selected, "MMMM d, yyyy") : "No date selected"}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 rounded-md hover:bg-slate-50 text-sm">Cancel</button>
                  <button
                    type="button"
                    aria-label="Confirm date"
                    onClick={() => {
                      if (selected) onConfirm(selected);
                      setOpen(false);
                    }}
                    disabled={!selected}
                    className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
