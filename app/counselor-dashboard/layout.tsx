import type { ReactNode } from "react";
import { CounselorNavbar } from "../../components/counselor-dashboard/CounselorNavbar";
import { CounselorSidebar } from "../../components/counselor-dashboard/CounselorSidebar";
import Footer from "../../components/ui/Footer";

export default function CounselorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <CounselorNavbar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-8 py-6">
          <aside className="hidden md:block">
            <CounselorSidebar />
          </aside>
          <main className="space-y-8">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
