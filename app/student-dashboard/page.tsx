import { HeroCard } from "../../components/student-dashboard/HeroCard";
import { NextAppointmentCard } from "../../components/student-dashboard/NextAppointmentCard";
import { CalendarWidget } from "../../components/student-dashboard/CalendarWidget";
import { SectionCard } from "../../components/student-dashboard/SectionCard";
import { UpcomingAppointmentsList } from "../../components/student-dashboard/UpcomingAppointmentsList";
import { AvailableCounselorsList } from "../../components/student-dashboard/AvailableCounselorsList";
import { QuickActionsGrid } from "../../components/student-dashboard/QuickActionsGrid";
import { RecentMessages } from "../../components/student-dashboard/RecentMessages";

export default function DashboardPage() {
  const nextAppointment = {
    counselor: "Ms. Jenna Alvarez",
    role: "Career Counseling",
    timeLabel: "2:00 PM",
    dateLabel: "Today, March 15",
    avatar: "/file.svg",
  };

  const upcoming = [
    { counselor: "Dr. Emily Smith", topic: "Stress Management", datetime: "March 16, 10:00 AM", avatar: "/globe.svg" },
    { counselor: "Mr. David Wilson", topic: "Interview Prep", datetime: "March 20, 3:30 PM", avatar: "/window.svg" },
  ];

  const availableNow = [
    { name: "Dr. Lisa Brown", status: "Online" as const, specialty: "Stress Management", avatar: "/globe.svg" },
    { name: "Mr. James Taylor", status: "Online" as const, specialty: "Career Guidance", avatar: "/window.svg" },
  ];

  const quickActions = [
    { title: "Book Session", icon: "Calendar" as const, href: "/studentbookappointmentpage" },
    { title: "My Appointments", icon: "BookOpen" as const, href: "/studentappointmentdetailspage" },
    { title: "Join Meeting", icon: "Video" as const, href: "#" },
    { title: "Messages", icon: "MessageSquare" as const, href: "#" },
  ];

  const messages = [
    { from: "Dr. Johnson", preview: "Please prepare the resume for review…", time: "2h ago", avatar: "/file.svg", unread: true },
    { from: "Ms. Alvarez", preview: "Looking forward to our session today!", time: "5h ago", avatar: "/globe.svg", unread: false },
  ];

  return (
    <div className="space-y-10">
      <HeroCard />
      {/* Outer container to match mock: rounded, bordered, subtle shadow */}
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {/* Welcome + Calendar */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">Welcome back!</h2>
            <NextAppointmentCard appointment={nextAppointment} compact />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">March 2024</h3>
            <CalendarWidget />
          </div>
        </div>

        {/* Two columns below: Upcoming + Available, and Quick Actions + Recent Messages */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <SectionCard title="Upcoming Appointments">
              <UpcomingAppointmentsList items={upcoming} />
            </SectionCard>

            <SectionCard title="Quick Actions">
              <QuickActionsGrid actions={quickActions} />
            </SectionCard>
          </div>
          <div className="space-y-8">
            <SectionCard title="Available Now">
              <AvailableCounselorsList items={availableNow} />
            </SectionCard>

            <SectionCard title="Recent Messages">
              <RecentMessages items={messages} />
            </SectionCard>
          </div>
        </div>
      </section>
    </div>
  );
}
