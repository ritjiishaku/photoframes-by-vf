const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLOUR_FILE = path.join(ROOT, 'token-colour.json');
const TYPOGRAPHY_FILE = path.join(ROOT, 'token-typography.json');
const OUTPUT_FILE = path.join(ROOT, 'styles', 'tokens.css');

// ------------------------------------------------------------------ PARSING

function parseHSL(hsl) {
  const m = hsl.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/);
  if (!m) return null;
  return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
}

function fmtHSL({ h, s, l }) {
  return `hsl(${Math.round(h * 10) / 10}, ${Math.round(s * 10) / 10}%, ${Math.round(l * 10) / 10}%)`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolateHSL(a, b, t) {
  return fmtHSL({
    h: lerp(a.h, b.h, t),
    s: lerp(a.s, b.s, t),
    l: lerp(a.l, b.l, t),
  });
}

function fillMissingPaletteTones(palette, neededTones) {
  const existing = Object.keys(palette).map(Number).sort((x, y) => x - y);
  for (const tone of neededTones) {
    if (palette[tone] !== undefined) continue;
    let lo = existing[0], hi = existing[existing.length - 1];
    for (const t of existing) {
      if (t <= tone) lo = t;
      if (t >= tone && t < hi) hi = t;
    }
    const t = hi === lo ? 0 : (tone - lo) / (hi - lo);
    const a = parseHSL(palette[String(lo)]);
    const b = parseHSL(palette[String(hi)]);
    if (a && b) palette[String(tone)] = interpolateHSL(a, b, t);
  }
}

function kebabCase(str) {
  return str.replace(/[A-Z]/g, c => '-' + c.toLowerCase()).replace(/^-/, '');
}

// ------------------------------------------------------------------ DATA

const colour = JSON.parse(fs.readFileSync(COLOUR_FILE, 'utf-8'));
const typography = JSON.parse(fs.readFileSync(TYPOGRAPHY_FILE, 'utf-8'));

// Add standard M3 error palette (missing from source)
colour.color.palette.error = {
  '0': 'hsl(0, 0%, 0%)',
  '10': 'hsl(0, 100%, 13%)',
  '20': 'hsl(0, 100%, 21%)',
  '30': 'hsl(0, 100%, 29%)',
  '40': 'hsl(0, 74%, 42%)',
  '50': 'hsl(0, 72%, 53%)',
  '60': 'hsl(0, 100%, 64%)',
  '70': 'hsl(0, 100%, 75%)',
  '80': 'hsl(0, 100%, 84%)',
  '90': 'hsl(0, 100%, 92%)',
  '95': 'hsl(0, 100%, 96%)',
  '99': 'hsl(0, 0%, 99%)',
  '100': 'hsl(0, 0%, 100%)',
};

// Fill missing intermediate neutral tones referenced by dark roles
fillMissingPaletteTones(colour.color.palette.neutral, [4, 6, 12, 17, 22, 24]);

// --------------------------------------------------------------- RESOLVER

function resolve(value, data) {
  if (typeof value === 'string') {
    return value.replace(/\{([^}]+)\}/g, (_, ref) => {
      const parts = ref.split('.');
      let cur = data;
      for (const p of parts) {
        if (cur == null || cur[p] === undefined) return value;
        cur = cur[p];
      }
      return String(cur);
    });
  }
  if (Array.isArray(value)) {
    return value.map(v => resolve(v, data));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolve(v, data);
    }
    return out;
  }
  return value;
}

// --------------------------------------------------------------- BUILD CSS

const lines = [];
function L(str = '') { lines.push(str); }

L('/* ==========================================');
L('   Design Tokens — Giftshop by VF');
L('   Auto-generated from token-colour.json &');
L('   token-typography.json');
L('   Do not edit directly.');
L('   ========================================== */');
L('');

// ---- Colour Roles ---------------------------------------------------------

const lightRoles = resolve(colour.color.role.light, colour);
const darkRoles = resolve(colour.color.role.dark, colour);

L('/* ===== Colour Roles (Light) ===== */');
L(':root {');
for (const [key, val] of Object.entries(lightRoles)) {
  L(`  --color-${kebabCase(key)}: ${val};`);
}
L('}');
L('');

L('/* ===== Colour Roles (Dark) ===== */');
L('.dark {');
for (const [key, val] of Object.entries(darkRoles)) {
  L(`  --color-${kebabCase(key)}: ${val};`);
}
L('}');
L('');

// ---- Font Families --------------------------------------------------------

L('/* ===== Font Families ===== */');
L(':root {');
for (const [, fam] of Object.entries(typography.fontFamilies)) {
  const quoted = fam.name.includes(' ') ? `'${fam.name}'` : fam.name;
  const stack = [quoted, ...fam.fallback].join(', ');
  L(`  ${fam.variable}: ${stack};`);
}
L('}');
L('');

// ---- Font Weights ---------------------------------------------------------

