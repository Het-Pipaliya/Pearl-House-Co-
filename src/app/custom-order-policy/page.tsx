import type { Metadata } from "next";
import Prose from "@/components/Prose";
export const metadata: Metadata = { title: "Custom Order Policy" };
export default function C() { return (
  <Prose title="Custom Order Policy">
    <h2>Review &amp; quotation</h2><p>Custom requests are reviewed by our team. We will contact you to discuss the design, materials, pricing and timeline. A request is not a commitment from either side.</p>
    <h2>Confirmation</h2><p>Production begins only after you and our team have agreed the final design, price and payment arrangements.</p>
    <h2>Made to order</h2><p>Custom and personalized pieces are made specifically for you and may not be eligible for return or exchange. [Confirm and complete with your own terms.]</p>
    <h2>Design approvals</h2><p>Where possible we share design details for your approval before production. Small variations are natural in handmade and made-to-order jewelry.</p>
  </Prose>); }
