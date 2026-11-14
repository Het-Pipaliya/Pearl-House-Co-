"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { router.push("/admin"); router.refresh(); } else setErr((await r.json().catch(() => ({}))).error ?? "Login failed."); setBusy(false);
  };
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={go} className="w-full max-w-sm border border-blush bg-white p-8 text-center">
        <div className="flex justify-center"><Logo className="h-12" /></div>
        <h1 className="mt-4 text-2xl">Admin Sign In</h1>
        <label htmlFor="pw" className="label mt-6 text-left">Password</label>
        <input id="pw" type="password" autoComplete="current-password" required className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p role="alert" className="mt-3 text-sm text-rose-dark">{err}</p>}
        <button className="btn mt-6 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
      </form>
    </div>
  );
}
