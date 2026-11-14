// Regenerates src/lib/seed.ts from scripts/photo-index.csv. Run: node scripts/make-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";
const rows = readFileSync("scripts/photo-index.csv", "utf8").trim().split(/\r?\n/).slice(1).map((l) => { const [Category, Number, Filename, Name, Path] = l.trim().split(",").map((c) => c.trim()); return { Category, Number: +Number, Filename, Name, Path }; });
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ENG = new Set(["Classic Solitaire","Radiant Halo","Oval Brilliance","Three Stone Grace","Pear Halo Elegance","Emerald Luxe","Cushion Royale","Marquise Allure","Floral Halo"]);
const WED = new Set(["Infinity Twist","Eternity Spark","Pave Classic","Baguette Channel","Timeless Comfort","Vintage Milgrain"]);
const category = (r) => r.Category === "Rings" ? (ENG.has(r.Name) ? "Engagement Rings" : WED.has(r.Name) ? "Wedding Bands" : "Rings")
  : r.Category === "Necklaces" ? (/Pendant/.test(r.Name) ? "Pendants" : "Necklaces") : r.Category;
const CODE = { "Engagement Rings": "ENG", Rings: "RNG", "Wedding Bands": "WED", Necklaces: "NCK", Pendants: "PND", Earrings: "EAR", Bracelets: "BRC" };

const NO_STONE = new Set(["Timeless Comfort", "Classic Gold Hoops", "Paperclip Chain Bracelet", "Rope Chain Bracelet", "Layered Chain Necklace"]);
const COLOURED = [["Sapphire", "Blue Sapphire"], ["Ruby", "Ruby"], ["Emerald", "Emerald"], ["Morganite", "Morganite"], ["Aquamarine", "Aquamarine"]];
const stone = (n) => {
  if (NO_STONE.has(n)) return { gemstone: "None", opts: [] };
  if (/Multi Gemstone/.test(n)) return { gemstone: "Mixed coloured gemstones (configurable)", opts: ["Mixed Gemstones"] };
  const c = COLOURED.find(([k]) => n.includes(k));
  if (c) return { gemstone: `${c[1]} with diamond accents (configurable)`, opts: [c[1], `Lab-Created ${c[1]}`] };
  if (/Pearl/.test(n)) return { gemstone: "Cultured pearl", opts: ["Cultured Pearl"] };
  return { gemstone: "Diamond or lab-grown diamond (configurable)", opts: ["Natural Diamond", "Lab-Grown Diamond", "Moissanite"] };
};
const RING_SIZES = ["4","5","6","7","8","9","10"];
const sizes = (cat, n) => cat === "Earrings" ? [] : cat === "Bracelets" ? (/Bangle|Cuff/.test(n) ? ["Small","Medium","Large"] : ['6.5"','7"','7.5"']) : (cat === "Necklaces" || cat === "Pendants") ? ['16"','18"','20"'] : RING_SIZES;
const metals = (cat) => (cat.includes("Ring") || cat === "Rings" || cat === "Wedding Bands" || cat === "Earrings") ? ["Yellow Gold","White Gold","Rose Gold","Platinum"] : ["Yellow Gold","White Gold","Rose Gold"];
const blurb = { "Engagement Rings": "An engagement ring design", Rings: "A statement ring", "Wedding Bands": "A wedding band design", Necklaces: "A necklace", Pendants: "A pendant on a fine chain", Earrings: "A pair of earrings", Bracelets: "A bracelet" };

const FEATURED = new Set(["Classic Solitaire","Three Stone Grace","Pearl Solitaire Pendant","Teardrop Diamond Statement","Teardrop Diamond Drops","Halo Diamond Studs","Rose Gold Tennis Bracelet","Classic Pearl Bracelet"]);
const BEST = new Set(["Classic Solitaire","Radiant Halo","Pave Classic","Solitaire Diamond Pendant","Classic Pearl Necklace","Classic Diamond Studs","Diamond Hoop Earrings","Classic Diamond Tennis Bracelet","Love Diamond Bangle"]);
const NEW_ = new Set(["Morganite Bliss","Aquamarine Serenity","Layered Chain Necklace","Infinity Statement Earrings","Blossom Statement Earrings","Blossom Diamond Bracelet","Bezel Diamond Bracelet","Heart Charm Bracelet"]);

// Round-robin across the four photo folders so "featured / new / best seller" rows mix categories.
const byFolder = ["Rings","Necklaces","Earrings","Bracelets"].map((f) => rows.filter((r) => r.Category === f).sort((a, b) => a.Number - b.Number));
const ordered = []; for (let i = 0; i < 20; i++) for (const f of byFolder) ordered.push(f[i]);

const counters = {};
const products = ordered.map((r, i) => {
  const cat = category(r); const code = CODE[cat]; counters[code] = (counters[code] ?? 0) + 1;
  const s = stone(r.Name);
  return {
    id: `PH-${code}-${String(counters[code]).padStart(3, "0")}`, slug: slugify(r.Name), name: r.Name, category: cat,
    description: `${blurb[cat]} from our sample collection. Metal, size and stone options are confirmed with you by our team. Sample product shown for demonstration.`,
    materials: "Solid gold or platinum (configurable)", gemstone: s.gemstone, price: null, showPrice: false,
    sizes: sizes(cat, r.Name), metals: metals(cat), gemstoneOptions: s.opts, customization: true,
    images: [`/images/catalog/${r.Path}`],
    available: true, isNew: NEW_.has(r.Name), bestSeller: BEST.has(r.Name), featured: FEATURED.has(r.Name), placeholder: true,
    createdAt: new Date(Date.UTC(2026, 0, 1) + (ordered.length - i) * 3600_000).toISOString(),
  };
});
const slugs = new Set(); for (const p of products) { if (slugs.has(p.slug)) throw new Error("duplicate slug " + p.slug); slugs.add(p.slug); }
const imgs = new Set(); for (const p of products) for (const im of p.images) { if (imgs.has(im)) throw new Error("duplicate image " + im); imgs.add(im); }

const bespoke = { id: "PH-CUS-001", slug: "bespoke-signature-piece", name: "Bespoke Signature Piece", category: "Custom Jewelry",
  description: "Begin a one-of-a-kind design with our team. Share your vision and we will discuss the possibilities with you. Sample entry shown for demonstration.",
  materials: "To be discussed", gemstone: "To be discussed", price: null, showPrice: false, sizes: [], metals: ["Yellow Gold","White Gold","Rose Gold","Platinum"], gemstoneOptions: [], customization: true,
  images: ["/images/homepage/home-03.webp"], available: true, isNew: false, bestSeller: false, featured: true, placeholder: true, createdAt: "2026-01-01T00:00:00.000Z" };
products.push(bespoke);

const ts = `import type { Product } from "./types";

// GENERATED by scripts/make-seed.mjs from scripts/photo-index.csv — edit the script/CSV, not this file.
// Concept imagery (AI-generated visuals, NOT photos of real inventory). Every product is a sample
// until you replace it with a real piece in /admin. Each photo is used by exactly one product.
export const SEED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;
writeFileSync("src/lib/seed.ts", ts);
const per = {}; for (const p of products) per[p.category] = (per[p.category] ?? 0) + 1;
console.log(products.length, "products", per);
