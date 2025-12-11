"use client";

import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { LogoImage } from "../ui/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import UserMenu from "@/components/UserMenu";

export function CounselorNavbar() {
  const [displayName, setDisplayName] = useState<string>("");
  const [roleLabel, setRoleLabel] = useState<string>("Counselor");
  const [email, setEmail] = useState<string>("");
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
        if (!isSupabaseConfigured) return;
        const supabase = getSupabaseClient();
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth.user?.id;
        if (!userId) return;
        setEmail(auth.user?.email ?? "");
        const userMeta = (auth.user?.user_metadata as any) || {};
        const metaName = (userMeta?.full_name as string | undefined) || (userMeta?.name as string | undefined);
        setRoleLabel("Counselor");

        const { data, error } = await supabase
          .from("counselors")
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
        }
      } catch {
        // silent fail
      }
    }
    loadName();
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      const { data: sub } = supabase.auth.onAuthStateChange(() => {
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-white overflow-hidden ring-2 ring-blue-500">
              <LogoImage fill sizes="32px" className="object-contain" priority />
            </div>
            <span className="font-semibold text-blue-600">GuidanceGo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="text-zinc-700 hover:text-black" href="/">Home</Link>
            <Link className="text-zinc-700 hover:text-black" href="/aboutpage">About</Link>
            <Link className="text-zinc-700 hover:text-black" href="/servicespage">Services</Link>
            <Link className="text-zinc-700 hover:text-black" href="/contactpage">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center rounded-full border px-3 py-1 text-sm text-zinc-700">Counselor View</span>
          <button className="relative rounded-full p-2 hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5 text-zinc-700" />
            <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 rounded-full border px-2 py-1">
            <UserMenu name={displayName || undefined} email={email || undefined} />
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-blue-500/60" />
    </header>
  );
}
