import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/supabase/env";

/** Google sends the visitor back here with a one-time code; exchange it for a session cookie. */
export async function GET(req: Request) {
  const url = new URL(req.url); const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/account"; // never redirect off-site
  if (authEnabled && code) {
    const { error } = await supabaseServer().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
  }
  return NextResponse.redirect(new URL("/signin?error=1", url.origin));
}
