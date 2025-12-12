export const metadata = {
  title: "Student Appointment Details",
};

export default function StudentAppointmentDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {children}
    </div>
  );
}
