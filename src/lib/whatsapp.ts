// Build a WhatsApp deep-link from a phone number (digits only) + optional message.
export function waHref(number: string, text?: string): string {
  const clean = (number || "").replace(/[^\d]/g, "");
  const base = `https://wa.me/${clean}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
