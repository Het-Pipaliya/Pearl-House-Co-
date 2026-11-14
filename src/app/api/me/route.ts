import { NextResponse } from "next/server";
import { authEnabled } from "@/lib/supabase/env";
import { getSessionUser } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
/** Name/email of the signed-in visitor (used to pre-fill forms). Nothing is returned for guests. */
export async function GET() {
  const u = await getSessionUser();
  return NextResponse.json(u ? { signedIn: true, authEnabled, email: u.email ?? "", name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || "" } : { signedIn: false, authEnabled }, { headers: { "Cache-Control": "no-store" } });
}
