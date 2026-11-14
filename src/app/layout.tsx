import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/siteUrl";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "Choose from our collection or share your own design. Pearl House & Co creates fine jewelry just the way you want it — submit an order request, no online payment required.",
  openGraph: { title: `${SITE.name} — ${SITE.tagline}`, type: "website", siteName: SITE.name },
};

const TICKER = ["Custom jewelry — we can make it anything you want", "Your idea, your design, your jewelry", "Engagement rings · Wedding bands · Pendants · Earrings · Bracelets", "Share a sketch, a photo or just a feeling", "Personalized fine jewelry made for your moments"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <ScrollEffects />
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
          <div className="ticker" role="region" aria-label="Announcement">
            <div className="ticker-track">
              {[0, 1].map((k) => (
                <ul key={k} className="ticker-set" aria-hidden={k === 1 ? true : undefined}>
                  {TICKER.map((t) => <li key={t}>{t}</li>)}
                </ul>
              ))}
            </div>
          </div>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
