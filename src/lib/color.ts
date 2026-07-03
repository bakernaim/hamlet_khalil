// Derive the theme accent shades from a single base hex color.
// Used by the root layout to inject CSS variables from the themeColor setting.

const HEX_RE = /^#[0-9a-f]{6}$/i;

export function isValidHex(hex: string): boolean {
  return HEX_RE.test(hex);
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) r = g = b = l;
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue(p, q, h + 1 / 3);
    g = hue(p, q, h);
    b = hue(p, q, h - 1 / 3);
  }
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// Shift lightness by `delta` (-1..1), clamped to [0, 1].
export function shiftLightness(hex: string, delta: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(1, Math.max(0, l + delta)));
}

// CSS-variable overrides for a custom accent color. Mirrors the defaults in
// globals.css: base fill, lighter hover, darker text-on-light, light sheen.
export function buildThemeCss(base: string): string {
  const hover = shiftLightness(base, 0.1);
  const text = shiftLightness(base, -0.06);
  const sheen = shiftLightness(base, 0.38);
  return (
    `:root{--green:${base};--green-hover:${hover};--green-text:${text};--shimmer-mid:${text};--green-sheen:${sheen}}` +
    `.dark{--green-text:${base};--shimmer-mid:${sheen}}`
  );
}
