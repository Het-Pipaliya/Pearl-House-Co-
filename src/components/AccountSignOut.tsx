"use client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/client";
export default function AccountSignOut() {
  const router = useRouter();
  return <button onClick={async () => { await signOut(); router.push("/"); router.refresh(); }} className="text-rose underline underline-offset-2">Sign out</button>;
}
