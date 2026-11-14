import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifyToken } from "@/lib/auth";
import { SB_KEY, SB_URL, authEnabled, isAdminEmail } from "@/lib/supabase/env";

/**
 * Guards admin pages/APIs and keeps the Google session fresh.
 * Admin access = a signed-in Google account listed in ADMIN_EMAILS, or (optional fallback) the password cookie.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next({ request: req });
  let email: string | null = null;

  if (authEnabled) {
    try {
      const supabase = createServerClient(SB_URL, SB_KEY, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (list) => { list.forEach(({ name, value }) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
        },
      });
      const { data } = await supabase.auth.getUser(); email = data.user?.email ?? null;
    } catch { /* Supabase unreachable: treat as signed out */ }
  }

  if (pathname === "/account") {
    if (email) return res;
    const url = req.nextUrl.clone(); url.pathname = "/signin"; url.search = "?next=/account"; return NextResponse.redirect(url);
  }

  // admin area
  if (pathname === "/admin/login" || pathname === "/api/admin/login") return res;
  const passwordOk = await verifyToken(req.cookies.get(COOKIE)?.value, process.env.ADMIN_SESSION_SECRET || "");
  if (passwordOk || isAdminEmail(email)) return res;
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone(); url.pathname = "/admin/login"; url.search = ""; return NextResponse.redirect(url);
}
export const config = { matcher: ["/account", "/admin/:path*", "/api/admin/:path*"] };
