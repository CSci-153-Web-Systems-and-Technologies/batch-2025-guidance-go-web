"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";
import Footer from "../../components/ui/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // TODO: check user role from your database/profile table.
      // For now, redirect students to student dashboard.
      router.push("/student-dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto] bg-zinc-50">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="GuidanceGo logo" width={32} height={32} priority className="rounded" />
            <span className="text-lg font-semibold text-zinc-900">GuidanceGo</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-700 sm:flex">
            <Link href="/" className="hover:text-zinc-900">Home</Link>
            <Link href="/aboutpage" className="hover:text-zinc-900">About</Link>
            <Link href="/servicespage" className="hover:text-zinc-900">Services</Link>
            <Link href="/contactpage" className="hover:text-zinc-900">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/loginpage" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Login</Link>
            <Link href="/signuppage" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero + Login Card */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4">
              <Image src="/logo.png" alt="GuidanceGo logo" width={120} height={120} priority className="mx-auto" />
            </div>
            <h1 className="text-5xl font-bold text-blue-600">GuidanceGo</h1>
            <p className="mt-2 text-lg text-zinc-600">Fast &amp; Secure Counseling Scheduler</p>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 text-blue-600">👤</div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">Welcome</h2>
              <p className="text-sm text-zinc-500">Sign in to your account</p>
            </div>
            <form className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                  Keep me signed in
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
              {!isSupabaseConfigured && (
                <div className="text-sm text-red-600">
                  Supabase is not configured. Ask your teammate for the .env settings, or set
                  NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in a .env.local file.
                </div>
              )}
              {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
              <button type="button" onClick={handleSignIn} disabled={loading || !isSupabaseConfigured} className="h-10 w-full rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <div className="text-center text-sm text-zinc-600">
                Don't have an account? <Link href="/signuppage" className="text-blue-600 hover:underline">Sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
