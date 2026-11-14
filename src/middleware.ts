import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifyToken } from "@/lib/auth";

// Guards every admin page and admin API route. Public login endpoints are exempt.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") return NextResponse.next();
  const ok = await verifyToken(req.cookies.get(COOKIE)?.value, process.env.ADMIN_SESSION_SECRET || "");
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone(); url.pathname = "/admin/login"; url.search = "";
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
