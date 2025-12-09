import { Navbar } from "../../components/student-dashboard/Navbar";
import { Sidebar } from "../../components/student-dashboard/Sidebar";
import Footer from "../../components/ui/Footer";
import { HeroCard } from "../../components/student-dashboard/HeroCard";
import { NextAppointmentCard } from "../../components/student-dashboard/NextAppointmentCard";
import { SectionCard } from "../../components/student-dashboard/SectionCard";
import { CalendarWidget } from "../../components/student-dashboard/CalendarWidget";
import { UpcomingAppointmentsList } from "../../components/student-dashboard/UpcomingAppointmentsList";
import { QuickActionsGrid } from "../../components/student-dashboard/QuickActionsGrid";
import { RecentMessages } from "../../components/student-dashboard/RecentMessages";

export default function StudentAppointmentDetailsPage() {
  const appointment = {
    title: "Appointment Details",
    role: "Student" as const,
    timeLabel: "Time",
    dateLabel: "Date",
    counselor: "Dr. Sarah Johnson",
    date: "March 15, 2024",
    time: "2:00 PM - 2:50 PM",
    duration: "50 minutes",
    type: "Individual Session",
    status: "Confirmed" as const,
  };

  const upcoming = [
    { id: 1, topic: "Anxiety Management", counselor: "Dr. Chan", datetime: "Mar 18, 2024 • 10:00 AM" },
    { id: 2, topic: "Study Habits", counselor: "Dr. Kim", datetime: "Mar 20, 2024 • 1:30 PM" },
    { id: 3, topic: "Group Therapy", counselor: "Dr. Lee", datetime: "Mar 22, 2024 • 3:00 PM" },
  ];

  const actions = [
    { id: "join", title: "Join Session", icon: "Video" as const, href: "#" },
    { id: "reschedule", title: "Reschedule", icon: "Calendar" as const, href: "#" },
    { id: "resources", title: "Resources", icon: "BookOpen" as const, href: "#" },
  ];

  const messages = [
    { id: 1, from: "System", title: "Session accepted with Dr. Chan", preview: "Your session has been confirmed.", time: "Mar 10" },
    { id: 2, from: "Scheduler", title: "Appointment scheduled for tomorrow", preview: "Reminder for your upcoming session.", time: "Mar 14" },
    { id: 3, from: "Resources", title: "New resource: Anxiety Management", preview: "Access helpful materials before your session.", time: "Mar 15" },
  ];
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Navbar />
      <div className="grid grid-cols-12 gap-6 px-6 py-8">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <div className="mb-6">
            <HeroCard />
          </div>
          <div className="mb-6">
            <NextAppointmentCard appointment={appointment} />
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-7">
              <SectionCard title="Schedule">
                <CalendarWidget />
              </SectionCard>
            </div>
            <div className="col-span-12 xl:col-span-5">
              <SectionCard title="Upcoming Appointments">
                <UpcomingAppointmentsList items={upcoming} />
              </SectionCard>
              <div className="mt-6">
                <SectionCard title="Quick Actions">
                  <QuickActionsGrid actions={actions} />
                </SectionCard>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <SectionCard title="Recent Activity">
              <RecentMessages items={messages} />
            </SectionCard>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
