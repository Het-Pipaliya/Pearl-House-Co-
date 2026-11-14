"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContactMessage, Inquiry, Product } from "@/lib/types";
import Inquiries from "./Inquiries";
import Products from "./Products";

export interface Setup { database: string; email: boolean; emailDetail: string }

export default function AdminDashboard({ inquiries, products, messages, setup }: { inquiries: Inquiry[]; products: Product[]; messages: ContactMessage[]; setup: Setup }) {
  const router = useRouter();
  const [tab, setTab] = useState<"inquiries" | "products" | "messages">("inquiries");
  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); };
  const tabBtn = (t: typeof tab, label: string) => <button onClick={() => setTab(t)} aria-pressed={tab === t} className={`px-5 py-2.5 text-xs uppercase tracking-[0.16em] ${tab === t ? "bg-rose text-white" : "border border-blush bg-white hover:border-rose"}`}>{label}</button>;
  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-4xl">Admin Dashboard</h1><button onClick={logout} className="btn-outline !py-2.5">Sign out</button></div>
      <div className="mt-5 space-y-2 text-sm">
        <p className="border border-blush bg-white p-3"><strong>Database:</strong> {setup.database}</p>
        {!setup.email && <p role="alert" className="border border-rose/50 bg-blush/60 p-3"><strong>Email is not connected</strong> ({setup.emailDetail}). Inquiries are saved here, but no notification or customer acknowledgment emails are being sent. See README → “Email setup”.</p>}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">{tabBtn("inquiries", `Inquiries (${inquiries.length})`)}{tabBtn("products", `Products (${products.length})`)}{tabBtn("messages", `Messages (${messages.length})`)}</div>
      <div className="mt-8">
        {tab === "inquiries" && <Inquiries initial={inquiries} />}
        {tab === "products" && <Products initial={products} />}
        {tab === "messages" && (messages.length === 0 ? <p className="text-cocoa/60">No messages yet.</p> : <ul className="space-y-4">{messages.map((m) => <li key={m.id} className="border border-blush bg-white p-5"><p className="text-xs text-cocoa/50">{new Date(m.createdAt).toLocaleString()}</p><p className="mt-1"><strong>{m.name}</strong> · <a className="text-rose underline" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && ` · ${m.phone}`}</p><p className="mt-2 whitespace-pre-wrap text-cocoa/80">{m.message}</p></li>)}</ul>)}
      </div>
    </div>
  );
}
