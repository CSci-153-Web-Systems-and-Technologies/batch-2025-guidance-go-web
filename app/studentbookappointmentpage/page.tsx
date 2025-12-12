import { Navbar } from "../../components/student-dashboard/Navbar";
import { Sidebar } from "../../components/student-dashboard/Sidebar";
import { SectionCard } from "../../components/student-dashboard/SectionCard";
import { BookingForm } from "../../components/studentbookappointmentpage/BookingForm";
import Footer from "../../components/ui/Footer";

export default function StudentBookAppointmentPage() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Navbar />
      <div className="grid grid-cols-12 gap-6 px-6 py-8">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <SectionCard title="Book an Appointment" subtitle="Schedule your counseling session with our professional therapists">
            <div className="mx-auto max-w-2xl">
              <BookingForm />
            </div>
          </SectionCard>
        </div>
      </div>
      <Footer />
    </div>
  );
}
