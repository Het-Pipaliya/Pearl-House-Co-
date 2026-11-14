import { z } from "zod";
import { CATEGORIES, METALS, STATUSES } from "./types";

const t = (max: number) => z.string().trim().max(max);
const req = (max: number, label: string) => z.string().trim().min(1, `${label} is required`).max(max);
const email = z.string().trim().toLowerCase().email("Please enter a valid email address").max(200);
const phone = z.string().trim().min(6, "Please enter a valid phone number").max(40).regex(/^[0-9+()\-.\s]+$/, "Please enter a valid phone number");
export const CONTACT_METHODS = ["Email", "Phone call", "WhatsApp / text message"] as const;

// Anti-spam fields shared by public forms: hidden honeypot + time the form was opened.
const spam = { website: t(200).optional(), openedAt: z.coerce.number().optional() };

export const orderSchema = z.object({
  ...spam,
  name: req(120, "Full name"), email, phone,
  city: t(100).optional(), state: t(100).optional(), country: t(100).optional(),
  contactMethod: z.enum(CONTACT_METHODS).optional(),
  instructions: t(2000).optional(), notes: t(2000).optional(),
  items: z.array(z.object({
    productId: t(60), quantity: z.coerce.number().int().min(1).max(20),
    size: t(40).optional(), metal: t(40).optional(), gemstone: t(80).optional(), customization: t(1000).optional(),
  })).min(1, "Your cart is empty").max(40),
});

export const customSchema = z.object({
  ...spam,
  name: req(120, "Full name"), email, phone,
  jewelryType: req(80, "Jewelry type"),
  metal: t(60).optional(), gemstone: t(120).optional(), budget: t(80).optional(),
  description: req(4000, "Design description").min(20, "Please describe your design in a little more detail"),
  contactMethod: z.enum(CONTACT_METHODS).optional(),
});

export const contactSchema = z.object({
  ...spam, name: req(120, "Name"), email, phone: phone.optional().or(z.literal("")), message: req(4000, "Message").min(10, "Please write a short message"),
});

export const productSchema = z.object({
  id: req(40, "SKU").regex(/^[A-Za-z0-9\-_]+$/, "SKU: letters, numbers, - and _ only"),
  slug: req(100, "Slug").regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
  name: req(120, "Name"), category: z.enum(CATEGORIES),
  description: req(3000, "Description"), materials: t(300).default(""), gemstone: t(300).default(""),
  price: z.number().nonnegative().max(10_000_000).nullable(), showPrice: z.boolean(),
  sizes: z.array(t(30)).max(40), metals: z.array(z.enum(METALS)).max(4), gemstoneOptions: z.array(t(80)).max(30),
  customization: z.boolean(), images: z.array(t(600)).max(10),
  available: z.boolean(), isNew: z.boolean(), bestSeller: z.boolean(), featured: z.boolean(), placeholder: z.boolean(),
});

export const statusSchema = z.object({ status: z.enum(STATUSES).optional(), adminNotes: t(4000).optional() });

/** Returns a user-facing message when the spam traps are tripped, else null. */
export function spamCheck(d: { website?: string; openedAt?: number }) {
  if (d.website) return "silent"; // honeypot filled → pretend success, store nothing
  if (d.openedAt && Date.now() - d.openedAt < 2500) return "Please take a moment to review your details and try again.";
  return null;
}
export const firstError = (e: z.ZodError) => e.issues[0]?.message ?? "Please check the form and try again.";
