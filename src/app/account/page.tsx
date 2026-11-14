import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getInquiriesForUser } from "@/lib/db";
import { getSessionUser } from "@/lib/supabase/server";
import NextSteps from "@/components/NextSteps";
import AccountSignOut from "@/components/AccountSignOut";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My inquiries", robots: { index: false } };

export default async function Account() {
  const user = await getSessionUser();
  if (!user) redirect("/signin?next=/account");
  let list: Inquiry[] = []; let failed = false;
  try { list = await getInquiriesForUser(user.id); } catch { failed = true; }
  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email;
  return (
    <div className="container-x py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">My account</p><h1 className="mt-3 text-5xl">My inquiries</h1>
        <p className="mt-3 text-cocoa/70">Signed in as {name} · <AccountSignOut /></p>
      </header>
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {failed && <p role="alert" className="border border-rose/40 bg-blush/50 p-4 text-sm">We couldn&apos;t load your inquiries just now. Please try again in a moment.</p>}
        {!failed && list.length === 0 && (
          <div className="border border-blush bg-white p-10 text-center"><p className="text-cocoa/75">You haven&apos;t sent an inquiry while signed in yet.</p><Link href="/shop" className="btn mt-6">Browse jewelry</Link></div>
        )}
        {list.map((i) => (
          <article key={i.id} className="border border-blush bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-serif text-2xl tracking-wide text-rose">{i.id}</p><p className="text-xs uppercase tracking-widest text-cocoa/50">{i.type === "custom" ? "Custom design request" : "Order request"} · {new Date(i.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
              <span className={`px-3 py-1 text-xs ${i.status === "New Inquiry" ? "bg-rose text-white" : "bg-champagne"}`}>{i.status}</span>
            </div>
            {i.items.length > 0 && <ul className="mt-4 space-y-1 text-sm text-cocoa/85">{i.items.map((it, n) => <li key={n}>{it.name} × {it.quantity}<span className="text-cocoa/55">{[it.size && ` · size ${it.size}`, it.gemstone && ` · ${it.gemstone}`].filter(Boolean).join("")}</span></li>)}</ul>}
            {i.custom && <p className="mt-4 text-sm text-cocoa/85"><strong className="font-medium">{i.custom.jewelryType}</strong> — {i.custom.description.length > 160 ? i.custom.description.slice(0, 160) + "…" : i.custom.description}</p>}
          </article>
        ))}
        <NextSteps hasNumber={false} className="!mt-8" />
      </div>
    </div>
  );
}
