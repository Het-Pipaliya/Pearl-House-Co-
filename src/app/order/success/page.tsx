import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Request Received", robots: { index: false } };

export default function Success({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = /^PH-\d{6}-[A-Z0-9]{5}$/.test(searchParams.ref ?? "") ? searchParams.ref : null;
  return (
    <div className="container-x py-24 text-center">
      <p className="eyebrow">Request Received</p>
      <h1 className="mt-4 text-5xl">Thank you for choosing Pearl House &amp; Co!</h1>
      {ref && <p className="mx-auto mt-8 inline-block border border-rose/40 bg-white px-8 py-4">Your inquiry number<br /><span className="font-serif text-3xl tracking-widest text-rose">{ref}</span></p>}
      <div className="mx-auto mt-8 max-w-xl space-y-4 text-cocoa/80">
        <p>Your order request has been successfully received.</p>
        <p>Our team will review your selected jewelry and contact you to confirm availability, customization options, final pricing, and next steps.</p>
        <p>Please note that submitting an order request does not confirm a purchase or require payment.</p>
        <p>We look forward to helping you find something extraordinary.</p>
      </div>
      <Link href="/shop" className="btn mt-10">Continue Browsing</Link>
    </div>
  );
}
