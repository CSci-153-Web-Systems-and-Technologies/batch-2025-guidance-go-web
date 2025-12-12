"use client";
import Image from "next/image";
import { LogoImage } from "../components/ui/Logo";
import Footer from "../components/ui/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function checkAndRedirect() {
      try {
        // Ensure Supabase is properly configured before calling auth
        if (!isSupabaseConfigured) return;
        const sb = getSupabaseClient();
        const { data } = await sb.auth.getSession();
        const user = data?.session?.user ?? null;
        if (!user) return;
        const { data: stu } = await sb
          .from("students")
          .select("student_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (!cancelled && stu?.student_id) {
          router.replace("/student-dashboard");
        }
      } catch {
        // ignore
      }
    }
    // Prefetch dashboard to minimize redirect flicker
    try { router.prefetch("/student-dashboard"); } catch {}
    checkAndRedirect();
    return () => { cancelled = true; };
  }, [router]);
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
          {/* Top-right auth buttons removed per request */}
        </div>
      </header>

      {/* Auth-only landing */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="mx-auto mb-4">
            <LogoImage width={120} height={120} priority className="mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-blue-600">Welcome to GuidanceGo</h1>
          <p className="mt-2 text-sm text-zinc-600">Please sign in or create an account to continue.</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
          <a href="/loginpage" className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700">Log In</a>
          <a href="/signuppage" className="rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-zinc-50">Sign Up</a>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
