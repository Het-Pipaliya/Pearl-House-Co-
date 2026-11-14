import { SITE } from "@/lib/site";

/** Shown after any request is submitted: save the number, how to reach us if urgent, response time. */
export default function NextSteps({ hasNumber = true, className = "" }: { hasNumber?: boolean; className?: string }) {
  return (
    <div className={`border border-blush bg-white p-6 text-left ${className}`}>
      {hasNumber && <p className="text-sm text-cocoa/85"><strong className="font-medium text-cocoa">Please take a screenshot of your inquiry number</strong> and keep it handy — you can quote it whenever you contact us.</p>}
      <p className={`${hasNumber ? "mt-3 " : ""}text-sm text-cocoa/85`}>Someone from our team will get back to you <strong className="font-medium text-cocoa">within 24 hours</strong>.</p>
      <p className="mt-3 text-sm text-cocoa/85">If it&apos;s urgent, please call or email us:</p>
      <ul className="mt-2 space-y-1 text-sm">
        <li>Phone: <a href={SITE.phoneHref} className="text-rose underline underline-offset-2">{SITE.phone}</a></li>
        <li>Email: <a href={`mailto:${SITE.email}`} className="text-rose underline underline-offset-2">{SITE.email}</a></li>
      </ul>
    </div>
  );
}
