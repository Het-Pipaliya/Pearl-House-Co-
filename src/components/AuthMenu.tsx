"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { authEnabled } from "@/lib/supabase/env";
import { signOut, supabaseBrowser } from "@/lib/supabase/client";

const UserIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" /></svg>;

/** Header sign-in / account menu. Renders nothing until Supabase sign-in is configured. */
export default function AuthMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authEnabled) return;
    const sb = supabaseBrowser();
    const apply = (u: User | null | undefined) => {
      setEmail(u?.email ?? null); setName(String(u?.user_metadata?.full_name ?? u?.user_metadata?.name ?? "")); setReady(true);
    };
    sb.auth.getUser().then(({ data }: { data: { user: User | null } }) => apply(data.user)).catch(() => setReady(true));
    const { data: sub } = sb.auth.onAuthStateChange((_e: string, session: Session | null) => apply(session?.user));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);

  if (!authEnabled || !ready) return null;
  if (!email) return <Link href="/signin" className="flex items-center gap-1.5 p-2 text-[11px] uppercase tracking-[0.16em] hover:text-rose" aria-label="Sign in"><UserIcon /><span className="hidden lg:inline">Sign in</span></Link>;

  const initial = (name || email)[0].toUpperCase();
  return (
    <div ref={box} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label="Account menu" className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-sm text-white hover:bg-rose-dark">{initial}</button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-60 border border-blush bg-white p-2 shadow-[0_18px_40px_-18px_rgba(73,48,43,0.4)]">
          <p className="truncate px-3 py-2 text-xs text-cocoa/60">{email}</p>
          <Link role="menuitem" href="/account" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm hover:bg-blush/40">My inquiries</Link>
          <button role="menuitem" onClick={async () => { await signOut(); setOpen(false); router.push("/"); router.refresh(); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-blush/40">Sign out</button>
        </div>
      )}
    </div>
  );
}
