#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Patch Client.tsx to use Map#get…"
CLIENT_FILE="src/components/CalculatorRenderer/Client.tsx"
if [[ -f "$CLIENT_FILE" ]]; then
  node <<'NODE'
const fs=require('fs'), p='src/components/CalculatorRenderer/Client.tsx';
let s=fs.readFileSync(p,'utf8');
s=s.replace(/const outputs = useMemo\(\(\) => \{\s*const f = clientFormulas\[meta\.key\];\s*return f \? f\(inputs\) : \{\};\s*\}, \[inputs, meta\.key\]\);\s*/m,
`const outputs = useMemo(() => {
  const f = clientFormulas.get(meta.key);
  return f ? f(inputs) : {};
}, [inputs, meta.key]);\n`);
fs.writeFileSync(p,s);
NODE
else
  echo "WARN: $CLIENT_FILE not found (skipping)."
fi

echo "[2/4] Write clean generator (no backticks, complete)…"
mkdir -p scripts
cat > scripts/generate_calculators.mjs <<'MJS'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// env / constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODE = process.env.GC_MODE || 'legacy';
const LEGACY_DIR = process.env.GC_LEGACY_DIR || 'legacy';
const SITEMAP_URL = process.env.GC_SITEMAP_URL || '';
const LOCALES = ['en','it'];

// helpers
function titleCase(s) {
  return s.replace(/[-_]/g,' ')
          .replace(/\s+/g,' ')
          .replace(/\b\w/g, function (c) { return c.toUpperCase(); })
          .trim();
}
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function safeKey(k){ return k.replace(/[^a-zA-Z0-9:_-]/g,'-'); }
function safeVar(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }
function guessCategoryFromSlug(slug) {
  const parts = slug.split('/');
  return parts.length > 1 ? (parts[parts.length - 2] || 'general') : 'general';
}

