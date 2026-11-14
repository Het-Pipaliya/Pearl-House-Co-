// Server-side config. Never import this file from client components.
export const cfg = {
  businessEmail: process.env.BUSINESS_EMAIL || "",
  fromEmail: process.env.EMAIL_FROM || "Pearl House & Co <onboarding@resend.dev>",
  resendKey: process.env.RESEND_API_KEY || "",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  sessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
export const usingSupabase = () => !!(cfg.supabaseUrl && cfg.supabaseKey);
