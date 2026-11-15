// Regenerates src/lib/seed.ts from scripts/catalog.json (written by scripts/prepare-images.py).
// Run: node scripts/make-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";
const { products: items } = JSON.parse(readFileSync("scripts/catalog.json", "utf8"));
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CODE = { "Engagement Rings": "ENG", Rings: "RNG", "Wedding Bands": "WED", Necklaces: "NCK", Pendants: "PND", Earrings: "EAR", Bracelets: "BRC" };
const NO_STONE = new Set(["Brushed Gold Band","Classic Gold Band","Satin Gold Band","Hammered Gold Band","Two-Tone Brushed Band","Brushed Platinum Band","Two-Tone Braided Band","Black Brushed Mens Band","Hammered Yellow Gold Band","Hammered Gold Wedding Band","Hammered Yellow Gold Wedding Band","Black Brushed Silver Stripe Band","Brushed Platinum Classic Band","Golden Chevron Engraved Band","Black Silver Stripe Band","Rose Gold Braided Heritage Band","Classic Brushed Band Worn","Tri-Colour Stack","Ribbed Gold Collar","Layered Chain Necklace","Gold Huggie Hoops","Paperclip Chain Bracelet","Rope Chain Bracelet"]);
const COLOURED = [["Sapphire", "Blue Sapphire"], ["Ruby", "Ruby"], ["Emerald", "Emerald"], ["Pink Gemstone", "Pink Sapphire"]];
const stone = (n) => {
  if (NO_STONE.has(n)) return { gemstone: "None", opts: [] };
  if (/Multi-Gemstone/.test(n)) return { gemstone: "Mixed coloured gemstones (configurable)", opts: ["Mixed Gemstones"] };
  if (/Clover/.test(n)) return { gemstone: "Mother-of-pearl motifs", opts: [] };
  const c = !/Emerald-Cut/.test(n) && COLOURED.find(([k]) => n.includes(k));
  if (c) return { gemstone: `${c[1]} with diamond accents (configurable)`, opts: [c[1], `Lab-Created ${c[1]}`] };
  if (/Pearl/.test(n)) return { gemstone: "Cultured pearl", opts: ["Cultured Pearl"] };
  return { gemstone: "Diamond or lab-grown diamond (configurable)", opts: ["Natural Diamond", "Lab-Grown Diamond", "Moissanite"] };
};
const RING_SIZES = ["4","5","6","7","8","9","10"];
const sizes = (cat, n) => cat === "Earrings" ? [] : cat === "Bracelets" ? (/Bangle|Cuff/.test(n) ? ["Small","Medium","Large"] : ['6.5"','7"','7.5"']) : cat === "Necklaces" || cat === "Pendants" ? (/Collar/.test(n) ? ["Small","Medium","Large"] : ['16"','18"','20"']) : RING_SIZES;
const blurb = { "Engagement Rings": "an engagement ring design", Rings: "a statement ring", "Wedding Bands": "a wedding band design", Necklaces: "a necklace", Pendants: "a pendant on a fine chain", Earrings: "a pair of earrings", Bracelets: "a bracelet" };

const FEATURED = new Set(["Six-Prong Solitaire","Emerald-Cut Solitaire","Pearl Blossom Pendant","Chandelier Diamond Earrings","Classic Pearl Bracelet","Diamond Lariat Necklace","Platinum Diamond Eternity Band","Pear Diamond Pendant"]);
const BEST = new Set(["Cushion Halo Ring","Hammered Yellow Gold Band","Round Solitaire Pendant","Classic Diamond Studs","Classic Diamond Tennis Bracelet","Gold Huggie Hoops","Layered Chain Necklace","Pavé Diamond Bangle"]);
const NEW_ = new Set(["Rosé Pear Halo Ring","Sapphire Halo Ring","Ribbed Gold Collar","Ruby Halo Pendant","Blossom Statement Earrings","Heart Charm Bracelet","Ruby Tennis Bracelet","Royal Blue Sapphire Pavé Band","Emerald Bezel Eternity Band"]);

// Round-robin across categories so the homepage "featured / new / best seller" rows mix categories.
const order = ["Engagement Rings","Wedding Bands","Rings","Necklaces","Pendants","Earrings","Bracelets"];
const lists = order.map((c) => items.filter((i) => i.category === c));
const ordered = []; for (let k = 0; k < Math.max(...lists.map((l) => l.length)); k++) for (const l of lists) if (l[k]) ordered.push(l[k]);

const counters = {};
const products = ordered.map((r, i) => {
  const code = CODE[r.category]; counters[code] = (counters[code] ?? 0) + 1; const s = stone(r.name);
  return {
    id: `PH-${code}-${String(counters[code]).padStart(3, "0")}`, slug: slugify(r.name), name: r.name, category: r.category,
    description: `${r.name} — ${blurb[r.category]} from our collection. Metal, size and stone options are confirmed with you by our team.`,
    materials: "Fine jewelry — metal and stones confirmed by our team", gemstone: s.gemstone, price: null, showPrice: false,
    sizes: sizes(r.category, r.name), metals: [], gemstoneOptions: s.opts, customization: true, images: [r.image],
    available: true, isNew: NEW_.has(r.name), bestSeller: BEST.has(r.name), featured: FEATURED.has(r.name), placeholder: true,
    createdAt: new Date(Date.UTC(2026, 0, 1) + (ordered.length - i) * 3600_000).toISOString(),
  };
});
const slugs = new Set(), imgs = new Set();
for (const p of products) { if (slugs.has(p.slug)) throw new Error("duplicate slug " + p.slug); slugs.add(p.slug); for (const im of p.images) { if (imgs.has(im)) throw new Error("duplicate image " + im); imgs.add(im); } }

products.push({ id: "PH-CUS-001", slug: "bespoke-signature-piece", name: "Bespoke Signature Piece", category: "Custom Jewelry",
  description: "Begin a one-of-a-kind design with our team. Share your vision and we will discuss the possibilities with you.",
  materials: "To be discussed", gemstone: "To be discussed", price: null, showPrice: false, sizes: [], metals: [], gemstoneOptions: [], customization: true,
  images: ["/images/homepage/home-03.webp"], available: true, isNew: false, bestSeller: false, featured: true, placeholder: true, createdAt: "2026-01-01T00:00:00.000Z" });

writeFileSync("src/lib/seed.ts", `import type { Product } from "./types";

// GENERATED by scripts/make-seed.mjs from scripts/catalog.json — edit those, not this file.
// Concept imagery (AI-generated visuals, NOT photos of real inventory). Every product is a sample
// until you replace it with a real piece in /admin. Each photo is used by exactly one product.
export const SEED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`);
const per = {}; for (const p of products) per[p.category] = (per[p.category] ?? 0) + 1;
console.log(products.length, "products", per);
