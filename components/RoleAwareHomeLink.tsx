"use client";

import Link from "next/link";
import * as React from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export function RoleAwareHomeLink({ className = "text-zinc-700 hover:text-black", children = "Home" }: { className?: string; children?: React.ReactNode }) {
  const [href, setHref] = React.useState<string>("/");

  React.useEffect(() => {
    let cancel = false;
    async function resolveHref() {
      try {
        if (!isSupabaseConfigured) return;
        const sb = getSupabaseClient();
        const { data: sess } = await sb.auth.getSession();
        const user = sess.session?.user;
        if (!user) return; // keep default '/'
        // Check counselor first
        const { data: c } = await sb
          .from("counselors")
          .select("counselor_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (!cancel && c?.counselor_id) {
          setHref("/counselor-dashboard");
          return;
        }
        // Then student
        const { data: s } = await sb
          .from("students")
          .select("student_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (!cancel && s?.student_id) {
          setHref("/student-dashboard");
          return;
        }
      } catch {
        // ignore and keep default
      }
    }
    resolveHref();
    return () => { cancel = true; };
  }, []);

  return (
    <Link className={className} href={href}>{children}</Link>
  );
}
