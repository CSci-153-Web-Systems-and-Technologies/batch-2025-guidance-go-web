"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const search = useSearchParams();
  const initialRole = (search.get("role") as "student" | "counselor") || "student";
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
        // Determine role reliably: prefer auth user metadata.role
        const metaRole = (user.user_metadata?.role as "student" | "counselor" | undefined) || undefined;
        const role = metaRole ?? initialRole;
        if (role === "student") {
          // Ensure profile exists; if exists, backfill missing email/name
          const { data: existing } = await supabase
            .from("students")
            .select("student_id, full_name, email")
            .eq("auth_user_id", user.id)
            .maybeSingle();
          const fallbackName = (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "Student";
          if (!existing) {
            const { error: insErr } = await supabase.from("students").insert({
              auth_user_id: user.id,
              full_name: fallbackName,
              email: user.email,
            });
            if (insErr) throw insErr;
          } else {
            const needsEmail = !existing.email && user.email;
            const needsName = !existing.full_name || existing.full_name.trim().length === 0;
            if (needsEmail || needsName) {
              const { error: updErr } = await supabase
                .from("students")
                .update({
                  email: needsEmail ? user.email : existing.email,
                  full_name: needsName ? fallbackName : existing.full_name,
                })
                .eq("student_id", existing.student_id);
              if (updErr) throw updErr;
            }
          }
          // Sync auth metadata full_name from DB
          try {
            const { data: prof } = await supabase
              .from("students")
              .select("full_name")
              .eq("auth_user_id", user.id)
              .limit(1);
            const dbName = prof && prof[0]?.full_name;
            if (dbName && dbName.trim().length > 0) {
              await supabase.auth.updateUser({ data: { full_name: dbName } });
            }
          } catch {}
          router.replace("/student-dashboard");
        } else {
          // Ensure counselor profile exists; if exists, backfill missing email/name
          const { data: existing } = await supabase
            .from("counselors")
            .select("counselor_id, full_name, email")
            .eq("auth_user_id", user.id)
            .maybeSingle();
          const fallbackName = (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "Counselor";
          if (!existing) {
            const { error: insErr } = await supabase.from("counselors").insert({
              auth_user_id: user.id,
              full_name: fallbackName,
              email: user.email,
            });
            if (insErr) throw insErr;
          } else {
            const needsEmail = !existing.email && user.email;
            const needsName = !existing.full_name || existing.full_name.trim().length === 0;
            if (needsEmail || needsName) {
              const { error: updErr } = await supabase
                .from("counselors")
                .update({
                  email: needsEmail ? user.email : existing.email,
                  full_name: needsName ? fallbackName : existing.full_name,
                })
                .eq("counselor_id", existing.counselor_id);
              if (updErr) throw updErr;
            }
          }
          // Sync auth metadata full_name from DB
          try {
            const { data: prof } = await supabase
              .from("counselors")
              .select("full_name")
              .eq("auth_user_id", user.id)
              .limit(1);
            const dbName = prof && prof[0]?.full_name;
            if (dbName && dbName.trim().length > 0) {
              await supabase.auth.updateUser({ data: { full_name: dbName } });
            }
          } catch {}
          router.replace("/counselor-dashboard");
        }
      } catch (e: any) {
        setMessage(e?.message || "Error completing sign in.");
      }
    }
    run();
  }, [router, initialRole]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="rounded-xl border bg-white p-6 shadow-sm text-sm text-zinc-700">{message}</div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><div className="rounded-xl border bg-white p-6 shadow-sm text-sm text-zinc-700">Finishing sign in…</div></div>}>
      <CallbackContent />
    </Suspense>
  );
}
