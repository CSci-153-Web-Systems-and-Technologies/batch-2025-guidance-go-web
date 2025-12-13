"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { Navbar } from "../../components/student-dashboard/Navbar";
import { Sidebar } from "../../components/student-dashboard/Sidebar";
import Footer from "../../components/ui/Footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    let cancel = false;
    async function guard() {
      try {
        if (!isSupabaseConfigured) return;
        const sb = getSupabaseClient();
        const { data: userRes } = await sb.auth.getUser();
        if (!userRes?.user && !cancel) {
          router.replace("/loginpage");
        }
      } catch {}
    }
    guard();
    return () => { cancel = true; };
  }, [router]);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr] md:gap-8 py-6">
          <aside className="hidden md:block">
            <Sidebar />
          </aside>
          <main className="space-y-8">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
