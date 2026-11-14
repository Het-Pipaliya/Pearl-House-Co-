import type { Metadata } from "next";
import CustomForm from "@/components/CustomForm";
export const metadata: Metadata = { title: "Custom Jewelry", description: "Share your vision and our team will work with skilled manufacturing partners to bring a personalized piece to life." };

const steps = [["Share your vision", "Tell us about the piece you imagine and upload any inspiration."], ["We review & reach out", "Our team contacts you to discuss design, materials, pricing and timing."], ["Confirmation", "Once every detail is agreed, we place your piece with our manufacturing partner."], ["Delivery", "Your finished jewelry is shipped to you."]];
export default function Custom() {
  return (
    <div className="container-x py-14">
      <header className="mx-auto max-w-2xl text-center"><p className="eyebrow">Custom Jewelry</p><h1 className="mt-3 text-5xl sm:text-6xl">Your Vision. Our Craftsmanship.</h1><p className="mt-5 text-cocoa/75">Dreaming of something one of a kind? Submit a request and we'll guide you through the possibilities. Pieces are produced by our independent manufacturing partners.</p></header>
      <ol className="mx-auto my-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([t, d], i) => <li key={t} className="text-center"><span className="font-serif text-4xl text-rose">{i + 1}</span><h2 className="mt-1 text-xl">{t}</h2><p className="mt-2 text-sm text-cocoa/70">{d}</p></li>)}</ol>
      <div className="mx-auto max-w-3xl"><CustomForm /></div>
    </div>
  );
}
