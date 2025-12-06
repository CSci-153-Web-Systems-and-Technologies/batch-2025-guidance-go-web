import { SessionList } from "./SessionList";
import { StatsCard } from "./StatsCard";
import { CalendarWidget } from "../dashboard/CalendarWidget";

export function CounselorDashboard() {
  const pending = [
    {
      student: "Sarah Johnson",
      studentId: "#112345",
      dateLabel: "March 15, 2024 at 2:00 PM",
      timeLabel: "",
      topic: "Academic stress and time management concerns",
      status: "Pending" as const,
    },
    {
      student: "Michael Chen",
      studentId: "#112346",
      dateLabel: "March 18, 2024 at 10:00 AM",
      timeLabel: "",
      topic: "Career guidance and major selection discussion",
      status: "Pending" as const,
    },
    {
      student: "Emma Rodriguez",
      studentId: "#112347",
      dateLabel: "March 17, 2024 at 3:30 PM",
      timeLabel: "",
      topic: "Social anxiety and peer relationship support",
      status: "Pending" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page title banner */}
      <section className="rounded-2xl border bg-gradient-to-b from-white to-zinc-50 p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Counselor Dashboard</h1>
        <p className="mt-2 text-center text-muted">Manage your appointments and schedule efficiently</p>
      </section>

      {/* Main two-column section */}
      <section className="rounded-2xl border bg-white p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SessionList items={pending} title="Pending Appointments" />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Schedule Calendar</h2>
              <div className="mt-3">
                <CalendarWidget />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Today's Overview</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatsCard title="Pending" value={3} accent="blue" />
                <StatsCard title="Scheduled" value={5} accent="green" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
