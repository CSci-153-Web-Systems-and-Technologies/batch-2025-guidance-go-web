import Image from "next/image";
import { LogoImage } from "../components/ui/Logo";
import Footer from "../components/ui/Footer";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-zinc-50">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <LogoImage width={32} height={32} priority className="rounded" />
            <span className="text-lg font-semibold text-zinc-900">GuidanceGo</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-700 sm:flex">
            <a href="/" className="hover:text-zinc-900">Home</a>
            <a href="/aboutpage" className="hover:text-zinc-900">About</a>
            <a href="/servicespage" className="hover:text-zinc-900">Services</a>
            <a href="/contactpage" className="hover:text-zinc-900">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/loginpage" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Login</a>
            <a href="/signuppage" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Sign Up</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="flex h-[420px] w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4">
              <LogoImage width={120} height={120} priority className="mx-auto" />
            </div>
            <h1 className="text-5xl font-bold text-blue-600">GuidanceGo</h1>
            <p className="mt-2 text-lg text-zinc-600">Fast &amp; Secure Counseling Scheduler</p>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50" href="/student-dashboard">Student Dashboard</a>
          <a className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50" href="/studentappointmentdetailspage">Appointment Details</a>
          <a className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50" href="/studentbookappointmentpage">Book Appointment</a>
          <a className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50" href="/counselor-dashboard">Counselor Dashboard</a>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
