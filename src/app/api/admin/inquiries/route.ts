import { NextResponse } from "next/server";
import { getInquiries } from "@/lib/db";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";
// Prefixing risky leading characters stops spreadsheet formula injection from customer-supplied text.
const cell = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
const itemText = (i: Inquiry) => i.items.map((it) => `${it.name} (${it.productId}) x${it.quantity}${[it.size && ` size ${it.size}`, it.metal && ` ${it.metal}`, it.gemstone && ` ${it.gemstone}`, it.customization && ` custom: ${it.customization}`].filter(Boolean).join(";")}`).join(" | ");

export async function GET(req: Request) {
  const all = await getInquiries();
  if (new URL(req.url).searchParams.get("format") !== "csv") return NextResponse.json({ inquiries: all });
  const head = ["Reference", "Type", "Status", "Submitted (UTC)", "Name", "Email", "Phone", "Contact method", "City", "State", "Country", "Items", "Custom request", "Instructions", "Notes", "Admin notes"];
  const rows = all.map((i) => [i.id, i.type, i.status, i.createdAt, i.customer.name, i.customer.email, i.customer.phone, i.customer.contactMethod, i.customer.city, i.customer.state, i.customer.country, itemText(i),
    i.custom ? `${i.custom.jewelryType}; ${i.custom.metal ?? ""}; ${i.custom.gemstone ?? ""}; budget ${i.custom.budget ?? ""}; ${i.custom.description}` : "", i.instructions, i.notes, i.adminNotes]);
  const csv = [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="pearl-house-inquiries-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
