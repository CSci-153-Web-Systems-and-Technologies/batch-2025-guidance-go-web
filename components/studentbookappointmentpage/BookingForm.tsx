"use client";

import * as React from "react";
import DatePickerPopover from "@/components/DatePickerPopover";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type TimeSlot = {
  id: string;
  label: string;
};

type Counselor = { counselor_id: string; full_name: string; email: string | null };

export function BookingForm() {
  const router = useRouter();
  const [counselorId, setCounselorId] = React.useState<string | null>(null);
  const [counselors, setCounselors] = React.useState<Counselor[]>([]);
  const [loadingCounselors, setLoadingCounselors] = React.useState(false);
  const [counselorError, setCounselorError] = React.useState<string | null>(null);
  const [sessionType, setSessionType] = React.useState("Individual Session (50 min)");
  const [mode, setMode] = React.useState("online");
  const [date, setDate] = React.useState(""); // expected format YYYY-MM-DD or mm/dd/yyyy
  const [dateObj, setDateObj] = React.useState<Date | null>(null);
  const [notes, setNotes] = React.useState("");
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = React.useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [slotError, setSlotError] = React.useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = React.useState(false);

  function to12h(t: string) {
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || "0", 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const mm = m.toString().padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  }

  // Normalize date to YYYY-MM-DD if user typed mm/dd/yyyy
  function normalizeDate(input: string) {
    if (!input) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input; // already ISO
    const m = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const mm = m[1].padStart(2, "0");
      const dd = m[2].padStart(2, "0");
      const yyyy = m[3];
      return `${yyyy}-${mm}-${dd}`;
    }
    return input;
  }

  function dateToISO(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatMMDDYYYY(d: Date) {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  // Load availability for selected counselor + date
  React.useEffect(() => {
    let cancel = false;
    async function loadSlots() {
      setSlotError(null);
      setAvailableSlots([]);
      setSelectedSlotId(null);
      if (!isSupabaseConfigured) return;
      if (!counselorId || !date) return;
      try {
        setLoadingSlots(true);
        const supabase = getSupabaseClient();
        const isoDate = normalizeDate(date);
        // First try with available_date column
        let { data, error } = await supabase
          .from("availability")
          .select("availability_id, start_time, end_time")
          .eq("counselor_id", counselorId)
          .eq("available_date", isoDate)
          .order("start_time");
        // If the date column is actually named "date", retry gracefully
        if (error && (error.code === "42703" || /available_date/.test(error.message || ""))) {
          const retry = await supabase
            .from("availability")
            .select("availability_id, start_time, end_time")
            .eq("counselor_id", counselorId)
            .eq("date", isoDate)
            .order("start_time");
          data = retry.data as any;
          error = retry.error as any;
        }
        if (error) throw error;
        if (cancel) return;
        const slots: TimeSlot[] = (data || []).map((r: any) => ({
          id: r.availability_id as string,
          label: to12h((r.start_time as string).slice(0,5)),
        }));
        setAvailableSlots(slots);
        if (slots.length > 0) setSelectedSlotId(slots[0].id);
      } catch (e: any) {
        if (!cancel) setSlotError(e?.message ?? "Unable to load availability.");
      } finally {
        if (!cancel) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => { cancel = true; };
  }, [counselorId, date]);

  // Load counselors from Supabase
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured) return;
      try {
        setLoadingCounselors(true);
        setCounselorError(null);
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("counselors")
          .select("counselor_id, full_name, email")
          .order("full_name", { ascending: true });
        if (error) throw error;
        if (cancelled) return;
        setCounselors((data ?? []) as any);
        // Pick first counselor by default if none selected yet
        if (!counselorId && data && data.length > 0) {
          setCounselorId(data[0].counselor_id as string);
        }
      } catch (e: any) {
        if (!cancelled) setCounselorError(e?.message ?? "Unable to load counselors.");
      } finally {
        if (!cancelled) setLoadingCounselors(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">Book an Appointment</h2>
        <p className="mt-1 text-sm text-zinc-500">Schedule your counseling session with our professional therapists</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Select Counselor</label>
          <select
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
            value={counselorId ?? ""}
            onChange={(e) => setCounselorId(e.target.value || null)}
          >
            {!isSupabaseConfigured && <option value="">Supabase not configured</option>}
            {loadingCounselors && <option value="">Loading counselors…</option>}
            {!loadingCounselors && counselors.length === 0 && (
              <option value="">No counselors available</option>
            )}
            {counselors.map((c) => (
              <option key={c.counselor_id} value={c.counselor_id}>
                {c.full_name} {c.email ? `- ${c.email}` : ""}
              </option>
            ))}
          </select>
          {counselorError && <div className="text-xs text-red-600">{counselorError}</div>}
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Mode</label>
          <select
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr,auto,auto] sm:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Select Date &amp; Time</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <DatePickerPopover
                value={dateObj ?? undefined}
                onConfirm={(d) => {
                  setDateObj(d);
                  setDate(formatMMDDYYYY(d));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center min-h-[40px]">
          {loadingSlots && <span className="text-sm text-zinc-600">Loading slots…</span>}
          {!loadingSlots && slotError && (
            <span className="text-sm text-red-600">Error loading slots: {slotError}</span>
          )}
          {!loadingSlots && !slotError && availableSlots.length === 0 && (
            <span className="text-sm text-zinc-600">No slots for this date</span>
          )}
          {availableSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlotId(slot.id)}
              className={
                "h-10 min-w-[96px] rounded-lg border px-4 text-sm " +
                (selectedSlotId === slot.id
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
          onClick={async () => {
            try {
              setBookingLoading(true);
              if (!isSupabaseConfigured) throw new Error("Supabase not configured");
              if (!counselorId) throw new Error("Please select a counselor");
              const isoDate = normalizeDate(date);
              if (!isoDate) throw new Error("Please enter a date (mm/dd/yyyy)");
              if (!selectedSlotId) throw new Error("Please select a time slot");
              const supabase = getSupabaseClient();
              // Resolve student_id of logged-in user
              const { data: userRes, error: uErr } = await supabase.auth.getUser();
              if (uErr || !userRes.user) throw new Error(uErr?.message || "Not signed in");
              const { data: stu, error: sErr } = await supabase
                .from("students")
                .select("student_id")
                .eq("auth_user_id", userRes.user.id)
                .maybeSingle();
              if (sErr) throw sErr;
              if (!stu?.student_id) throw new Error("No student profile found");
              // Lookup the selected availability to get precise times
              const { data: slot } = await supabase
                .from("availability")
                .select("start_time, end_time")
                .eq("availability_id", selectedSlotId)
                .maybeSingle();
              const start_time = slot?.start_time || null;
              const end_time = slot?.end_time || null;
              // Insert into appointments using your schema: appointment_date + appointment_time
              const payload: any = {
                student_id: stu.student_id,
                counselor_id: counselorId,
                appointment_date: isoDate,
                appointment_time: start_time, // store the slot start
                session_type: sessionType,
                notes,
                mode,
                status: "pending", // optional default
              };
              const { error: insErr } = await supabase.from("appointments").insert(payload);
              if (insErr) throw insErr;
              alert("Booking confirmed!");
              router.push("/studentappointmentdetailspage");
            } catch (e: any) {
              alert(e?.message || "Unable to confirm booking. Please check your database schema.");
            } finally {
              setBookingLoading(false);
            }
          }}
          className={`h-10 rounded-full px-4 text-sm font-medium text-white shadow-sm ${bookingLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={bookingLoading}
        >
          {bookingLoading ? "Confirming…" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
