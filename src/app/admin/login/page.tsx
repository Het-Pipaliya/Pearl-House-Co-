import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { cfg } from "@/lib/config";
import { authEnabled, isAdminEmail } from "@/lib/supabase/env";
import { getSessionUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Login() {
  const user = await getSessionUser();
  if (user && isAdminEmail(user.email)) redirect("/admin");
  const google = authEnabled && !!(process.env.ADMIN_EMAILS || "").trim();
  const password = !!(cfg.adminPassword && cfg.sessionSecret.length >= 16);
  return <AdminLoginForm google={google} password={password} notAdminEmail={user?.email ?? undefined} />;
}
