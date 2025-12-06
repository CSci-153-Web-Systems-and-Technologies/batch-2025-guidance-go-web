import { Navbar } from "../../components/dashboard/Navbar";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { SectionCard } from "../../components/dashboard/SectionCard";
import { BookingForm } from "../../components/studentbookappointmentpage/BookingForm";

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
      <footer className="border-t bg-white px-6 py-6 text-sm text-zinc-500">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-semibold text-zinc-900">GuidanceGo</div>
            <p>Professional counseling services made accessible and convenient for everyone.</p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-900">Quick Links</div>
            <ul className="mt-2 space-y-1">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-900">Legal</div>
            <ul className="mt-2 space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>HIPAA Compliance</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="font-semibold text-zinc-900">Contact</div>
            <ul className="mt-2 space-y-1">
              <li>support@guidancego.com</li>
              <li>1-800-GUIDANCE</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center">© 2024 GuidanceGo. All rights reserved.</div>
      </footer>
    </div>
  );
}
