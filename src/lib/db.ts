import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cfg, usingSupabase } from "./config";
import { SEED_PRODUCTS } from "./seed";
import type { ContactMessage, Inquiry, Product } from "./types";

type Table = "products" | "inquiries" | "messages";
type Row = { id: string; createdAt: string; [k: string]: unknown };

/* ---------- backend: Supabase (production) or local JSON file (development only) ---------- */
let sb: SupabaseClient | null = null;
const client = () => (sb ??= createClient(cfg.supabaseUrl, cfg.supabaseKey, { auth: { persistSession: false } }));

const FILE = path.join(process.cwd(), ".data", "db.json");
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>) => (queue = queue.then(fn, fn)) as Promise<T>;
async function readFile(): Promise<Record<Table, Record<string, Row>>> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); } catch { return { products: {}, inquiries: {}, messages: {} }; }
}
async function writeFile(d: unknown) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(d, null, 2));
}

async function list<T extends Row>(t: Table): Promise<T[]> {
  if (usingSupabase()) {
    const { data, error } = await client().from(t).select("data").order("created_at", { ascending: false }).limit(5000);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.data as T);
  }
  return Object.values((await readFile())[t] ?? {}) as T[];
}
async function get<T extends Row>(t: Table, id: string): Promise<T | null> {
  if (usingSupabase()) {
    const { data, error } = await client().from(t).select("data").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.data as T) ?? null;
  }
  return ((await readFile())[t]?.[id] as T) ?? null;
}
/** Insert-or-replace. */
async function put(t: Table, row: Row) {
  if (usingSupabase()) {
    const { error } = await client().from(t).upsert({ id: row.id, data: row, created_at: row.createdAt });
    if (error) throw new Error(error.message);
    return;
  }
  await serial(async () => { const d = await readFile(); (d[t] ??= {})[row.id] = row; await writeFile(d); });
}
/** Insert only; returns false when the id already exists. */
async function insertNew(t: Table, row: Row): Promise<boolean> {
  if (usingSupabase()) {
    const { error } = await client().from(t).insert({ id: row.id, data: row, created_at: row.createdAt });
    if (error) { if (error.code === "23505") return false; throw new Error(error.message); }
    return true;
  }
  return serial(async () => {
    const d = await readFile(); d[t] ??= {};
    if (d[t][row.id]) return false;
    d[t][row.id] = row; await writeFile(d); return true;
  });
}
async function remove(t: Table, id: string) {
  if (usingSupabase()) { const { error } = await client().from(t).delete().eq("id", id); if (error) throw new Error(error.message); return; }
  await serial(async () => { const d = await readFile(); delete d[t]?.[id]; await writeFile(d); });
}

/* ---------- products ---------- */
let seeded = false;
export async function getProducts(): Promise<Product[]> {
  let rows: (Product & Row)[] = [];
  try { rows = await list<Product & Row>("products"); } catch (e) { if (usingSupabase()) throw e; }
  if (!rows.length && !seeded) {
    seeded = true; // sample catalogue is inserted once so it can be edited in the admin
    try {
      for (const s of SEED_PRODUCTS) await insertNew("products", s as Product & Row);
      rows = await list<Product & Row>("products");
    } catch (e) { if (usingSupabase()) throw e; seeded = false; }
  }
  // No database connected (e.g. hosting without a writable disk): show the read-only sample catalogue.
  if (!rows.length && !usingSupabase()) rows = SEED_PRODUCTS as (Product & Row)[];
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name));
}
export const getProduct = (id: string) => get<Product & Row>("products", id);
export async function getProductBySlug(slug: string) { return (await getProducts()).find((p) => p.slug === slug) ?? null; }
export const saveProduct = (p: Product) => put("products", p as Product & Row);
export const createProduct = (p: Product) => insertNew("products", p as Product & Row);
export const deleteProduct = (id: string) => remove("products", id);

/* ---------- inquiries ---------- */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newReference(date = new Date()) {
  const d = date.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `PH-${d}-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}
/** Saves a new inquiry with a unique reference number. Throws if it cannot be saved. */
export async function createInquiry(build: (id: string) => Inquiry): Promise<Inquiry> {
  for (let i = 0; i < 5; i++) {
    const inq = build(newReference());
    if (await insertNew("inquiries", inq as unknown as Row)) return inq;
  }
  throw new Error("Could not allocate a unique reference number");
}
/** Like createInquiry, but never throws: if storage is unavailable the inquiry is returned with notStored=true so it can still be emailed. */
export async function createInquiryResilient(build: (id: string) => Inquiry): Promise<{ inquiry: Inquiry; stored: boolean }> {
  try { return { inquiry: await createInquiry(build), stored: true }; }
  catch (e) {
    console.error("inquiry could not be stored; falling back to email only", e);
    return { inquiry: { ...build(newReference()), notStored: true }, stored: false };
  }
}
export const getInquiries = async () => (await list<Inquiry & Row>("inquiries")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const getInquiry = (id: string) => get<Inquiry & Row>("inquiries", id);
export const saveInquiry = (i: Inquiry) => put("inquiries", i as unknown as Row);

/* ---------- contact messages ---------- */
export const saveMessage = (m: ContactMessage) => put("messages", m as unknown as Row);
export const getMessages = async () => (await list<ContactMessage & Row>("messages")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
