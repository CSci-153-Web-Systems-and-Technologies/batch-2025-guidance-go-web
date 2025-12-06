"use client";

import * as React from "react";

type TimeSlot = {
  id: string;
  label: string;
};

export function BookingForm() {
  const [counselor, setCounselor] = React.useState("Dr. Sarah Johnson - Individual Therapy");
  const [sessionType, setSessionType] = React.useState("Individual Session (50 min)");
  const [date, setDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>("2:00 PM");

  const timeSlots: TimeSlot[] = [
    { id: "9:00", label: "9:00 AM" },
    { id: "10:00", label: "10:00 AM" },
    { id: "14:00", label: "2:00 PM" },
    { id: "15:30", label: "3:30 PM" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">Book an Appointment</h2>
        <p className="mt-1 text-sm text-zinc-500">Schedule your counseling session with our professional therapists</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Select Counselor</label>
          <select
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
            value={counselor}
            onChange={(e) => setCounselor(e.target.value)}
          >
            <option>Dr. Sarah Johnson - Individual Therapy</option>
            <option>Dr. Kevin Chan - Group Therapy</option>
            <option>Dr. Amy Kim - Study Habits</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Session Type</label>
          <select
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <option>Individual Session (50 min)</option>
            <option>Emergency Session (30 min)</option>
            <option>Group Session (60 min)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr,auto,auto] sm:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Select Date &amp; Time</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="button" className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">📅</button>
          </div>
        </div>
        <div className="flex gap-2">
          {timeSlots.slice(0, 2).map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.label)}
              className={
                "h-10 min-w-[96px] rounded-lg border px-4 text-sm " +
                (selectedSlot === slot.label
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
              }
            >
              {slot.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {timeSlots.slice(2).map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.label)}
              className={
                "h-10 min-w-[96px] rounded-lg border px-4 text-sm " +
                (selectedSlot === slot.label
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
              }
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium text-zinc-700">Additional Notes (Optional)</label>
        <textarea
          rows={4}
          placeholder="Any specific concerns or topics you'd like to discuss..."
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          <div>Session Fee: $0</div>
          <div className="text-green-600">Insurance accepted</div>
        </div>
        <button
          type="button"
          className="h-10 rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
