import type { ReactNode } from "react";
import { Navbar } from "../../components/student-dashboard/Navbar";
import { Sidebar } from "../../components/student-dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-8 py-6">
          <aside className="hidden md:block">
            <Sidebar />
          </aside>
          <main className="space-y-8">{children}</main>
        </div>
      </div>
      <footer className="border-t bg-[#0b1220] px-6 py-10 text-sm text-zinc-300">
        <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-2 text-zinc-100">
              <div className="h-7 w-7 rounded-full border-2 border-blue-500" />
              <span className="font-semibold">GuidanceGo</span>
            </div>
            <p className="mt-2 text-zinc-400">Professional counseling services made accessible and convenient for everyone.</p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-100">Quick Links</div>
            <ul className="mt-2 space-y-1">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-semibold text-zinc-100">Legal</div>
            <ul className="mt-2 space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>HIPAA Compliance</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="font-semibold text-zinc-100">Contact</div>
            <ul className="mt-2 space-y-1">
              <li>support@guidancego.com</li>
              <li>1-800-GUIDANCE</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-6xl text-center text-zinc-400">&copy; {new Date().getFullYear()} GuidanceGo. All rights reserved.</div>
      </footer>
    </div>
  );
}
