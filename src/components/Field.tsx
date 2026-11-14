import { useEffect, useState } from "react";
export function Field({ label, id, required, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="label">{label}{required && <span className="text-rose"> *</span>}</label>{children}</div>;
}
/** Timestamp for the anti-spam "form opened at" check. */
export function useOpenedAt() { const [t, setT] = useState(0); useEffect(() => setT(Date.now()), []); return t; }
/** Hidden honeypot: invisible to people, tempting to bots. */
export const Honeypot = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" /></label></div>
);
