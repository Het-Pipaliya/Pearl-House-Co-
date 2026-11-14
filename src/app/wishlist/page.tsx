import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";
import { getProducts } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };
export default async function Wishlist() {
  return <div className="container-x py-14"><h1 className="mb-10 text-center text-5xl">Your Wishlist</h1><WishlistView products={await getProducts()} /></div>;
}
