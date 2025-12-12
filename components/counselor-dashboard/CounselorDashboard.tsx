"use client";

import { SessionList } from "./SessionList";
import { StatsCard } from "./StatsCard";
import { ScheduleCalendar, type ScheduledItem } from "./ScheduleCalendar";
import * as React from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Appointment } from "./AppointmentCard";

export function CounselorDashboard() {
  const [pendingItems, setPendingItems] = React.useState<Appointment[]>([]);
  const [stats, setStats] = React.useState({ pending: 0, scheduled: 0 });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [actionBusyById, setActionBusyById] = React.useState<Record<string, "approve" | "cancel" | undefined>>({});
  const [scheduledAppts, setScheduledAppts] = React.useState<ScheduledItem[]>([]);

  React.useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        setLoading(true);
        if (!isSupabaseConfigured) throw new Error("Supabase not configured");
        const sb = getSupabaseClient();
        // Resolve counselor_id for the logged-in counselor
        const { data: userRes, error: uErr } = await sb.auth.getUser();
        if (uErr || !userRes.user) throw new Error(uErr?.message || "Not signed in");
        const { data: counselor, error: cErr } = await sb
          .from("counselors")
          .select("counselor_id")
          .eq("auth_user_id", userRes.user.id)
          .maybeSingle();
        if (cErr) throw cErr;
        const counselorId = counselor?.counselor_id as string | undefined;
        if (!counselorId) throw new Error("No counselor profile found");

        // Load pending appointments for this counselor, attempt nested student relation
        // TODO: adapt relation syntax if your foreign key alias differs
        const { data: appts, error: aErr } = await sb
          .from("appointments")
          .select(`
            appointment_id,
            appointment_date,
            appointment_time,
            session_type,
            status,
            notes,
            mode,
            student_id,
            students:students ( student_id, full_name, email )
          `)
          .eq("counselor_id", counselorId)
          .in("status", ["pending", "Pending"]) 
          .order("appointment_date")
          .order("appointment_time")
          .limit(50);
        console.log("fetched appointments raw:", appts, aErr);
        if (aErr) throw aErr;

        // Load student names/emails for display (batch)
        // Prefer nested students from Supabase; fallback to manual fetch
        const nestedStudents = Object.create(null) as Record<string, { full_name?: string; email?: string | null; student_number?: string }>;
        (appts ?? []).forEach(a => {
          const rel = Array.isArray((a as any).students) ? (a as any).students[0] : (a as any).students;
          if (rel && rel.student_id) {
            nestedStudents[rel.student_id] = { full_name: rel.full_name, email: rel.email ?? null };
          }
        });

        const studentIds = (appts ?? [])
          .map(a => a.student_id)
          .filter(id => id && !nestedStudents[id as string]);
        let studentsMap: Record<string, { full_name?: string; email?: string | null; student_number?: string }> = {};
        if (studentIds.length > 0) {
          const { data: students } = await sb
            .from("students")
            .select("student_id, full_name, student_number, email")
            .in("student_id", studentIds as string[]);
          (students ?? []).forEach(s => {
            studentsMap[s.student_id as string] = { full_name: s.full_name as any, email: (s as any).email ?? null, student_number: s.student_number as any };
          });
        }
        // Merge nested relation data
        for (const sid of Object.keys(nestedStudents)) {
          studentsMap[sid] = { ...(studentsMap[sid] || {}), ...nestedStudents[sid] };
        }

        const fmtTime = (t?: string | null) => {
          if (!t) return "";
          const h = parseInt(String(t).slice(0,2), 10);
          const m = parseInt(String(t).slice(3,5), 10);
          const ampm = h >= 12 ? "PM" : "AM";
          const h12 = h % 12 === 0 ? 12 : h % 12;
          return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
        };

        const fmtDate = (d?: string | null, t?: string | null) => {
          if (!d) return "";
          const dt = new Date(`${d}T${t ?? "00:00"}`);
          return dt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) + (t ? ` at ${fmtTime(t)}` : "");
        };

        const items: Appointment[] = (appts ?? []).map(a => {
          const stu = studentsMap[a.student_id as string] || {};
          const displayName = (stu.full_name && stu.full_name.trim().length > 0)
            ? stu.full_name
            : (stu.email ? String(stu.email).split("@")[0] : "Student");
          // Guard: if nested relation produced an email matching counselor email, ignore it
          // (indicates wrong relation alias). Prefer fetched studentsMap email.
          // TODO: remove this guard once relation alias is verified in production.
          const safeEmail = stu.email ?? null;
          // Derive duration from session_type if following the same convention
          const sessionType = (a.session_type as any) || "";
          const durationLabel = sessionType?.toLowerCase().includes("60") ? "Duration: 60 minutes" : (
            sessionType?.toLowerCase().includes("30") ? "Duration: 30 minutes" : undefined
          );
          return {
            appointmentId: String(a.appointment_id),
            student: displayName,
            email: safeEmail,
            studentId: stu.student_number ? `Student ID: ${stu.student_number}` : String(a.student_id),
            dateLabel: fmtDate(a.appointment_date as any, a.appointment_time as any),
            timeLabel: fmtTime(a.appointment_time as any),
            topic: a.notes || a.session_type || "",
            type: sessionType || undefined,
            mode: ((a as any).mode === 'online' ? 'virtual' : (a as any).mode) || undefined,
            durationLabel,
            status: "Pending",
          } satisfies Appointment;
        });

        const { count: pendingCount } = await sb
          .from("appointments")
          .select("appointment_id", { count: "exact", head: true })
          .eq("counselor_id", counselorId)
          .in("status", ["pending", "Pending"]);
        const { data: scheduledRows, error: sErr } = await sb
          .from("appointments")
          .select(`
            appointment_id,
            appointment_date,
            appointment_time,
            mode,
            session_type,
            notes,
            student_id,
            students:students ( student_id, full_name, email )
          `)
          .eq("counselor_id", counselorId)
          .in("status", ["confirmed", "Confirmed"]) 
          .order("appointment_date")
          .order("appointment_time")
          .limit(200);
        if (sErr) throw sErr;
        const scheduledList: ScheduledItem[] = (scheduledRows ?? []).map(r => {
          const rel = Array.isArray((r as any).students) ? (r as any).students[0] : (r as any).students;
          const studentName = rel?.full_name || undefined;
          const studentEmail = rel?.email || undefined;
          return {
            date: String((r as any).appointment_date),
            time: (r as any).appointment_time ?? null,
            mode: ((r as any).mode === 'online' ? 'virtual' : (r as any).mode) ?? null,
            studentName,
            studentEmail,
            type: (r as any).session_type || undefined,
            notes: (r as any).notes || undefined,
          } as ScheduledItem;
        });

        if (cancel) return;
        setPendingItems(items);
        setScheduledAppts(scheduledList);
        setStats({ pending: pendingCount ?? items.length, scheduled: scheduledList.length });
        setLoading(false);
      } catch (e: any) {
        if (!cancel) {
          setError(e?.message || "Unable to load counselor appointments");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancel = true; };
  }, []);

  return (
    <div className="space-y-10">
      {/* Page title banner */}
      <section className="rounded-2xl border bg-gradient-to-b from-white to-zinc-50 p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Counselor Dashboard</h1>
        <p className="mt-2 text-center text-muted">Manage your appointments and schedule efficiently</p>
      </section>

      {/* Main two-column section */}
      <section className="rounded-2xl border bg-white p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            {loading ? (
              <div className="space-y-4" aria-busy="true" aria-live="polite">
                <h2 className="text-lg font-semibold">Pending Appointments</h2>
                {[0,1,2].map(i => (
                  <div key={i} className="rounded-2xl border p-5 md:p-6 bg-white shadow-sm">
                    {/* Header: avatar + name + status badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-zinc-100 animate-pulse" />
                        <div className="space-y-1">
                          <div className="h-4 w-36 bg-zinc-100 rounded animate-pulse" />
                          <div className="h-3 w-48 bg-zinc-100 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-6 w-20 rounded-full bg-yellow-100 animate-pulse" />
                    </div>
                    {/* Details: date/time and topic lines */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-zinc-100 animate-pulse" />
                        <div className="h-4 w-56 bg-zinc-100 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-zinc-100 animate-pulse" />
                        <div className="h-4 w-44 bg-zinc-100 rounded animate-pulse" />
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className="h-9 w-24 rounded-md bg-blue-100 animate-pulse" />
                      <div className="h-9 w-28 rounded-md bg-zinc-100 animate-pulse" />
                      <div className="h-9 w-24 rounded-md bg-red-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SessionList
                items={pendingItems}
                title="Pending Appointments"
                onApprove={async (id?: string) => {
                  if (!id) return;
                  try {
                    setActionBusyById(prev => ({ ...prev, [id!]: "approve" }));
                    const sb = getSupabaseClient();
                    const approveCandidates = ["Confirmed", "confirmed", "Approved", "approved"];
                    let lastErr: any = null;
                    for (const val of approveCandidates) {
                      const { error: updErr } = await sb
                        .from("appointments")
                        .update({ status: val })
                        .eq("appointment_id", id);
                      if (!updErr) { lastErr = null; break; }
                      lastErr = updErr;
                      if (!/23514|check constraint/i.test(updErr.message || "")) break;
                    }
                    if (lastErr) throw lastErr;
                    // Optimistically update UI
                    setPendingItems(prev => prev.filter(p => p.appointmentId === undefined || p.appointmentId !== id));
                    setStats(s => ({ ...s, pending: Math.max(0, (s.pending ?? 1) - 1), scheduled: (s.scheduled ?? 0) + 1 }));
                  } catch (e) {
                    setError((e as any)?.message || "Unable to approve appointment");
                  } finally {
                    setActionBusyById(prev => ({ ...prev, [id!]: undefined }));
                  }
                }}
                onCancel={async (id?: string) => {
                  if (!id) return;
                  try {
                    setActionBusyById(prev => ({ ...prev, [id!]: "cancel" }));
                    const sb = getSupabaseClient();
                    const cancelCandidates = ["Cancelled", "Canceled", "cancelled", "canceled"];
                    let lastErr: any = null;
                    for (const val of cancelCandidates) {
                      const { error: updErr } = await sb
                        .from("appointments")
                        .update({ status: val })
                        .eq("appointment_id", id);
                      if (!updErr) { lastErr = null; break; }
                      lastErr = updErr;
                      if (!/23514|check constraint/i.test(updErr.message || "")) break;
                    }
                    if (lastErr) throw lastErr;
                    setPendingItems(prev => prev.filter(p => p.appointmentId === undefined || p.appointmentId !== id));
                    setStats(s => ({ ...s, pending: Math.max(0, (s.pending ?? 1) - 1) }));
                  } catch (e) {
                    setError((e as any)?.message || "Unable to cancel appointment");
                  } finally {
                    setActionBusyById(prev => ({ ...prev, [id!]: undefined }));
                  }
                }}
                busyActionById={actionBusyById}
              />
            )}
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Schedule Calendar</h2>
              <div className="mt-4">
                <ScheduleCalendar items={scheduledAppts} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Today's Overview</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <StatsCard title="Pending" value={loading ? 0 : stats.pending} accent="blue" />
                <StatsCard title="Scheduled" value={loading ? 0 : stats.scheduled} accent="green" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
