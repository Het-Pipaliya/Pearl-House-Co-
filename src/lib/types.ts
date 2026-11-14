export const CATEGORIES = [
  "Rings", "Engagement Rings", "Necklaces", "Pendants", "Bracelets", "Earrings", "Wedding Bands", "Custom Jewelry",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const METALS = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum"] as const;
export type Metal = (typeof METALS)[number];

export const STATUSES = [
  "New Inquiry", "Contacted Customer", "Awaiting Customer Confirmation", "Confirmed",
  "Sent to Manufacturer", "In Production", "Shipped", "Completed", "Cancelled",
] as const;
export type Status = (typeof STATUSES)[number];

export interface Product {
  id: string; // SKU
  slug: string;
  name: string;
  category: Category;
  description: string;
  materials: string;
  gemstone: string;
  price: number | null;
  showPrice: boolean;
  sizes: string[];
  metals: Metal[];
  gemstoneOptions: string[];
  customization: boolean; // shows a free-text customization field
  images: string[];
  available: boolean;
  isNew: boolean;
  bestSeller: boolean;
  featured: boolean;
  placeholder: boolean;
  createdAt: string;
}

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  size?: string;
  metal?: string;
  gemstone?: string;
  customization?: string;
}

export interface Inquiry {
  id: string; // reference number
  type: "order" | "custom";
  status: Status;
  createdAt: string;
  customer: {
    name: string; email: string; phone: string;
    city?: string; state?: string; country?: string; contactMethod?: string;
  };
  items: Array<Omit<CartLine, "key" | "image" | "slug">>;
  instructions?: string;
  notes?: string;
  custom?: {
    jewelryType: string; metal?: string; gemstone?: string; budget?: string;
    description: string; referenceImages: string[];
  };
  emailStatus: { business: string; customer: string };
  adminNotes?: string;
}

export interface ContactMessage {
  id: string; createdAt: string; name: string; email: string; phone?: string; message: string; read: boolean;
}
