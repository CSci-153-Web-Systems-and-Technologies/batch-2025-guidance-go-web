"use client";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string | null; email?: string | null; avatar?: string | null } | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    async function load() {
      try {
        if (!isSupabaseConfigured) return;
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user ?? null;
        if (u) {
          const meta: any = u.user_metadata || {};
          setUser({
            email: u.email,
            name: (meta.full_name as string | undefined) ?? u.email?.split("@")[0] ?? null,
            avatar: (meta.avatar_url as string | undefined) ?? null,
          });
        } else {
          setUser(null);
        }
      } catch {
        // ignore
      }
    }
    load();
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
        const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
          const u = sess?.user ?? null;
        if (u) {
          const meta: any = u.user_metadata || {};
          setUser({
            email: u.email,
            name: (meta.full_name as string | undefined) ?? u.email?.split("@")[0] ?? null,
            avatar: (meta.avatar_url as string | undefined) ?? null,
          });
        } else {
          setUser(null);
        }
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100">
      <div className="font-bold">GuidanceGo</div>
      <div className="flex items-center gap-4">
        <UserMenu name={user?.name} email={user?.email} avatarUrl={user?.avatar} />
      </div>
    </nav>
  );
}
