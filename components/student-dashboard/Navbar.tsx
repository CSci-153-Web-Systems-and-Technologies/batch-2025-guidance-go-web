"use client";

import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { LogoImage } from "../ui/Logo";
import Link from "next/link";
import { RoleAwareHomeLink } from "@/components/RoleAwareHomeLink";
import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import UserMenu from "@/components/UserMenu";

export function Navbar() {
  const [displayName, setDisplayName] = useState<string>("");
  const [roleLabel, setRoleLabel] = useState<string>("Student");
  const [email, setEmail] = useState<string>("");
  const [askNameOpen, setAskNameOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("")
    : "";

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    async function loadName() {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("signingOut") === "1") {
          setTimeout(() => {
            try { localStorage.removeItem("signingOut"); } catch {}
          }, 0);
          return;
        }
        if (!isSupabaseConfigured) return;
        const supabase = getSupabaseClient();
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth.user?.id;
        if (!userId) return;
        setEmail(auth.user?.email ?? "");
        const userMeta = (auth.user?.user_metadata as any) || {};
        const metaName = (userMeta?.full_name as string | undefined) || (userMeta?.name as string | undefined);
        const role = (userMeta?.role as string | undefined) || "student";
        setRoleLabel(role === "counselor" ? "Counselor" : "Student");

        const table = role === "counselor" ? "counselors" : "students";
        const { data, error } = await supabase
          .from(table)
          .select("full_name,email")
          .eq("auth_user_id", userId)
          .limit(1);
        if (!error && data && data.length > 0) {
          const name = data[0]?.full_name as string | undefined;
          if (name && name.trim().length > 0) {
            setDisplayName(name);
            return;
          }
        }
        if (metaName && metaName.trim().length > 0) {
          setDisplayName(metaName);
        } else {
          // Both DB and metadata name empty: prompt for a name
          setAskNameOpen(true);
        }
      } catch {
        // silent fail
      }
    }
    loadName();
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
        if (typeof window !== "undefined" && localStorage.getItem("signingOut") === "1") return;
        loadName();
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-white overflow-hidden ring-2 ring-blue-500">
              <LogoImage fill sizes="32px" className="object-contain" priority />
            </div>
            <span className="font-semibold text-blue-600">GuidanceGo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <RoleAwareHomeLink className="text-zinc-700 hover:text-black">Home</RoleAwareHomeLink>
            <Link className="text-zinc-700 hover:text-black" href="/aboutpage">About</Link>
            <Link className="text-zinc-700 hover:text-black" href="/servicespage">Services</Link>
            <Link className="text-zinc-700 hover:text-black" href="/contactpage">Contact</Link>
          </nav>
        </div>

        {/* Right: Student View pill + Profile */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center rounded-full border px-3 py-1 text-sm text-zinc-700">Student View</span>
          <button className="relative rounded-full p-2 hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5 text-zinc-700" />
            <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 rounded-full border px-2 py-1">
            <UserMenu name={displayName || undefined} email={email || undefined} />
          </div>
        </div>
      </div>
      {/* Accent bottom border to match screenshot */}
      <div className="h-[3px] w-full bg-blue-500/60" />
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
                onClick={async () => {
                  if (!tempName.trim()) return;
                  try {
                    setSavingName(true);
                    const supabase = getSupabaseClient();
                    const { data: auth } = await supabase.auth.getUser();
                    const userId = auth.user?.id;
                    if (!userId) throw new Error("No session.");
                    // Update students/counselors table depending on role
                    const userMeta = (auth.user?.user_metadata as any) || {};
                    const role = (userMeta?.role as string | undefined) || "student";
                    const table = role === "counselor" ? "counselors" : "students";
                    const { error } = await supabase
                      .from(table)
                      .update({ full_name: tempName.trim() })
                      .eq("auth_user_id", userId);
                    if (error) throw error;
                    // Also update auth metadata for consistency
                    try {
                      await supabase.auth.updateUser({ data: { full_name: tempName.trim() } });
                    } catch {}
                    setDisplayName(tempName.trim());
                    setAskNameOpen(false);
                  } catch {
                    // ignore
                  } finally {
                    setSavingName(false);
                  }
                }}
                disabled={savingName}
                className="h-9 rounded-full bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingName ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
