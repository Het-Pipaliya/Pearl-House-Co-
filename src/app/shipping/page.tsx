import type { Metadata } from "next";
import Prose from "@/components/Prose";
export const metadata: Metadata = { title: "Shipping Information" };
export default function S() { return (
  <Prose title="Shipping Information">
    <h2>How shipping works</h2><p>After your request is reviewed and confirmed with you, your piece is produced by our manufacturing partner and then shipped to your delivery address. Shipping options, costs, insurance and timing are discussed and agreed with you before your order is placed.</p>
    <h2>Delivery times</h2><p>Production and delivery times vary by piece, customization and destination. We will provide an estimate during confirmation — please note that estimates are not guaranteed.</p>
    <h2>International orders</h2><p>We aim to serve clients internationally. Duties, taxes and import rules depend on your country and are discussed during confirmation.</p>
    <h2>Returns &amp; resizing</h2><p>[Add your returns and resizing terms here.]</p>
  </Prose>); }
