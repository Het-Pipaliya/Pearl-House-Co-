"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleButton from "./GoogleButton";
import Logo from "./Logo";

export default function AdminLoginForm({ google, password, notAdminEmail }: { google: boolean; password: boolean; notAdminEmail?: string }) {
  const router = useRouter();
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { router.push("/admin"); router.refresh(); } else setErr((await r.json().catch(() => ({}))).error ?? "Login failed."); setBusy(false);
  };
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm border border-blush bg-white p-8 text-center">
        <div className="flex justify-center"><Logo className="h-12" /></div>
        <h1 className="mt-4 text-2xl">Admin sign in</h1>
        {notAdminEmail && <p role="alert" className="mt-4 border border-rose/40 bg-blush/50 p-3 text-sm text-rose-dark">{notAdminEmail} is not an admin account. Sign in with the business Google account.</p>}
        {google && <div className="mt-6"><GoogleButton next="/admin" label="Sign in with Google" /></div>}
        {google && password && <p className="my-5 text-xs uppercase tracking-widest text-cocoa/40">or</p>}
        {password && (
          <form onSubmit={go} className={google ? "" : "mt-6"}>
            <label htmlFor="pw" className="label text-left">Password</label>
            <input id="pw" type="password" autoComplete="current-password" required className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
            {err && <p role="alert" className="mt-3 text-sm text-rose-dark">{err}</p>}
            <button className="btn mt-5 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
        )}
        {!google && !password && <p className="mt-6 text-sm text-cocoa/70">Admin sign-in is not configured. Set ADMIN_EMAILS (with Google sign-in) or ADMIN_PASSWORD in your environment.</p>}
      </div>
    </div>
  );
}
