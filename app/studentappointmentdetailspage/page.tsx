"use client";

import { Navbar } from "../../components/student-dashboard/Navbar";
import Footer from "../../components/ui/Footer";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { format } from "date-fns";
import * as React from "react";

export default function StudentAppointmentDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<Array<{ appt: any; counselor: any }>>([]);

  React.useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        if (!isSupabaseConfigured) throw new Error("Supabase not configured");
        const sb = getSupabaseClient();
        const { data: userRes, error: uErr } = await sb.auth.getUser();
        if (uErr || !userRes.user) throw new Error(uErr?.message || "Not signed in");
        const { data: stu, error: sErr } = await sb
          .from("students")
          .select("student_id")
          .eq("auth_user_id", userRes.user.id)
          .maybeSingle();
        if (sErr) throw sErr;
        if (!stu?.student_id) throw new Error("No student profile found");
        const { data: appts, error: aErr } = await sb
          .from("appointments")
          .select("appointment_id, appointment_date, appointment_time, session_type, status, notes, counselor_id, mode")
          .eq("student_id", stu.student_id)
          .in("status", ["confirmed", "Confirmed", "pending", "Pending"])
          .order("appointment_date", { ascending: false })
          .order("appointment_time", { ascending: false })
          .limit(10);
        if (aErr) throw aErr;
        const itemsList: Array<{ appt: any; counselor: any }> = [];
        for (const appt of appts ?? []) {
          const { data: counselor } = await sb
            .from("counselors")
            .select("full_name, email")
            .eq("counselor_id", appt.counselor_id)
            .maybeSingle();
          itemsList.push({ appt, counselor });
        }
        if (cancel) return;
        setItems(itemsList);

        // Subscribe to realtime updates for this appointment's status/mode
        const channels = (appts ?? []).map((appt) =>
          sb
            .channel(`appt_${appt.appointment_id}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'appointments',
                filter: `appointment_id=eq.${appt.appointment_id}`,
              },
              (payload: any) => {
                setItems((prev) => prev.map(it =>
                  it.appt.appointment_id === payload.new.appointment_id
                    ? { ...it, appt: { ...it.appt, ...payload.new } }
                    : it
                ));
              }
            )
            .subscribe()
        );

        return () => {
          try { channels.forEach(ch => sb.removeChannel(ch)); } catch {}
        };
      } catch (e: any) {
        if (!cancel) setError(e?.message || "Unable to load appointment details");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    load();
    return () => { cancel = true; };
  }, []);

  function fmtDate(d?: string | null) {
    if (!d) return "-";
    return format(new Date(d), "MMMM d, yyyy");
  }
  function fmtTime(t?: string | null) {
    if (!t) return "-";
    const h = parseInt(String(t).slice(0,2), 10);
    const m = parseInt(String(t).slice(3,5), 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Navbar />
      <main className="space-y-10 py-8">
        {/* Back button removed; Home now routes to Student Dashboard */}
        {/* Hero header */}
        <section className="mx-auto w-full max-w-6xl">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-100" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600">GuidanceGo</h1>
                <p className="text-sm text-zinc-700">Fast &amp; Secure Counseling Scheduler</p>
              </div>
            </div>
          </div>
        </section>

        {/* Appointment Details list */}
        <section className="mx-auto w-full max-w-6xl space-y-6">
          {loading && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">Loading appointments…</div>
          )}
          {error && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm text-red-600">{error}</div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-3 text-sm">No appointments yet</div>
              <a href="/studentbookappointmentpage" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Make an Appointment</a>
            </div>
          )}
          {items.map(({ appt, counselor }, idx) => (
            <div key={idx} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-6 py-3 text-white text-sm font-semibold rounded-t-2xl">Appointment Details</div>
              <div className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Session Information</h3>
                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-zinc-500">Date:</div>
                      <div className="text-right">{fmtDate(appt.appointment_date)}</div>
                      <div className="text-zinc-500">Time:</div>
                      <div className="text-right">{fmtTime(appt.appointment_time)}</div>
                      <div className="text-zinc-500">Duration:</div>
                      <div className="text-right">{(appt.session_type || "").toLowerCase().includes("50") ? "50 minutes" : (appt.session_type || "").toLowerCase().includes("30") ? "30 minutes" : "—"}</div>
                      <div className="text-zinc-500">Type:</div>
                      <div className="text-right">{appt.session_type || "-"}</div>
                      <div className="text-zinc-500">Mode:</div>
                      <div className="text-right">{appt.mode === 'online' ? 'virtual' : (appt.mode || '-')}</div>
                      <div className="text-zinc-500">Status:</div>
                      <div className="text-right">
                        {(/[Cc]onfirmed/.test(appt.status || "")) ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2"/></svg>
                            Approved by counselor
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">{appt.status || "pending"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Counselor Information</h3>
                    <div className="mt-3 flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100" />
                      <div className="text-sm">
                        <div className="font-semibold">{counselor?.full_name || "Counselor"}</div>
                        <div className="text-zinc-500">{counselor?.email || ""}</div>
                        <div className="mt-1 text-zinc-700">&nbsp;</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(["online","virtual"].includes(appt.mode)) && /[Cc]onfirmed/.test(appt.status || "") ? (
                    <button disabled className="rounded-md bg-zinc-200 px-4 py-2 text-sm text-zinc-600">Join link not available</button>
                  ) : null}
                  <button className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50">Reschedule</button>
                  <button className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Info tiles and recent activity */}
        <section className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border p-4">
                    <div className="h-8 w-8 rounded bg-red-100" />
                    <div className="mt-2 text-sm font-semibold">Emergency Session</div>
                    <div className="text-xs text-zinc-600">Book an emergency consultation.</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="h-8 w-8 rounded bg-green-100" />
                    <div className="mt-2 text-sm font-semibold">Group Sessions</div>
                    <div className="text-xs text-zinc-600">Join group therapy sessions.</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="h-8 w-8 rounded bg-blue-100" />
                    <div className="mt-2 text-sm font-semibold">Resources</div>
                    <div className="text-xs text-zinc-600">Access help materials & articles.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold">Recent Activity</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Session completed with Dr. Chen</span>
                    <span className="text-zinc-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Appointment scheduled for tomorrow</span>
                    <span className="text-zinc-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resource downloaded: "Anxiety Management"</span>
                    <span className="text-zinc-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
