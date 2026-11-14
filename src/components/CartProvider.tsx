"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";

type NewLine = Omit<CartLine, "key">;
interface Ctx {
  lines: CartLine[]; count: number; wishlist: string[]; ready: boolean;
  add(l: NewLine): void; remove(key: string): void; setQty(key: string, q: number): void; setNote(key: string, note: string): void; clear(): void;
  toggleWish(id: string): void;
}
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => { const c = useContext(CartCtx); if (!c) throw new Error("useCart outside provider"); return c; };

// Same product with different options = different line.
const keyOf = (l: NewLine) => [l.productId, l.size ?? "", l.metal ?? "", l.gemstone ?? "", (l.customization ?? "").trim()].join("|");
const read = <T,>(k: string, fallback: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { setLines(read("ph_cart", [])); setWishlist(read("ph_wish", [])); setReady(true); }, []);
  useEffect(() => { if (ready) write("ph_cart", lines); }, [lines, ready]);
  useEffect(() => { if (ready) write("ph_wish", wishlist); }, [wishlist, ready]);
  // keep tabs in sync
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === "ph_cart") setLines(read("ph_cart", [])); if (e.key === "ph_wish") setWishlist(read("ph_wish", [])); };
    window.addEventListener("storage", on); return () => window.removeEventListener("storage", on);
  }, []);

  const add = useCallback((l: NewLine) => setLines((cur) => {
    const key = keyOf(l); const hit = cur.find((x) => x.key === key);
    return hit ? cur.map((x) => (x.key === key ? { ...x, quantity: Math.min(20, x.quantity + l.quantity) } : x)) : [...cur, { ...l, key }];
  }), []);
  const remove = useCallback((key: string) => setLines((c) => c.filter((x) => x.key !== key)), []);
  const setQty = useCallback((key: string, q: number) => setLines((c) => c.map((x) => (x.key === key ? { ...x, quantity: Math.max(1, Math.min(20, q)) } : x))), []);
  const setNote = useCallback((key: string, note: string) => setLines((c) => c.map((x) => (x.key === key ? { ...x, customization: note } : x))), []);
  const clear = useCallback(() => setLines([]), []);
  const toggleWish = useCallback((id: string) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), []);

  const value = useMemo<Ctx>(() => ({ lines, count: lines.reduce((n, l) => n + l.quantity, 0), wishlist, ready, add, remove, setQty, setNote, clear, toggleWish }), [lines, wishlist, ready, add, remove, setQty, setNote, clear, toggleWish]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
