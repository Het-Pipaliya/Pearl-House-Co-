import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SB_KEY, SB_URL, authEnabled } from "./env";

/** Supabase client bound to the visitor's session cookies (server components and route handlers). */
export function supabaseServer() {
  const store = cookies();
  return createServerClient(SB_URL, SB_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a server component: middleware refreshes the session */ } },
    },
  });
}

/** The signed-in visitor, or null (also null when sign-in is not configured or Supabase is unreachable). */
export async function getSessionUser() {
  if (!authEnabled) return null;
  try { const { data } = await supabaseServer().auth.getUser(); return data.user ?? null; } catch { return null; }
}
