"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const role = (search.get("role") as "student" | "counselor") || "student";
  const [message, setMessage] = useState("Finishing sign in…");

  useEffect(() => {
    async function run() {
      if (!isSupabaseConfigured) {
        setMessage("Supabase is not configured.");
        return;
      }
      const supabase = getSupabaseClient();
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes.user) {
        setMessage(userErr?.message || "No authenticated user found.");
        return;
      }
      const user = userRes.user;

      try {
        if (role === "student") {
          // If profile doesn't exist, create it
          const { data: existing } = await supabase
            .from("students")
            .select("student_id")
            .eq("auth_user_id", user.id)
            .maybeSingle();
          if (!existing) {
            const { error: insErr } = await supabase.from("students").insert({
              auth_user_id: user.id,
              full_name: (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "Student",
              email: user.email,
            });
            if (insErr) throw insErr;
          }
          router.replace("/student-dashboard");
        } else {
          const { data: existing } = await supabase
            .from("counselors")
            .select("counselor_id")
            .eq("auth_user_id", user.id)
            .maybeSingle();
          if (!existing) {
            const { error: insErr } = await supabase.from("counselors").insert({
              auth_user_id: user.id,
              full_name: (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "Counselor",
              email: user.email,
            });
            if (insErr) throw insErr;
          }
          router.replace("/counselor-dashboard");
        }
      } catch (e: any) {
        setMessage(e?.message || "Error completing sign in.");
      }
    }
    run();
  }, [router, role]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="rounded-xl border bg-white p-6 shadow-sm text-sm text-zinc-700">{message}</div>
    </div>
  );
}
