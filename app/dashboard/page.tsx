import { HeroCard } from "../../components/dashboard/HeroCard";
import { NextAppointmentCard } from "../../components/dashboard/NextAppointmentCard";
import { CalendarWidget } from "../../components/dashboard/CalendarWidget";
import { SectionCard } from "../../components/dashboard/SectionCard";
import { UpcomingAppointmentsList } from "../../components/dashboard/UpcomingAppointmentsList";
import { AvailableCounselorsList } from "../../components/dashboard/AvailableCounselorsList";
import { QuickActionsGrid } from "../../components/dashboard/QuickActionsGrid";
import { RecentMessages } from "../../components/dashboard/RecentMessages";

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
    { title: "Book Session", icon: "Calendar" as const, href: "#" },
    { title: "Join Meeting", icon: "Video" as const, href: "#" },
    { title: "Resources", icon: "BookOpen" as const, href: "#" },
    { title: "Messages", icon: "MessageSquare" as const, href: "#" },
  ];

  const messages = [
    { from: "Dr. Johnson", preview: "Please prepare the resume for review…", time: "2h ago", avatar: "/file.svg", unread: true },
    { from: "Ms. Alvarez", preview: "Looking forward to our session today!", time: "5h ago", avatar: "/globe.svg", unread: false },
  ];

  return (
    <div className="space-y-8">
      <HeroCard />

      <div className="mx-auto max-w-[1200px]">
        <NextAppointmentCard appointment={nextAppointment} />
      </div>

      <SectionCard title="Welcome back, Sarah!" subtitle="You have 2 upcoming appointments this week" right={<div className="text-sm text-muted">Today<br />March 15, 2024</div>}>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <NextAppointmentCard appointment={nextAppointment} compact />
          <CalendarWidget />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Upcoming Appointments">
          <UpcomingAppointmentsList items={upcoming} />
        </SectionCard>

        <SectionCard title="Available Now">
          <AvailableCounselorsList items={availableNow} />
        </SectionCard>

        <SectionCard title="Quick Actions">
          <QuickActionsGrid actions={quickActions} />
        </SectionCard>
      </div>

      <SectionCard title="Recent Messages">
        <RecentMessages items={messages} />
      </SectionCard>
    </div>
  );
}
