import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getInquiries, getMessages, getProducts } from "@/lib/db";
import { cfg, usingSupabase } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function Admin() {
  const [inquiries, products, messages] = await Promise.all([getInquiries(), getProducts(), getMessages()]);
  const setup = {
    database: usingSupabase() ? "Supabase" : "Local JSON file (development only — NOT for production)",
    email: !!cfg.resendKey && !!cfg.businessEmail,
    emailDetail: !cfg.resendKey ? "RESEND_API_KEY is not set" : !cfg.businessEmail ? "BUSINESS_EMAIL is not set" : "",
  };
  return <AdminDashboard inquiries={inquiries} products={products} messages={messages} setup={setup} />;
}
