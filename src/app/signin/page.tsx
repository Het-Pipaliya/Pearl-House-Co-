import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import { authEnabled } from "@/lib/supabase/env";
import { getSessionUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function SignIn({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = searchParams.next && searchParams.next.startsWith("/") && !searchParams.next.startsWith("//") ? searchParams.next : "/account";
  if (await getSessionUser()) redirect(next);
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm border border-blush bg-white p-8 text-center">
        <p className="eyebrow">Pearl House &amp; Co</p>
        <h1 className="mt-3 text-4xl">Sign in</h1>
        <p className="mt-3 text-sm text-cocoa/70">Sign in to see your inquiries and their status. You can also send a request without an account.</p>
        <div className="mt-7">
          {authEnabled ? <GoogleButton next={next} /> : <p className="border border-blush bg-ivory p-4 text-sm text-cocoa/70">Sign-in isn&apos;t available just yet. You can still send an order request without an account.</p>}
        </div>
        {searchParams.error && <p role="alert" className="mt-4 text-sm text-rose-dark">We couldn&apos;t complete the sign-in. Please try again.</p>}
        <p className="mt-6 text-xs text-cocoa/55">We only receive your name and email from Google. See our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </div>
    </div>
  );
}
