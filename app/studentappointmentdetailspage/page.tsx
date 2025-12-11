import { Navbar } from "../../components/student-dashboard/Navbar";
import Footer from "../../components/ui/Footer";
// Simplified appointment details layout matching the provided mock

export default function StudentAppointmentDetailsPage() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Navbar />
      <main className="space-y-10 py-8">
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

        {/* Appointment Details card */}
        <section className="mx-auto w-full max-w-6xl">
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-3 text-white text-sm font-semibold rounded-t-2xl">Appointment Details</div>
            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Session Information */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Session Information</h3>
                  <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-zinc-500">Date:</div>
                    <div className="text-right">March 15, 2024</div>
                    <div className="text-zinc-500">Time:</div>
                    <div className="text-right">2:00 PM – 2:50 PM</div>
                    <div className="text-zinc-500">Duration:</div>
                    <div className="text-right">50 minutes</div>
                    <div className="text-zinc-500">Type:</div>
                    <div className="text-right">Individual Session</div>
                    <div className="text-zinc-500">Status:</div>
                    <div className="text-right"><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Confirmed</span></div>
                  </div>
                </div>
                {/* Counselor Information */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Counselor Information</h3>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100" />
                    <div className="text-sm">
                      <div className="font-semibold">Dr. Sarah Johnson</div>
                      <div className="text-zinc-500">Licensed Clinical Psychologist</div>
                      <div className="text-zinc-500">Specializes in anxiety and depression</div>
                      <div className="mt-1 text-zinc-700">⭐ 4.9 (127 reviews)</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/studentbookappointmentpage" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Make an Appointment</a>
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50">Reschedule</button>
                <button className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cancel</button>
              </div>
            </div>
          </div>
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
