// Verifies every image referenced by the site exists and that no photo is used twice. Run: node scripts/check-images.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const uses = new Map();
const add = (p, where) => uses.set(p, [...(uses.get(p) ?? []), where]);
for (const f of walk("src").filter((f) => /\.(tsx?|css)$/.test(f))) {
  const t = readFileSync(f, "utf8");
  // every quoted /images/... string must be a clean path (catches stray \r, spaces, double extensions)
  for (const m of t.matchAll(/"(\/images\/[^"]*)"/g)) { if (!/^\/images\/[A-Za-z0-9_\/-]+\.(webp|jpg|png)$/.test(m[1])) { console.log("BAD PATH", JSON.stringify(m[1]), f); process.exitCode = 1; } else add(m[1], f); }
  if (f.endsWith("app/page.tsx")) { // category tile map: "rings/rings-02" → /images/rings/rings-02.webp
    const map = t.match(/const catImg[^{]*\{([^}]*)\}/s)?.[1] ?? "";
    for (const m of map.matchAll(/"((?:catalog|homepage)\/[a-z0-9-]+)"/g)) add(`/images/${m[1]}.webp`, f + " (category tile)");
  }
}
let bad = 0;
for (const [p, where] of uses) {
  if (!existsSync("public" + p)) { console.log("MISSING", p, where); bad++; }
  if (where.length > 1) { console.log("USED TWICE", p, where); bad++; }
}
const files = walk("public/images").map((f) => "/" + f.slice("public/".length));
const unused = files.filter((f) => !uses.has(f));
console.log(`${uses.size} references, ${files.length} files, ${unused.length} unused files, ${bad} problems`);
if (unused.length) console.log("unused:", unused.join(", "));
process.exit(bad ? 1 : 0);
