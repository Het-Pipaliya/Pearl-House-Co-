import type { Metadata } from "next";
import Prose from "@/components/Prose";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function P() { return (
  <Prose title="Privacy Policy" intro="Last updated: [date]">
    <p>Pearl House &amp; Co (“we”) respects your privacy. This policy explains what we collect when you use this website and why.</p>
    <h2>Information we collect</h2><p>When you submit an order request, custom design request or contact message, we collect the details you provide: name, email, phone, shipping location, preferred contact method, selected products, customization notes and any reference images you upload.</p>
    <h2>How we use it</h2><p>We use your information only to respond to your request, confirm availability and pricing, arrange production with our manufacturing partners, and ship your order. We send you an acknowledgment email when you submit a request.</p>
    <h2>Sharing</h2><p>To fulfil your order we may share the details needed to make and deliver your jewelry with our manufacturing and shipping partners. We do not sell your personal information.</p>
    <h2>Payment information</h2><p>This website does not collect or process payment card details. Payment arrangements are discussed directly with our team.</p>
    <h2>Storage &amp; security</h2><p>Requests are stored in a secured database accessible only to authorized administrators. No method of transmission or storage is perfectly secure.</p>
    <h2>Your choices</h2><p>You may ask us to access, correct or delete your information by contacting us. Your cart and wishlist are stored in your own browser and are never sent to us until you submit a request.</p>
    <h2>Contact</h2><p>Questions about this policy? Please use our contact page.</p>
  </Prose>); }
