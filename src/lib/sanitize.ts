// Allowlist sanitizer for the admin rich-text "info" fields.
// The editor only emits simple formatting tags; everything else (scripts,
// event handlers, styles pasted from other sites) is stripped on save so the
// public site can safely render the stored HTML.

const ALLOWED_TAGS = new Set([
  "p", "br", "div",
  "b", "strong", "i", "em", "u", "s",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "a", "span",
]);

// Tags whose entire content must go, not just the tag itself.
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|title)\b[\s\S]*?<\/\1\s*>/gi;

function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(href) && !/[<>"]/.test(href)) return href;
  return null;
}

export function sanitizeRichText(html: string): string {
  const cleaned = html
    .replace(DROP_WITH_CONTENT, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_m, rawName: string, rawAttrs: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      const closing = _m.startsWith("</");
      if (closing) return `</${name}>`;
      // Keep only a safe href on links; drop every other attribute.
      let attrs = "";
      if (name === "a") {
        const match = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(rawAttrs);
        const href = match ? safeHref(match[2] ?? match[3] ?? "") : null;
        if (href) attrs = ` href="${href}" target="_blank" rel="noopener noreferrer"`;
      }
      const selfClose = name === "br" ? " /" : "";
      return `<${name}${attrs}${selfClose}>`;
    })
    .trim();
  // Treat markup that renders as nothing (empty paragraphs/whitespace) as empty.
  const hasText = cleaned.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim().length > 0;
  return hasText ? cleaned : "";
}
