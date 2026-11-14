// Admin session = signed, expiring token in an httpOnly cookie. Uses Web Crypto so it also runs in middleware.
export const COOKIE = "ph_admin";
const TTL = 60 * 60 * 8; // 8 hours
const enc = new TextEncoder();

const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
const safeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
const sha = async (s: string) => b64(await crypto.subtle.digest("SHA-256", enc.encode(s)));

export async function passwordMatches(input: string, expected: string) {
  if (!expected) return false;
  return safeEqual(await sha(input), await sha(expected));
}
export async function makeToken(secret: string) {
  const payload = String(Math.floor(Date.now() / 1000) + TTL);
  return `${payload}.${await hmac(secret, payload)}`;
}
export async function verifyToken(token: string | undefined, secret: string) {
  if (!token || !secret || secret.length < 16) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || Number(payload) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(secret, payload));
}
export const SESSION_TTL = TTL;
