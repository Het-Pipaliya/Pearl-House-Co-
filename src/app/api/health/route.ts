import { NextResponse } from "next/server";
import { databaseStatus } from "@/lib/db";
import { authEnabled } from "@/lib/supabase/env";
import { cfg } from "@/lib/config";

export const dynamic = "force-dynamic";
/** Setup self-check. Reports what is connected, never any secret value. */
export async function GET() {
  return NextResponse.json({
    database: await databaseStatus(),
    signIn: authEnabled ? "configured" : "not configured",
    emailKey: cfg.resendKey ? "set" : "missing",
    businessEmail: cfg.businessEmail ? "set" : "missing",
    adminEmails: (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean).length,
  }, { headers: { "Cache-Control": "no-store" } });
}
