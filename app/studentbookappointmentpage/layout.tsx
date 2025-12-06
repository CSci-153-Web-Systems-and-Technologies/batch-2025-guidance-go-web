export const metadata = {
  title: "Student Book Appointment",
};

export default function StudentBookAppointmentLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-zinc-50">{children}</div>;
}
