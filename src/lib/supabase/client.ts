"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SB_KEY, SB_URL } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;
export const supabaseBrowser = () => (client ??= createBrowserClient(SB_URL, SB_KEY));

/** Starts Google sign-in; the visitor comes back to /auth/callback, then to `next`. */
export async function signInWithGoogle(next = "/account") {
  return supabaseBrowser().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
}
export async function signOut() { await supabaseBrowser().auth.signOut(); }
