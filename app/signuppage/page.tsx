"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";
import Footer from "../../components/ui/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "counselor">("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSignup() {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setNeedsConfirmation(false);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${window.location.origin}/loginpage`,
        },
      });
      if (error) throw error;
      setSuccessMsg("Success! Please check your email to confirm your account.");
      setNeedsConfirmation(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Unable to sign up.");
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      setSuccessMsg("Confirmation email sent. Please check your inbox.");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Unable to resend confirmation email.");
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

      {/* Hero + Signup Card */}
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
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 text-blue-600">📝</div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">Hello</h2>
              <p className="text-sm text-zinc-500">Sign up for your account</p>
            </div>
            <form className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Sign up as</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "student" | "counselor")}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                </select>
              </div>

              {!isSupabaseConfigured && (
                <div className="text-sm text-red-600">
                  Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
                </div>
              )}
              {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
              {successMsg && <div className="text-sm text-green-600">{successMsg}</div>}
              {!needsConfirmation ? (
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={loading || !isSupabaseConfigured}
                  className="h-10 w-full rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-zinc-700">
                    Please confirm your email first. After confirming, sign in to create your profile automatically.
                  </div>
                  <button
                    type="button"
                    onClick={resendConfirmation}
                    className="h-10 w-full rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Resend confirmation
                  </button>
                </div>
              )}
              <div className="text-center text-sm text-zinc-600">Or sign up with</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="h-10 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  disabled
                  title="Microsoft provider not configured"
                >
                  Microsoft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(
                      "Google sign up needs Google Cloud OAuth set up first. To keep things simple and free, please use email sign up."
                    );
                  }}
                  className="h-10 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Google
                </button>
              </div>
              {!needsConfirmation && (
                <div className="text-center text-sm text-zinc-600">
                  Didn’t get the email? <button type="button" onClick={resendConfirmation} className="text-blue-600 hover:underline">Resend confirmation</button>
                </div>
              )}
              <div className="text-center text-sm text-zinc-600">
                Already have an account? <Link href="/loginpage" className="text-blue-600 hover:underline">Sign in</Link>
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