L('/* ===== Font Weights ===== */');
L(':root {');
for (const [name, val] of Object.entries(typography.fontWeights)) {
  L(`  --font-weight-${kebabCase(name)}: ${val};`);
}
L('}');
L('');

// ---- Line Heights ---------------------------------------------------------

L('/* ===== Line Heights ===== */');
L(':root {');
for (const [name, val] of Object.entries(typography.lineHeights)) {
  L(`  --leading-${kebabCase(name)}: ${val};`);
}
L('}');
L('');

// ---- Letter Spacing -------------------------------------------------------

L('/* ===== Letter Spacing ===== */');
L(':root {');
for (const [name, val] of Object.entries(typography.letterSpacing)) {
  L(`  --tracking-${kebabCase(name)}: ${val};`);
}
L('}');
L('');

// ---- Font Sizes (mobile-first + desktop override) -------------------------

function buildFontSizeVars(prefix, sizes) {
  for (const [name, def] of Object.entries(sizes)) {
    const k = kebabCase(name);
    L(`  --${prefix}${k}: ${def.size};`);
    if (def.lineHeight) L(`  --${prefix}${k}--line-height: ${def.lineHeight};`);
    if (def.letterSpacing) L(`  --${prefix}${k}--letter-spacing: ${def.letterSpacing};`);
  }
}

L('/* ===== Font Sizes — Mobile (default) ===== */');
L(':root {');
buildFontSizeVars('text-', typography.fontSizes.mobile);
L('}');
L('');

const desktopBreak = typography.responsiveBreakpoints?.desktop?.min ?? 1024;
L(`/* ===== Font Sizes — Desktop (≥${desktopBreak}px) ===== */`);
L(`@media (min-width: ${desktopBreak}px) {`);
L('  :root {');
buildFontSizeVars('text-', typography.fontSizes.desktop);
L('  }');
L('}');
L('');

// ---- Text Style Composites ------------------------------------------------

function resolveTextStyle(name, style) {
  const k = kebabCase(name);

  // font family
  const fontFam = typography.fontFamilies[style.font];
  if (!fontFam) {
    console.warn(`  ⚠ textStyle "${name}" references unknown font "${style.font}"`);
    return;
  }
  const fontStack = fontFam.variable;

  // size
  const sizeMobile = typography.fontSizes.mobile[style.size?.mobile];
  const sizeDesktop = typography.fontSizes.desktop[style.size?.desktop];

  // weight
  const weight = style.weight ? typography.fontWeights[style.weight] : null;

  // line-height
  const lineHeight = style.lineHeight ? typography.lineHeights[style.lineHeight] : null;

  // letter-spacing
  const letterSpacing = style.letterSpacing ? typography.letterSpacing[style.letterSpacing] : null;

  // transform
  const transform = style.transform || null;

  // Write mobile / desktop
  if (sizeMobile) {
    L(`  --text-${k}--font-family: var(${fontStack});`);
    L(`  --text-${k}--font-size: var(--text-${kebabCase(style.size.mobile)});`);
    L(`  --text-${k}--line-height: ${lineHeight != null ? lineHeight : `var(--text-${kebabCase(style.size.mobile)}--line-height)`};`);
    if (weight != null) L(`  --text-${k}--font-weight: ${weight};`);
    if (letterSpacing != null) L(`  --text-${k}--letter-spacing: ${letterSpacing};`);
    if (transform) {
      const prop = transform === 'italic' ? 'font-style' : 'text-transform';
      L(`  --text-${k}--${prop}: ${transform};`);
    }
  }

  if (sizeDesktop) {
    L(`  --text-${k}-desktop--font-family: var(${fontStack});`);
    L(`  --text-${k}-desktop--font-size: var(--text-${kebabCase(style.size.desktop)});`);
    L(`  --text-${k}-desktop--line-height: ${lineHeight != null ? lineHeight : `var(--text-${kebabCase(style.size.desktop)}--line-height)`};`);
    if (weight != null) L(`  --text-${k}-desktop--font-weight: ${weight};`);
    if (letterSpacing != null) L(`  --text-${k}-desktop--letter-spacing: ${letterSpacing};`);
    if (transform) {
      const prop = transform === 'italic' ? 'font-style' : 'text-transform';
      L(`  --text-${k}-desktop--${prop}: ${transform};`);
    }
  }
}

L('/* ===== Text Style Composites ===== */');
L(':root {');
for (const [name, style] of Object.entries(typography.textStyles)) {
  resolveTextStyle(name, style);
}
L('}');
L('');

// ---- Accessibility tokens -------------------------------------------------

L('/* ===== Accessibility ===== */');
L(':root {');
L(`  --min-font-size: ${typography.accessibility.minimumFontSize};`);
L(`  --min-contrast-ratio: ${typography.accessibility.minimumContrastRatio};`);
L(`  --min-touch-target: ${typography.accessibility.minimumTouchTarget};`);
L('}');

// ------------------------------------------------------------------- WRITE

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
console.log(`✓ Tokens written to ${OUTPUT_FILE}`);
