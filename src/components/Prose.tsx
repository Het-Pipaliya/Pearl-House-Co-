export default function Prose({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-14"><article className="mx-auto max-w-3xl"><h1 className="text-center text-5xl">{title}</h1>{intro && <p className="mt-4 text-center text-cocoa/60">{intro}</p>}<div className="prose-p mt-10">{children}</div>
      <p className="mt-12 border-t border-blush pt-4 text-xs text-cocoa/50">This page is a general template provided with the website. Please have it reviewed by a qualified professional and tailored to your business before launch.</p></article></div>
  );
}
