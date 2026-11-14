import type { Metadata } from "next";
import CartView from "@/components/CartView";
export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };
export default function Cart() { return <div className="container-x py-14"><h1 className="mb-10 text-center text-5xl">Your Cart</h1><CartView /></div>; }
