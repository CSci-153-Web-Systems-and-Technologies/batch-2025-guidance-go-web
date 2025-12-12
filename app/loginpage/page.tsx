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
  const [askNameOpen, setAskNameOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savingName, setSavingName] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) throw new Error("No user session after sign in.");

      // Determine role and target table
      const metaRole = (data.user?.user_metadata?.role as "student" | "counselor" | undefined) || "student";
      const table = metaRole === "counselor" ? "counselors" : "students";
      const idColumn = metaRole === "counselor" ? "counselor_id" : "student_id";

      // Ensure profile row exists in the correct table; create it on first login if missing.
      const { data: existing, error: selErr } = await supabase
        .from(table)
        .select(`${idColumn}, full_name, email`)
        .eq("auth_user_id", userId)
        .limit(1);
      if (selErr) throw selErr;

      const fullNameFromMeta = (data.user?.user_metadata as any)?.full_name ?? "";
      if (!existing || existing.length === 0) {
        const { error: insErr } = await supabase.from(table).insert({
          auth_user_id: userId,
          full_name: fullNameFromMeta,
          email,
        });
        if (insErr) throw insErr;
      } else {
        // Sync email if missing
        const row = existing[0];
        if (!row.email) {
          await supabase.from(table).update({ email }).eq("auth_user_id", userId);
        }
        // Ensure display name is present
        if (!row.full_name || row.full_name.trim().length === 0) {
        // Only update if DB name is empty; never overwrite a non-empty name
        if (fullNameFromMeta && fullNameFromMeta.trim().length > 0) {
          const { error: updErr } = await supabase
            .from(table)
            .update({ full_name: fullNameFromMeta })
            .eq("auth_user_id", userId);
          if (updErr) throw updErr;
        } else {
          // Ask user for a name before redirecting
          setAskNameOpen(true);
          setTempName("");
          return; // wait for user to submit name
        }
        }
      }

      // Sync auth user metadata full_name from DB so menus show consistent name
      try {
        const { data: prof } = await supabase
          .from(table)
          .select("full_name")
          .eq("auth_user_id", userId)
          .limit(1);
        const dbName = prof && prof[0]?.full_name;
        if (dbName && dbName.trim().length > 0) {
          await supabase.auth.updateUser({ data: { full_name: dbName } });
        }
      } catch {
        // non-blocking
      }

      // Route based on role (from the signed-in user's metadata)
      router.push(metaRole === "counselor" ? "/counselor-dashboard" : "/student-dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function saveDisplayName() {
    if (!tempName.trim()) {
      setErrorMsg("Please enter a name.");
      return;
    }
    try {
      setSavingName(true);
      const supabase = getSupabaseClient();
      const { data: session } = await supabase.auth.getUser();
      const userId = session.user?.id;
      if (!userId) throw new Error("No session.");
      const metaRole2 = (session.user?.user_metadata?.role as "student" | "counselor" | undefined) || "student";
      const table2 = metaRole2 === "counselor" ? "counselors" : "students";
      const { error } = await supabase
        .from(table2)
        .update({ full_name: tempName.trim() })
        .eq("auth_user_id", userId);
      if (error) throw error;
      // Also update auth metadata for consistency
      try {
        await supabase.auth.updateUser({ data: { full_name: tempName.trim() } });
      } catch {}
      setAskNameOpen(false);
      router.push(metaRole2 === "counselor" ? "/counselor-dashboard" : "/student-dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Could not save name.");
    } finally {
      setSavingName(false);
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

      {askNameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-zinc-900">What should we call you?</h3>
            <p className="mt-1 text-sm text-zinc-600">Add a display name for your profile.</p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your name"
              className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
            />
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAskNameOpen(false)}
                className="h-9 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDisplayName}
                disabled={savingName}
                className="h-9 rounded-full bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingName ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
