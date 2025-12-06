import type { ReactNode } from "react";
import { Navbar } from "../../components/dashboard/Navbar";
import { Sidebar } from "../../components/dashboard/Sidebar";

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
      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 text-sm text-muted">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="font-semibold">GuidanceGo</div>
              <p className="mt-2">Professional counseling services to help you grow.</p>
            </div>
            <div>
              <div className="font-semibold">Quick Links</div>
              <ul className="mt-2 space-y-1">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Services</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Legal</div>
              <ul className="mt-2 space-y-1">
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">HIPAA Compliance</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Contact</div>
              <ul className="mt-2 space-y-1">
                <li>support@guidancego.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-muted">&copy; {new Date().getFullYear()} GuidanceGo. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
