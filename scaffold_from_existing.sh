#!/usr/bin/env bash
set -euo pipefail

MODE=""
LEGACY_DIR=""
SITEMAP_URL=""

# --- parse args ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="${2:-}"; shift 2;;
    --legacyDir) LEGACY_DIR="${2:-}"; shift 2;;
    --sitemap) SITEMAP_URL="${2:-}"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "Usage:"
  echo "  $0 --mode legacy --legacyDir legacy"
  echo "  $0 --mode sitemap --sitemap https://socalsolver.com/sitemap.xml"
  exit 1
fi

# --- sanity ---
[ -f package.json ] || { echo "Run from project root."; exit 1; }
if [[ "$MODE" == "legacy" ]]; then
  [ -d "$LEGACY_DIR" ] || { echo "Legacy dir not found: $LEGACY_DIR"; exit 1; }
elif [[ "$MODE" == "sitemap" ]]; then
  [[ "$SITEMAP_URL" =~ ^https?:// ]] || { echo "Provide a valid sitemap URL"; exit 1; }
else
  echo "Mode must be 'legacy' or 'sitemap'"; exit 1
fi

# --- ensure dirs ---
mkdir -p src/lib/formulas src/lib/registry src/components/CalculatorRenderer scripts

# --- write generator script ---
cat > scripts/generate_calculators.mjs <<'MJS'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODE = process.env.GC_MODE || 'legacy';
const LEGACY_DIR = process.env.GC_LEGACY_DIR || 'legacy';
const SITEMAP_URL = process.env.GC_SITEMAP_URL || '';

/**
 * Heuristics:
 * - Locales supported: en, it
 * - Slug detection:
 *    - LEGACY: look under app/(en|it)/**/* for file or folder names => slug
 *    - SITEMAP: derive slugs by stripping locale prefix '/en/' or '/it/'
 * - Main keyword: slug with '-' replaced by ' '.
 * - Category: guessed from the immediate parent directory name when available, else 'general'.
 */

const LOCALES = ['en','it'];

function titleCase(s) {
  return s.replace(/[-_]/g,' ').replace(/\s+/g,' ')
    .replace(/\b\w/g, c => c.toUpperCase()).trim();
}
function safeVar(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }
function hash(s){ return crypto.createHash('md5').update(s).digest('hex').slice(0,8); }

async function listFromLegacy(root) {
  const base = path.resolve(root);
  const results = [];
  for (const locale of LOCALES) {
    const appDir = path.join(base, 'app', locale);
    if (!fs.existsSync(appDir)) continue;
    // scan recursively
    const stack = [appDir];
    while (stack.length) {
      const dir = stack.pop();
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of ents) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          stack.push(p);
        } else {
          // consider route folders: '.../<slug>/page.*'  OR files like '<slug>.html|mdx'
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
  // de-dup
  const key = new Set();
  const out = [];
  for (const r of results) {
    const k = `${r.locale}:${r.slug}`;
    if (!key.has(k)) { key.add(k); out.push(r); }
  }
  return out;
}

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
      if (!slug || slug.includes('category') || slug.includes('_next')) continue;
      // ignore homepage and not-found
      if (slug === '' || slug === '_not-found') continue;
      // basic heuristic: single-segment slug pages most likely calculators
      const shortSlug = slug; // keep nested too; your dynamic route supports 'a/b' if needed
      out.push({ locale, slug: shortSlug, abs: u });
    } catch {}
  }
  // de-dup by key
  const seen = new Set();
  return out.filter(r => {
    const k = `${r.locale}:${r.slug}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

function guessCategoryFromSlug(slug) {
  const parts = slug.split('/');
  if (parts.length > 1) return parts[parts.length-2];
  return 'general';
}

function buildMetaTS({locale, slug}) {
  const key = `${locale}:${slug}`;
  const human = titleCase(slug);
  const mainKeyword = human; // from slug with spaces
  const category = guessCategoryFromSlug(slug);

  // EEAT/FAQ placeholders (editable later)
  return `import type { CalculatorMeta, Formula } from '@/specs/calculator';

export const formula: Formula = (inputs) => {
  // TODO: replace with real logic for "${human}"
  const v = Number(inputs.value ?? 0);
  return { result: v }; // identity placeholder
};

export const meta: CalculatorMeta = {
  key: ${JSON.stringify(key)},
  slug: ${JSON.stringify(slug)},
  category: ${JSON.stringify(category)},
  locale: ${JSON.stringify(locale)},
  title: ${JSON.stringify(`${human} Calculator`)},
  description: ${JSON.stringify(`Professional ${mainKeyword} calculator with clear formulas, examples, and references.`)},
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
    { q: ${JSON.stringify(`How do I use the ${mainKeyword} calculator?`)}, aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};
`;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFileOnce(file, content) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
  }
}

async function main() {
  let entries = [];
  if (MODE === 'legacy') {
    entries = await listFromLegacy(LEGACY_DIR);
  } else {
    entries = await listFromSitemap(SITEMAP_URL);
  }

  // Group by key and pick latest
  const map = new Map(); // key -> {locale, slug}
  for (const e of entries) {
    const key = `${e.locale}:${e.slug}`;
    if (!map.has(key)) map.set(key, { locale: e.locale, slug: e.slug });
  }

  // Create formula/meta modules
  const created = [];
  for (const { locale, slug } of map.values()) {
    const fname = `${slug}`.replace(/[^\w/-]+/g,'-'); // stable filename (allow nested)
    // place files under src/lib/formulas/<locale>/<slug>.ts for uniqueness
    const outDir = path.join(__dirname, '..', 'src', 'lib', 'formulas', locale);
    ensureDir(outDir);
    const outFile = path.join(outDir, `${fname}.ts`);
    if (!fs.existsSync(outFile)) {
      const code = buildMetaTS({ locale, slug });
      fs.writeFileSync(outFile, code);
      created.push(outFile);
    }
  }

  // Build generated maps (static imports)
  // metas map
  const metasLines = [];
  const formulasLines = [];
  let i = 0;
  for (const { locale, slug } of map.values()) {
    const key = `${locale}:${slug}`;
    const varName = `m_${safe(safeKey(key))}`;
    const relImport = `@/lib/formulas/${locale}/${slug}`.replace(/\/+/g,'/');

    metasLines.push(`import { meta as ${varName} } from '${relImport}';`);
    formulasLines.push(`import { formula as ${varName}_f } from '${relImport}';`);
    i++;
  }

  const metasMap = [];
  const formulasMap = [];
  for (const { locale, slug } of map.values()) {
    const key = `${locale}:${slug}`;
    const varName = `m_${safe(safeKey(key))}`;
    metasMap.push(`  ['${key}', ${varName}],`);
    formulasMap.push(`  ['${key}', ${varName}_f],`);
  }

  function safeKey(k){ return k.replace(/[^a-zA-Z0-9:_-]/g,'-'); }
  function safe(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }

  const registryOut = path.join(__dirname, '..', 'src', 'lib', 'registry', 'generated.ts');
  const clientOut   = path.join(__dirname, '..', 'src', 'components', 'CalculatorRenderer', 'formulas.generated.ts');

  fs.writeFileSync(registryOut, `/* AUTO-GENERATED. Do not edit by hand. */
import type { CalculatorMeta } from '@/specs/calculator';
${metasLines.join('\n')}

const metas = new Map<string, CalculatorMeta>([
${metasMap.join('\n')}
]);

export async function getCalculatorMeta(locale: string, slugPath: string) {
  return metas.get(\`\${locale}:\${slugPath}\`) ?? null;
}
export function listKnownCalculators() {
  return Array.from(metas.values()).map(m => ({ locale: m.locale, slug: m.slug }));
}
`);

  fs.writeFileSync(clientOut, `/* AUTO-GENERATED. Do not edit by hand. */
${formulasLines.join('\n')}

export const clientFormulas = new Map<string, (inputs: Record<string, any>) => Record<string, any>>([
${formulasMap.join('\n')}
]);
`);

  console.log(\`Created \${created.length} new calculators. Maps generated.\`);
}

await main();
MJS

# --- wire the app to generated maps ---
# Replace imports in page.tsx and Client.tsx to use generated maps
node <<'NODE'
const fs = require('fs');
function replaceInFile(file, search, repl){
  if (!fs.existsSync(file)) return;
  const s = fs.readFileSync(file,'utf8');
  if (!s.includes(repl)) {
    const out = s.replace(search, repl);
    fs.writeFileSync(file,out);
  }
}
replaceInFile('src/lib/registry/index.ts',
  /export async function getCalculatorMeta[\s\S]*/m,
  "export { getCalculatorMeta, listKnownCalculators } from './generated';\n"
);
replaceInFile('src/lib/registry/index.ts',
  /import type { CalculatorMeta } from '[^']+';[\s\S]*const metas:[\s\S]*$/m,
  "export { getCalculatorMeta, listKnownCalculators } from './generated';\n"
);
NODE

# Ensure index.ts exists and forwards to generated (safe if already done)
if ! grep -q "from './generated'" src/lib/registry/index.ts 2>/dev/null; then
  cat > src/lib/registry/index.ts <<'TS'
export { getCalculatorMeta, listKnownCalculators } from './generated';
TS
fi

# Patch Client.tsx to use generated formula map
if [ -f src/components/CalculatorRenderer/Client.tsx ]; then
  # remove manual imports + inject generated map
  node <<'NODE'
const fs=require('fs');
const p='src/components/CalculatorRenderer/Client.tsx';
if(!fs.existsSync(p)) process.exit(0);
let s=fs.readFileSync(p,'utf8');
s = s
  .replace(/import\s+\{\s*formula\s+as[^;]+;?\n/gm,'')
  .replace(/const clientFormulas:[\s\S]+?};?\n\n/m,"import { clientFormulas } from './formulas.generated';\n\n");
if(!/formulas\.generated/.test(s)){
  s = s.replace(/export function CalculatorClient/,
    "import { clientFormulas } from './formulas.generated';\n\nexport function CalculatorClient");
}
fs.writeFileSync(p,s);
NODE
fi

# --- run generator in chosen mode ---
if [[ "$MODE" == "legacy" ]]; then
  GC_MODE=legacy GC_LEGACY_DIR="$LEGACY_DIR" node scripts/generate_calculators.mjs
else
  GC_MODE=sitemap GC_SITEMAP_URL="$SITEMAP_URL" node scripts/generate_calculators.mjs
fi

echo "✅ Scaffolding complete. Now build:"
echo "   npm run build"
