import { NextResponse } from "next/server";
import { COOKIE, SESSION_TTL, makeToken, passwordMatches } from "@/lib/auth";
import { cfg } from "@/lib/config";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!cfg.adminPassword || cfg.sessionSecret.length < 16)
    return NextResponse.json({ error: "Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (16+ chars) in your environment." }, { status: 503 });
  if (!rateLimit(`login:${clientIp(req)}`, 6, 15 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!(await passwordMatches(String(password ?? ""), cfg.adminPassword))) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await makeToken(cfg.sessionSecret), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL });
  return res;
}
