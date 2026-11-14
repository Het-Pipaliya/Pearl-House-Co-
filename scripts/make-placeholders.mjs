// Generates illustrative SVG placeholders. Replace with real photography via the admin dashboard.
import { writeFileSync, mkdirSync } from "node:fs";
const out = "public/placeholders";
mkdirSync(out, { recursive: true });

const defs = `<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9A094"/><stop offset=".5" stop-color="#B76E62"/><stop offset="1" stop-color="#8E5148"/></linearGradient>
<linearGradient id="gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6D3CE"/></linearGradient>
<radialGradient id="pearl" cx=".35" cy=".3"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9DCD3"/></radialGradient>
<radialGradient id="glow" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".75"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
</defs>`;
const S = `fill="none" stroke="url(#g)" stroke-linecap="round"`;
const diamond = (cx, cy, r) => `<g><polygon points="${cx - r},${cy - r * .3} ${cx - r * .55},${cy - r * .75} ${cx + r * .55},${cy - r * .75} ${cx + r},${cy - r * .3} ${cx},${cy + r}" fill="url(#gem)" stroke="url(#g)" stroke-width="3"/><polyline points="${cx - r},${cy - r * .3} ${cx + r},${cy - r * .3}" stroke="url(#g)" stroke-width="2" fill="none"/><polyline points="${cx - r * .55},${cy - r * .75} ${cx - r * .25},${cy - r * .3} ${cx},${cy + r} ${cx + r * .25},${cy - r * .3} ${cx + r * .55},${cy - r * .75}" stroke="url(#g)" stroke-width="1.6" fill="none"/></g>`;
const pearl = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#pearl)" stroke="#D8C6BC" stroke-width="1.5"/>`;

const motifs = {
  ring: () => `<circle cx="400" cy="560" r="190" ${S} stroke-width="26"/>${diamond(400, 330, 70)}<path d="M360 400 Q400 430 440 400" ${S} stroke-width="10"/>`,
  engagement: () => `<circle cx="400" cy="580" r="180" ${S} stroke-width="20"/>${diamond(400, 330, 92)}<path d="M330 410 Q400 470 470 410" ${S} stroke-width="12"/><circle cx="318" cy="470" r="9" fill="url(#gem)" stroke="url(#g)" stroke-width="2"/><circle cx="482" cy="470" r="9" fill="url(#gem)" stroke="url(#g)" stroke-width="2"/>`,
  band: () => `<ellipse cx="400" cy="500" rx="210" ry="210" ${S} stroke-width="34"/><ellipse cx="400" cy="500" rx="210" ry="210" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 22"/>`,
  necklace: () => `<path d="M170 250 Q400 760 630 250" ${S} stroke-width="5"/>${pearl(400, 640, 12)}<circle cx="400" cy="700" r="2" fill="none"/>${Array.from({ length: 9 }, (_, i) => { const t = (i + 1) / 10; const x = 170 + 460 * t; const y = 250 + 4 * 190 * t * (1 - t) * 1.35; return `<circle cx="${x}" cy="${y}" r="9" fill="url(#g)"/>`; }).join("")}`,
  pendant: () => `<path d="M230 220 Q400 520 570 220" ${S} stroke-width="4"/><circle cx="400" cy="486" r="14" ${S} stroke-width="6"/>${diamond(400, 590, 80)}`,
  bracelet: () => `<ellipse cx="400" cy="500" rx="260" ry="150" ${S} stroke-width="14"/><ellipse cx="400" cy="500" rx="260" ry="150" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2" stroke-dasharray="3 14"/>${[0, 1, 2, 3, 4].map(i => pearl(240 + i * 80, 595 - Math.sin((i / 4) * Math.PI) * -12, 20)).join("")}`,
  earrings: () => [250, 550].map(x => `<path d="M${x} 250 q0 30 0 55" ${S} stroke-width="6"/>${pearl(x, 330, 26)}<path d="M${x} 370 v30" ${S} stroke-width="5"/>${pearl(x, 470, 46)}`).join(""),
  custom: () => `<path d="M400 230 l90 140 -90 330 -90 -330z" fill="url(#gem)" stroke="url(#g)" stroke-width="4"/><path d="M310 370 h180 M355 300 l45 70 45 -70 M400 370 v330" ${S} stroke-width="2.5"/><circle cx="230" cy="300" r="5" fill="url(#g)"/><circle cx="580" cy="560" r="7" fill="url(#g)"/><circle cx="250" cy="640" r="4" fill="url(#g)"/>`,
};
const bgs = { 1: "#F1DAD5", 2: "#EDE4D6", 3: "#FCF8F6" };
for (const [name, fn] of Object.entries(motifs)) {
  for (const v of [1, 2, 3]) {
    const vb = v === 3 ? "170 190 460 580" : "0 0 800 1000"; // v3 = close-up crop
    const transform = v === 2 ? `transform="translate(400 500) scale(.9) rotate(-6) translate(-400 -500)"` : "";
    writeFileSync(`${out}/${name}-${v}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice">${defs}<rect x="-100" y="-100" width="1000" height="1200" fill="${bgs[v]}"/><rect x="-100" y="-100" width="1000" height="1200" fill="url(#glow)"/><g ${transform}>${fn()}</g></svg>`);
  }
}
// Hero (wide) + story
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice">${defs}<rect width="1600" height="800" fill="#F1DAD5"/><rect width="1600" height="800" fill="url(#glow)"/><g transform="translate(900 40) scale(.95)">${motifs.engagement()}</g><g transform="translate(1180 150) scale(.55)">${motifs.earrings()}</g><g transform="translate(-120 80) scale(.8)">${motifs.necklace()}</g></svg>`;
writeFileSync(`${out}/hero.svg`, hero);
writeFileSync(`${out}/story.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">${defs}<rect width="800" height="1000" fill="#EDE4D6"/><rect width="800" height="1000" fill="url(#glow)"/>${motifs.bracelet()}${pearl(400, 250, 70)}</svg>`);
console.log("placeholders written");
