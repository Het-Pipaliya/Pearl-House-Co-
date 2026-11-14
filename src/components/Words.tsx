/** Paragraph whose words light up one by one while scrolling (see ScrollEffects, data-fx="words"). Readable as plain text without JS. */
export default function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p data-fx="words" className={className} aria-label={text}>
      {text.split(" ").map((w, i) => <span key={i} aria-hidden className="w inline-block pr-[0.28em]">{w}</span>)}
    </p>
  );
}
