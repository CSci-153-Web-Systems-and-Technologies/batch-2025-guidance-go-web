"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export default function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [resolvedName, setResolvedName] = useState<string | null>(name ?? null);
  const [resolvedEmail, setResolvedEmail] = useState<string | null>(email ?? null);
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(avatarUrl ?? null);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    async function loadUser() {
      try {
        // Skip auth calls during hard logout to avoid aborted fetch noise
        if (typeof window !== "undefined" && localStorage.getItem("signingOut") === "1") {
          // Clear the flag on the new page load
          setTimeout(() => {
            try {
              localStorage.removeItem("signingOut");
            } catch {}
          }, 0);
          return;
        }
        if (!isSupabaseConfigured) return;
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user ?? null;
        if (u) {
          const meta: any = u.user_metadata || {};
          setResolvedEmail(u.email ?? null);
          // Prefer prop name (from DB) over metadata, then email prefix
          const emailPrefix = u.email?.split("@")[0] ?? null;
          setResolvedName((name ?? null) ?? ((meta.full_name as string | undefined) ?? emailPrefix));
          setResolvedAvatar((meta.avatar_url as string | undefined) ?? null);
        } else {
          setResolvedEmail(email ?? null);
          setResolvedName(name ?? null);
          setResolvedAvatar(avatarUrl ?? null);
        }
      } catch {
        // ignore
      }
    }
    loadUser();
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        if (typeof window !== "undefined" && localStorage.getItem("signingOut") === "1") {
          return;
        }
        const u = sess?.user ?? null;
        if (u) {
          const meta: any = u.user_metadata || {};
          setResolvedEmail(u.email ?? null);
          const emailPrefix = u.email?.split("@")[0] ?? null;
          setResolvedName((name ?? null) ?? ((meta.full_name as string | undefined) ?? emailPrefix));
          setResolvedAvatar((meta.avatar_url as string | undefined) ?? null);
        } else {
          setResolvedEmail(null);
          setResolvedName(null);
          setResolvedAvatar(null);
        }
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [name, email, avatarUrl]);

  async function handleSignOut() {
    try {
      setSigningOut(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("signingOut", "1");
        }
      } catch {}
      const supabase = isSupabaseConfigured ? getSupabaseClient() : null;
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // Network hiccups can throw; proceed to hard redirect regardless
          console.warn("Supabase signOut error", e);
        }
      }
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setOpen(false);
      setSigningOut(false);
      // Use hard redirect to fully clear any stale state
      try {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        } else {
          router.replace("/");
        }
      } catch {}
    }
  }

  const initials = (
    (!resolvedName ? "U" : resolvedName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()) ?? "U"
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100 transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
          {resolvedAvatar ? (
            <img src={resolvedAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div role="menu" aria-label="Account menu" className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                {resolvedAvatar ? (
                  <img src={resolvedAvatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <span className="text-lg">{initials}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">{resolvedName ?? "User"}</div>
                <div className="text-xs text-slate-500">{resolvedEmail ?? ""}</div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button onClick={handleSignOut} disabled={signingOut} className="w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg transition shadow-sm hover:bg-blue-50 hover:text-blue-700 hover:shadow-md hover:ring-2 hover:ring-blue-200 disabled:opacity-60">
              <svg className={`w-5 h-5 ${signingOut ? "animate-spin text-blue-600" : "text-slate-600"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="text-sm">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
