// Public (browser-safe) Supabase settings. The publishable key is designed to be public; tables are locked down with RLS.
export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
/** Sign-in is only offered when Supabase is configured. */
export const authEnabled = !!(SB_URL && SB_KEY);

/** Admin = a signed-in Google account listed in ADMIN_EMAILS (comma-separated). */
export const isAdminEmail = (email?: string | null) =>
  !!email && (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
