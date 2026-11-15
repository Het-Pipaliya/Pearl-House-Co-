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
const client = () => (sb ??= createClient(cfg.supabaseUrl, cfg.supabaseKey, {
  auth: { persistSession: false },
  // Next.js caches fetch() responses by default; database reads must always be live.
  global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
}));

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
/** Removes the old "sample collection / sample product" wording from descriptions already stored in the database. */
const tidy = <T extends Product>(p: T): T => ({
  ...p,
  description: p.description
    .replace(/ from our sample collection\./, " from our collection.")
    .replace(/\s*Sample (product|entry) shown for demonstration\./g, "")
    .trim(),
});

let lastSeedTry = 0;
/** Puts the sample catalogue into an empty products table: ONE request (not 114). Throws if the database refuses. */
async function seedCatalogue() {
  if (usingSupabase()) {
    const { error } = await client().from("products").upsert(
      SEED_PRODUCTS.map((p) => ({ id: p.id, data: p, created_at: p.createdAt })), { onConflict: "id", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    return;
  }
  for (const s of SEED_PRODUCTS) await insertNew("products", s as Product & Row);
}

let lastSync = 0;
const SEED_ID = /^PH-[A-Z]{3}-\d{3}$/;
/**
 * Keeps the built-in catalogue in step with the database after the catalogue changes in code (e.g. new photos):
 *  - built-in products still marked as placeholders whose photo changed are replaced; ones that no longer exist are removed;
 *  - when anything changed, built-in products missing from the database are added.
 * Products you edited with a real photo in /admin (placeholder switched off) or created yourself are never touched.
 */
async function syncCatalogue(rows: (Product & Row)[]): Promise<boolean> {
  const seedById = new Map(SEED_PRODUCTS.map((p) => [p.id, p]));
  const replace: Product[] = [], drop: string[] = [];
  for (const r of rows) {
    if (!SEED_ID.test(r.id) || !r.placeholder) continue;
    const sp = seedById.get(r.id);
    if (!sp) drop.push(r.id);
    else if (sp.images[0] !== r.images[0] || sp.name !== r.name) replace.push(sp);
  }
  if (!replace.length && !drop.length) return false;
  const have = new Set(rows.map((r) => r.id));
  const add = SEED_PRODUCTS.filter((p) => !have.has(p.id));
  const upserts = [...replace, ...add].map((p) => ({ id: p.id, data: p, created_at: p.createdAt }));
  if (usingSupabase()) {
    if (drop.length) { const { error } = await client().from("products").delete().in("id", drop); if (error) throw new Error(error.message); }
    if (upserts.length) { const { error } = await client().from("products").upsert(upserts, { onConflict: "id" }); if (error) throw new Error(error.message); }
  } else {
    for (const id of drop) await remove("products", id);
    for (const p of [...replace, ...add]) await put("products", p as Product & Row);
  }
  return true;
}

/**
 * The shop must never be empty or crash because of the database:
 *  - products are read from the database;
 *  - if it is empty, the sample catalogue is loaded into it (retried at most once a minute);
 *  - if the database cannot be read or written, the built-in sample catalogue is shown instead (and the problem is logged).
 */
export async function getProducts(): Promise<Product[]> {
  let rows: (Product & Row)[] = [];
  let readable = true;
  try { rows = await list<Product & Row>("products"); } catch (e) { readable = false; console.error("products: database read failed —", (e as Error).message); }
  if (readable && !rows.length && Date.now() - lastSeedTry > 60_000) {
    lastSeedTry = Date.now();
    try { await seedCatalogue(); rows = await list<Product & Row>("products"); } catch (e) { console.error("products: seeding failed —", (e as Error).message); }
  }
  if (readable && rows.length && Date.now() - lastSync > 60_000) {
    lastSync = Date.now();
    try { if (await syncCatalogue(rows)) rows = await list<Product & Row>("products"); } catch (e) { console.error("products: catalogue sync failed —", (e as Error).message); }
  }
  if (!rows.length) rows = SEED_PRODUCTS as (Product & Row)[];
  rows = rows.map(tidy);
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name));
}

/** Setup check (no secrets): can the server read and write the database? */
export async function databaseStatus() {
  if (!usingSupabase()) return { mode: "local-file/none", read: "n/a", write: "n/a" };
  const out: { mode: string; read: string; write: string; products?: number; catalogue?: object } = { mode: "supabase", read: "ok", write: "ok" };
  try { const { data, error } = await client().from("products").select("id").limit(1000); if (error) throw new Error(error.message); out.products = data?.length ?? 0;
    const all = await list<Product & Row>("products"); const seed = new Map(SEED_PRODUCTS.map((p) => [p.id, p.images[0]]));
    out.catalogue = { rows: all.length, matchingBuiltIn: all.filter((r) => seed.get(r.id) === r.images?.[0]).length, builtIn: SEED_PRODUCTS.length }; } catch (e) { out.read = "error: " + (e as Error).message.slice(0, 160); }
  try {
    const t = { id: "__health__", createdAt: new Date().toISOString() };
    const { error } = await client().from("messages").upsert({ id: t.id, data: t, created_at: t.createdAt }); if (error) throw new Error(error.message);
    await client().from("messages").delete().eq("id", t.id);
  } catch (e) { out.write = "error: " + (e as Error).message.slice(0, 160); }
  return out;
}
export const getProduct = async (id: string) => { const r = (await get<Product & Row>("products", id).catch(() => null)) ?? (SEED_PRODUCTS.find((p) => p.id === id) as (Product & Row) | undefined) ?? null; return r && tidy(r); };
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
/** A signed-in customer's own requests (newest first). */
export async function getInquiriesForUser(userId: string): Promise<Inquiry[]> {
  if (usingSupabase()) {
    const { data, error } = await client().from("inquiries").select("data").eq("data->>userId", userId).order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.data as Inquiry);
  }
  return (await getInquiries()).filter((i) => i.userId === userId);
}
export const getInquiry = (id: string) => get<Inquiry & Row>("inquiries", id);
export const saveInquiry = (i: Inquiry) => put("inquiries", i as unknown as Row);

/* ---------- contact messages ---------- */
export const saveMessage = (m: ContactMessage) => put("messages", m as unknown as Row);
export const getMessages = async () => (await list<ContactMessage & Row>("messages")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
