import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Contact Us", description: "Questions about a piece, an order request or custom jewelry? Contact the Pearl House & Co team." };

const FAQ: [string, string][] = [
  ["Do I pay when I submit an order request?", "No. Submitting a request does not require payment and does not confirm a purchase. Our team contacts you to discuss pricing, availability, customization, payment arrangements and delivery."],
  ["What happens after I submit a request?", "You receive an inquiry number. We review your request and contact you using your preferred method. Once everything is agreed, we place your order with our manufacturing partner and ship the finished piece to you."],
  ["Can I customize a piece?", "Yes. Many pieces offer options such as metal, size and gemstone, and you can add notes. For fully personalized designs, use our Custom Jewelry page."],
  ["Do you make the jewelry yourselves?", "No. Pearl House & Co works with independent, skilled jewelry manufacturers who produce pieces to order."],
  ["How long will my order take?", "Timing depends on the piece and customization. We will confirm an estimate with you before anything is placed into production."],
];

export default function Contact({ searchParams }: { searchParams: { product?: string } }) {
  return (
    <div className="container-x py-14">
      <header className="text-center"><p className="eyebrow">We'd love to hear from you</p><h1 className="mt-3 text-5xl">Contact Us</h1></header>
      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <ContactForm product={searchParams.product?.slice(0, 120)} />
        <div className="space-y-8">
          <div><h2 className="text-2xl">Client Care</h2>
            <ul className="mt-4 space-y-2 text-cocoa/80"><li>Email: <a className="text-rose underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li><li>Phone: {SITE.phone}</li><li>Hours: {SITE.hours}</li></ul>
            <p className="mt-3 text-xs text-cocoa/50">Contact details shown are placeholders until real business details are provided.</p></div>
          <div><h2 className="text-2xl">Follow Us</h2><ul className="mt-3 flex gap-6">{SITE.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u text-rose">{s.label}</a></li>)}</ul></div>
        </div>
      </div>
      <section className="mx-auto mt-24 max-w-3xl"><h2 className="mb-6 text-center text-4xl">Frequently Asked Questions</h2>
        {FAQ.map(([q, a]) => <details key={q} className="group border-b border-blush py-4"><summary className="cursor-pointer list-none font-serif text-xl marker:hidden">{q}<span className="float-right text-rose transition group-open:rotate-45">+</span></summary><p className="mt-3 text-cocoa/75">{a}</p></details>)}
      </section>
    </div>
  );
}