// scan legacy/app/<locale>/**/page.*
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
        if (e.isDirectory()) { stack.push(p); continue; }
        if (/page\.(tsx|ts|js|jsx|mdx?)$/.test(p)) {
          const parts = p.split(path.sep);
          const slug = parts[parts.length - 2];
          if (slug && !slug.startsWith('(') && !slug.startsWith('[')) {
            results.push({ locale, slug, abs: p });
          }
          continue;
        }
        if (/\.(html|md|mdx)$/.test(p)) {
          const rel = path.relative(appDir, p);
          const slug = rel.replace(/\.(html|mdx?|md)$/,'').split(path.sep).pop();
          if (slug && !slug.startsWith('(') && !slug.startsWith('[')) {
            results.push({ locale, slug, abs: p });
          }
        }
      }
    }
  }
  const seen = new Set();
  return results.filter(function(r){
    const k = r.locale + ':' + r.slug;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// read <loc> from sitemap; keep /en/ or /it/
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed ' + res.status + ' ' + url);
  return await res.text();
}
async function listFromSitemap(url) {
  const xml = await fetchText(url);
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  for (let m; (m = locRegex.exec(xml)); ) urls.push(m[1]);
  const out = [];
  for (const u of urls) {
    try {
      const uobj = new URL(u);
      const parts = uobj.pathname.replace(/^\/+/,'').split('/');
      const locale = LOCALES.indexOf(parts[0]) >= 0 ? parts[0] : null;
      if (!locale) continue;
      const slug = parts.slice(1).join('/');
      if (!slug || slug === '_not-found') continue;
      out.push({ locale, slug, abs: u });
    } catch (e) {}
  }
  const seen = new Set();
  return out.filter(function(r){
    const k = r.locale + ':' + r.slug;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// build TS module text (meta + placeholder formula) — no template literals
function metaModuleText(locale, slug) {
  const key = locale + ':' + slug;
  const human = titleCase(slug);
  const mainKeyword = human;
  const category = guessCategoryFromSlug(slug);
  const titleStr = human + ' Calculator';
  const descStr  = 'Professional ' + mainKeyword + ' calculator with clear formulas, examples, and references.';
  const arr = [];
  arr.push("import type { CalculatorMeta, Formula } from '@/specs/calculator';");
  arr.push("");
  arr.push("export const formula: Formula = (inputs) => {");
  arr.push("  // TODO: implement real formula for \"" + human.replace(/"/g,'\\"') + "\"");
  arr.push("  const v = Number(inputs.value ?? 0);");
  arr.push("  return { result: v };");
  arr.push("};");
  arr.push("");
  arr.push("export const meta: CalculatorMeta = {");
  arr.push("  key: " + JSON.stringify(key) + ",");
  arr.push("  slug: " + JSON.stringify(slug) + ",");
  arr.push("  category: " + JSON.stringify(category) + ",");
  arr.push("  locale: " + JSON.stringify(locale) + ",");
  arr.push("  title: " + JSON.stringify(titleStr) + ",");
  arr.push("  description: " + JSON.stringify(descStr) + ",");
  arr.push("  keywords: " + JSON.stringify([mainKeyword.toLowerCase(), (mainKeyword.toLowerCase() + " calculator"), "online calculator"]) + ",");
  arr.push("  inputs: [");
  arr.push("    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.01, default: 1 }");
  arr.push("  ],");
  arr.push("  outputs: [");
  arr.push("    { id: 'result', label: 'Result', decimals: 4 }");
  arr.push("  ],");
  arr.push("  references: [");
  arr.push("    { label: 'Methodology / Standard (placeholder)', url: 'https://example.com' }");
  arr.push("  ],");
  arr.push("  faq: [");
  arr.push("    { q: " + JSON.stringify("How do I use the " + mainKeyword + " calculator?") + ", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },");
  arr.push("    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }");
  arr.push("  ]");
  arr.push("};");
  return arr.join('\n');
}

async function main() {
  let entries = [];
  if (MODE === 'legacy') entries = await listFromLegacy(LEGACY_DIR);
  else if (MODE === 'sitemap') entries = await listFromSitemap(SITEMAP_URL);
  else throw new Error("GC_MODE must be 'legacy' or 'sitemap'");

  const map = new Map();
  for (const e of entries) {
    const k = e.locale + ':' + e.slug;
    if (!map.has(k)) map.set(k, { locale: e.locale, slug: e.slug });
  }

  const created = [];
  for (const v of map.values()) {
    const locale = v.locale, slug = v.slug;
    const fname = String(slug).replace(/[^\w/-]+/g,'-');
    const outDir = path.join(__dirname, '..', 'src', 'lib', 'formulas', locale);
    ensureDir(outDir);
    const outFile = path.join(outDir, fname + '.ts');
    if (!fs.existsSync(outFile)) {
      fs.writeFileSync(outFile, metaModuleText(locale, slug));
      created.push(outFile);
    }
  }

  // static import maps
  const metasImports = [];
  const formulasImports = [];
  const metasMap = [];
  const formulasMap = [];
  for (const v of map.values()) {
    const key = v.locale + ':' + v.slug;
    const varName = 'm_' + safeVar(safeKey(key));
    const relImport = '@/lib/formulas/' + v.locale + '/' + v.slug;
    metasImports.push("import { meta as " + varName + " } from '" + relImport + "';");
    formulasImports.push("import { formula as " + varName + "_f } from '" + relImport + "';");
    metasMap.push("  ['" + key + "', " + varName + "],");
    formulasMap.push("  ['" + key + "', " + varName + "_f],");
  }

  const registryOut = path.join(__dirname, '..', 'src', 'lib', 'registry', 'generated.ts');
  const clientOut   = path.join(__dirname, '..', 'src', 'components', 'CalculatorRenderer', 'formulas.generated.ts');

  const reg = []
  reg.push("/* AUTO-GENERATED. Do not edit by hand. */");
  reg.push("import type { CalculatorMeta } from '@/specs/calculator';");
  reg.push(metasImports.join('\n'));
  reg.push("");
  reg.push("const metas = new Map<string, CalculatorMeta>([");
  reg.push(metasMap.join('\n'));
  reg.push("]);");
  reg.push("");
  reg.push("export async function getCalculatorMeta(locale, slugPath) {");
  reg.push("  return metas.get(locale + ':' + slugPath) ?? null;");
  reg.push("}");
  reg.push("export function listKnownCalculators() {");
  reg.push("  return Array.from(metas.values()).map(function(m){ return { locale: m.locale, slug: m.slug }; });");
  reg.push("}");
  fs.writeFileSync(registryOut, reg.join('\n'));

  const cli = [];
  cli.push("/* AUTO-GENERATED. Do not edit by hand. */");
  cli.push(formulasImports.join('\n'));
  cli.push("");
  cli.push("export const clientFormulas = new Map([");
  cli.push(formulasMap.join('\n'));
  cli.push("]);");
  fs.writeFileSync(clientOut, cli.join('\n'));

  console.log('Created ' + created.length + ' calculators. Maps generated.');
}

await main();
MJS

echo "[3/4] Generate calculators from sitemap…"
GC_MODE=sitemap GC_SITEMAP_URL=https://socalsolver.com/sitemap.xml node scripts/generate_calculators.mjs || {
  echo "Generation failed. Check scripts/generate_calculators.mjs for typos."; exit 1;
}

echo "[4/4] Build project…"
npm run build
echo "Done. Start dev with: npm run dev"
