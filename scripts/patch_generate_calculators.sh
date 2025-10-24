#!/usr/bin/env bash
set -euo pipefail

FILE="scripts/generate_calculators.mjs"
[ -f "$FILE" ] || { echo "Missing $FILE (run scaffold script first)"; exit 1; }

cat > "$FILE" <<'MJS'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODE = process.env.GC_MODE || 'legacy';
const LEGACY_DIR = process.env.GC_LEGACY_DIR || 'legacy';
const SITEMAP_URL = process.env.GC_SITEMAP_URL || '';
const LOCALES = ['en','it'];

// Helpers
const titleCase = (s) =>
  s.replace(/[-_]/g,' ').replace(/\s+/g,' ')
   .replace(/\b\w/g, c => c.toUpperCase()).trim();

const safeVar = (s) => s.replace(/[^a-zA-Z0-9_]/g,'_');
const hash = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0,8);

// LEGACY scanner: look under legacy/app/<locale>/**/page.*
async function listFromLegacy(root) {
  const base = path.resolve(root);
  const results = [];
  for (const locale of LOCALES) {
    const appDir = path.join(base, 'app', locale);
    if (!fs.existsSync(appDir)) continue;
    const stack = [appDir];
    while (stack.length) {
      const dir = stack.pop();
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of ents) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          stack.push(p);
        } else {
          if (/page\.(tsx|ts|js|jsx|mdx?)$/.test(p)) {
            const parts = p.split(path.sep);
            const slug = parts[parts.length - 2];
            if (slug && !slug.startsWith('(') && !slug.startsWith('[')) {
              results.push({ locale, slug, abs: p });
            }
          } else if (/\.(html|md|mdx)$/.test(p)) {
            const rel = path.relative(appDir, p);
            const slug = rel.replace(/\.(html|mdx?|md)$/, '').split(path.sep).pop();
            if (slug && !slug.startsWith('(') && !slug.startsWith('[')) {
              results.push({ locale, slug, abs: p });
            }
          }
        }
      }
    }
  }
  const seen = new Set();
  return results.filter(r => {
    const k = `${r.locale}:${r.slug}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// SITEMAP scanner: parse <loc> URLs, keep ones with /en/ or /it/
async function fetchText(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return await res.text();
}
async function listFromSitemap(url) {
  const xml = await fetchText(url);
  const urls = Array.from(xml.matchAll(/<loc>(.+?)<\/loc>/g)).map(m => m[1]);
  const out = [];
  for (const u of urls) {
    try {
      const uobj = new URL(u);
      const parts = uobj.pathname.replace(/^\/+/,'').split('/');
      const locale = LOCALES.includes(parts[0]) ? parts[0] : null;
      if (!locale) continue;
      const slug = parts.slice(1).join('/');
      if (!slug || slug === '_not-found') continue;
      out.push({ locale, slug, abs: u });
    } catch {}
  }
  const seen = new Set();
  return out.filter(r => {
    const k = `${r.locale}:${r.slug}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// Category heuristic: parent directory name if nested, else 'general'
const guessCategoryFromSlug = (slug) => {
  const parts = slug.split('/');
  if (parts.length > 1) return parts[parts.length-2] || 'general';
  return 'general';
};

// Build a meta+formula TS module for a given slug/locale
function buildMetaTS({locale, slug}) {
  const key = `${locale}:${slug}`;
  const human = titleCase(slug);
  const mainKeyword = human;
  const category = guessCategoryFromSlug(slug);

  return `import type { CalculatorMeta, Formula } from '@/specs/calculator';

export const formula: Formula = (inputs) => {
  // TODO: replace with real logic for "${human}"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: ${JSON.stringify(key)},
  slug: ${JSON.stringify(slug)},
  category: ${JSON.stringify(category)},
  locale: ${JSON.stringify(locale)},
  title: ${JSON.stringify(\`\${human} Calculator\`)},
  description: ${JSON.stringify(\`Professional \${mainKeyword} calculator with clear formulas, examples, and references.\`)},
  keywords: ${JSON.stringify([mainKeyword.toLowerCase(), `${mainKeyword.toLowerCase()} calculator`, 'online calculator'])},
  inputs: [
    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.01, default: 1 }
  ],
  outputs: [
    { id: 'result', label: 'Result', decimals: 4 }
  ],
  references: [
    { label: 'Methodology / Standard (placeholder)', url: 'https://example.com' }
  ],
  faq: [
    { q: ${JSON.stringify(\`How do I use the \${mainKeyword} calculator?\`)}, aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};
`;
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

async function main() {
  let entries = [];
  if (MODE === 'legacy') {
    entries = await listFromLegacy(LEGACY_DIR);
  } else if (MODE === 'sitemap') {
    entries = await listFromSitemap(SITEMAP_URL);
  } else {
    throw new Error("GC_MODE must be 'legacy' or 'sitemap'");
  }

  const map = new Map();
  for (const e of entries) {
    const key = `${e.locale}:${e.slug}`;
    if (!map.has(key)) map.set(key, { locale: e.locale, slug: e.slug });
  }

  const created = [];
  for (const { locale, slug } of map.values()) {
    const fname = `${slug}`.replace(/[^\w/-]+/g,'-');
    const outDir = path.join(__dirname, '..', 'src', 'lib', 'formulas', locale);
    ensureDir(outDir);
    const outFile = path.join(outDir, `${fname}.ts`);
    if (!fs.existsSync(outFile)) {
      const code = buildMetaTS({ locale, slug });
      fs.writeFileSync(outFile, code);
      created.push(outFile);
    }
  }

  // Build the static import maps
  function safeKey(k){ return k.replace(/[^a-zA-Z0-9:_-]/g,'-'); }
  function safe(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }

  const metasImports = [];
  const formulasImports = [];
  const metasMapLines = [];
  const formulasMapLines = [];

  for (const { locale, slug } of map.values()) {
    const key = `${locale}:${slug}`;
    const varName = `m_${safe(safeKey(key))}`;
    const relImport = `@/lib/formulas/${locale}/${slug}`.replace(/\/+/g,'/');
    metasImports.push(`import { meta as ${varName} } from '${relImport}';`);
    formulasImports.push(`import { formula as ${varName}_f } from '${relImport}';`);
    metasMapLines.push(`  ['${key}', ${varName}],`);
    formulasMapLines.push(`  ['${key}', ${varName}_f],`);
  }

  const registryOut = path.join(__dirname, '..', 'src', 'lib', 'registry', 'generated.ts');
  const clientOut   = path.join(__dirname, '..', 'src', 'components', 'CalculatorRenderer', 'formulas.generated.ts');

  fs.writeFileSync(registryOut, `/* AUTO-GENERATED. Do not edit by hand. */
import type { CalculatorMeta } from '@/specs/calculator';
${metasImports.join('\n')}

const metas = new Map<string, CalculatorMeta>([
${metasMapLines.join('\n')}
]);

export async function getCalculatorMeta(locale: string, slugPath: string) {
  return metas.get(\`\${locale}:\${slugPath}\`) ?? null;
}
export function listKnownCalculators() {
  return Array.from(metas.values()).map(m => ({ locale: m.locale, slug: m.slug }));
}
`);

  fs.writeFileSync(clientOut, `/* AUTO-GENERATED. Do not edit by hand. */
${formulasImports.join('\n')}

export const clientFormulas = new Map<string, (inputs: Record<string, any>) => Record<string, any>>([
${formulasMapLines.join('\n')}
]);
`);

  console.log(\`Created \${created.length} new calculators. Maps generated.\`);
}

await main();
MJS

echo "[OK] Rewrote scripts/generate_calculators.mjs without block comments."
