import type { Metadata } from "next";
import Prose from "@/components/Prose";
export const metadata: Metadata = { title: "Terms & Conditions" };
export default function T() { return (
  <Prose title="Terms &amp; Conditions" intro="Last updated: [date]">
    <h2>Inquiry-based ordering</h2><p>Pearl House &amp; Co operates an inquiry-based ordering process. Submitting an order request is not a purchase and does not create a binding contract. No payment is taken through this website.</p>
    <h2>Availability &amp; confirmation</h2><p>All orders are subject to availability and final confirmation by our team. Prices, where displayed, are indicative; final pricing, timing and payment arrangements are agreed with you before any order is placed.</p>
    <h2>Manufacturing partners</h2><p>Jewelry is produced to order by independent manufacturing partners we work with. Images on this website are illustrative, and individual pieces may vary slightly.</p>
    <h2>Use of the website</h2><p>You agree to provide accurate information and not to misuse the website, including attempting to disrupt it or submit automated or fraudulent requests.</p>
    <h2>Intellectual property</h2><p>Content on this website, including the Pearl House &amp; Co name and logo, belongs to us or its licensors and may not be reused without permission.</p>
    <h2>Limitation of liability</h2><p>To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of this website.</p>
  </Prose>); }
