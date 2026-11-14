/** Safe explanation of why an email could not be sent (shown to the site owner while setting up). Never includes keys. */
export function emailHint(status: string): string {
  if (status === "not_configured") return "The order email service is not connected yet (RESEND_API_KEY and/or BUSINESS_EMAIL missing in Vercel, or the site was not redeployed after adding them).";
  const m = status.match(/^failed: (\d{3})\s*(.*)$/s);
  if (m) {
    const code = m[1]; let msg = m[2]; try { msg = JSON.parse(m[2]).message ?? m[2]; } catch { /* plain text */ }
    const why = code === "401" || code === "403" ? "Resend rejected the request — check the API key, or that the recipient is allowed (the free test sender can only email the address your Resend account was created with)." : code === "422" ? "Resend rejected the email details (check EMAIL_FROM)." : code === "429" ? "Resend rate limit reached — try again shortly." : "Resend could not send the email.";
    return `${why} [Resend ${code}: ${String(msg).slice(0, 160)}]`;
  }
  return status.replace(/^failed: /, "").slice(0, 200);
}
