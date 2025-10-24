import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const LEGACY_DIR = process.env.GC_LEGACY_DIR || 'legacy';

// ---------- utils ----------
function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function titleCase(s){ return s.replace(/[-_]/g,' ').replace(/\s+/g,' ').replace(/\b\w/g, c => c.toUpperCase()).trim(); }
function safeVar(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }
function safeKey(s){ return s.replace(/[^a-zA-Z0-9:_/-]/g,'-'); }
function safeFileSlug(slug){
  return slug
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9/.-]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/(^-|-$)/g,'');
}
function guessCategoryFromSlug(slug){
  const parts = slug.split('/');
  return parts.length>1 ? (parts[parts.length-2] || 'general') : 'general';
}
function readFileSafe(p){ try { return fs.readFileSync(p,'utf8'); } catch { return ''; } }

// Very small frontmatter parser (YAML subset)
function parseFrontmatter(md){
  // ---\n key: value\n ... \n---
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  if(!m) return {};
  const yaml = m[1];
  const out = {};
  yaml.split(/\r?\n/).forEach(line=>{
    const mm = line.match(/^\s*([A-Za-z0-9_\-]+)\s*:\s*(.+)\s*$/);
    if(!mm) return;
    const k = mm[1].trim();
    let v = mm[2].trim();
    v = v.replace(/^['"]|['"]$/g,''); // strip surrounding quotes
    if (k === 'keywords') {
      // try comma-separated list
      out[k] = v.split(',').map(s=>s.trim()).filter(Boolean);
    } else {
      out[k] = v;
    }
  });
  return out;
}

// ---------- scan content/<locale>/**/*.md ----------
function detectLocalesFromContent(base){
  const content = path.join(base, 'content');
  if(!fs.existsSync(content)) return [];
  return fs.readdirSync(content, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);
}

function scanContent(){
  const base = path.resolve(LEGACY_DIR);
  const locales = detectLocalesFromContent(base);
  const contentRoot = path.join(base, 'content');
  const results = [];

  for (const locale of locales){
    const root = path.join(contentRoot, locale);
    const stack=[root];
    while(stack.length){
      const dir=stack.pop();
      const ents=fs.readdirSync(dir, { withFileTypes: true });
      for (const e of ents){
        const p = path.join(dir, e.name);
        if (e.isDirectory()){ stack.push(p); continue; }
        if (p.endsWith('.md')) {
          const rel = path.relative(root, p).replace(/\\/g,'/'); // e.g. "business/roi.md"
          const slug = rel.replace(/\.md$/,'');                  // "business/roi"
          // skip obvious non-routes
          const segs = slug.split('/');
          if (segs.some(s => s.startsWith('[') || s.startsWith('('))) continue;
          results.push({ locale, slug, mdPath: p });
        }
      }
    }
  }
  // de-dupe
  const seen=new Set();
  return results.filter(r=>{
    const k = `${r.locale}:${r.slug}`;
    if(seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ---------- guess legacy component path ----------
function guessLegacyComponentPath(base, slug){
  // Try exact and basename under components/calculators
  const compRoot = path.join(base, 'components', 'calculators');
  const baseName = path.basename(slug);
  const attempts = [
    path.join(compRoot, slug + '.tsx'),
    path.join(compRoot, slug + '.ts'),
    path.join(compRoot, slug + '.jsx'),
    path.join(compRoot, slug + '.js'),
    path.join(compRoot, baseName + '.tsx'),
    path.join(compRoot, baseName + '.ts'),
    path.join(compRoot, baseName + '.jsx'),
    path.join(compRoot, baseName + '.js'),
  ];
  for (const a of attempts) {
    if (fs.existsSync(a)) return a;
  }
  return null;
}

// ---------- build module ----------
function buildModule(locale, slug, fm, legacyComponentHint){
  const key         = `${locale}:${slug}`;
  const humanBase   = slug.split('/').pop() || slug;
  const human       = fm.title ? fm.title : titleCase(humanBase);
  const mainKeyword = human;
  const category    = guessCategoryFromSlug(slug);
  const titleStr    = human;
  const descStr     = fm.description ? fm.description : `Professional ${mainKeyword} calculator with clear formulas, examples, and references.`;
  const keywords    = Array.isArray(fm.keywords) && fm.keywords.length
    ? fm.keywords
    : [mainKeyword.toLowerCase(), `${mainKeyword.toLowerCase()} calculator`, 'online calculator'];

  const lines = [];
  lines.push("import type { CalculatorMeta, Formula } from '@/specs/calculator';");
  lines.push("");
  lines.push("// NOTE: This calculator was scaffolded from legacy /content.");
  if (legacyComponentHint) {
    lines.push(`// Legacy component hint: ${legacyComponentHint}`);
    lines.push("// If that component exposes a pure compute function, import and wire it here.");
  }
  lines.push("");
  lines.push("export const formula: Formula = (inputs) => {");
  lines.push(`  // TODO: implement real formula for "${human.replace(/"/g,'\\"')}"`);
  lines.push("  const v = Number(inputs.value ?? 0);");
  lines.push("  return { result: v };");
  lines.push("};");
  lines.push("");
  lines.push("export const meta: CalculatorMeta = {");
  lines.push(`  key: ${JSON.stringify(key)},`);
  lines.push(`  slug: ${JSON.stringify(slug)},`);
  lines.push(`  category: ${JSON.stringify(category)},`);
  lines.push(`  locale: ${JSON.stringify(locale)},`);
  lines.push(`  title: ${JSON.stringify(titleStr)},`);
  lines.push(`  description: ${JSON.stringify(descStr)},`);
  lines.push(`  keywords: ${JSON.stringify(keywords)},`);
  lines.push("  inputs: [");
  lines.push("    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.01, default: 1 }");
  lines.push("  ],");
  lines.push("  outputs: [");
  lines.push("    { id: 'result', label: 'Result', decimals: 4 }");
  lines.push("  ],");
  lines.push("  references: [");
  lines.push("    { label: 'Methodology / Standard (placeholder)', url: 'https://example.com' }");
  lines.push("  ],");
  lines.push("  faq: [");
  lines.push(`    { q: ${JSON.stringify(`How do I use the ${mainKeyword} calculator?`)}, aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },`);
  lines.push("    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }");
  lines.push("  ]");
  lines.push("};");
  return lines.join('\n');
}

// ---------- generate ----------
function generate(){
  const base = path.resolve(LEGACY_DIR);
  const entries = scanContent();
  const uniq = new Map();
  for (const e of entries){ const k = `${e.locale}:${e.slug}`; if(!uniq.has(k)) uniq.set(k,e); }

  const created = [];
  for (const { locale, slug, mdPath } of uniq.values()){
    const fileSlug = safeFileSlug(slug); // for filesystem
    const outDir   = path.join(__dirname, '..', 'src', 'lib', 'formulas', locale, path.dirname(fileSlug));
    ensureDir(outDir);
    const outFile  = path.join(outDir, path.basename(fileSlug) + '.ts');
    if (!fs.existsSync(outFile)) {
      const md = readFileSafe(mdPath);
      const fm = parseFrontmatter(md);
      const hint = guessLegacyComponentPath(base, slug);
      fs.writeFileSync(outFile, buildModule(locale, slug, fm, hint || undefined));
      created.push(outFile);
    }
  }

  // import maps
  const metasImports    = [];
  const formulasImports = [];
  const metasMapLines   = [];
  const formulasLines   = [];
  for (const { locale, slug } of uniq.values()){
    const key = `${locale}:${slug}`;
    const varName = 'm_' + safeVar(safeKey(key));
    const relImport = '@/lib/formulas/' + locale + '/' + safeFileSlug(slug);
    metasImports.push(`import { meta as ${varName} } from '${relImport}';`);
    formulasImports.push(`import { formula as ${varName}_f } from '${relImport}';`);
    metasMapLines.push(`  ['${key}', ${varName}],`);
    formulasLines.push(`  ['${key}', ${varName}_f],`);
  }

  const registryOut = path.join(__dirname, '..', 'src', 'lib', 'registry', 'generated.ts');
  const clientOut   = path.join(__dirname, '..', 'src', 'components', 'CalculatorRenderer', 'formulas.generated.ts');

  const reg = [];
  reg.push("/* AUTO-GENERATED. Do not edit by hand. */");
  reg.push("import type { CalculatorMeta } from '@/specs/calculator';");
  reg.push(metasImports.join('\n'));
  reg.push("");
  reg.push("const metas = new Map<string, CalculatorMeta>([");
  reg.push(metasMapLines.join('\n'));
  reg.push("]);");
  reg.push("");
  reg.push("export async function getCalculatorMeta(locale: string, slugPath: string) {");
  reg.push("  return metas.get(locale + ':' + slugPath) ?? null;");
  reg.push("}");
  reg.push("export function listKnownCalculators() {");
  reg.push("  return Array.from(metas.values()).map(m => ({ locale: m.locale, slug: m.slug }));");
  reg.push("}");
  fs.writeFileSync(registryOut, reg.join('\n'));

  const cli = [];
  cli.push("/* AUTO-GENERATED. Do not edit by hand. */");
  cli.push(formulasImports.join('\n'));
  cli.push("");
  cli.push("export const clientFormulas: Map<string, (inputs: Record<string, any>) => Record<string, any>> = new Map([");
  cli.push(formulasLines.join('\n'));
  cli.push("]);");
  fs.writeFileSync(clientOut, cli.join('\n'));

  // simple report
  const locales = detectLocalesFromContent(base);
  console.log(`Locales (content): ${locales.join(', ') || '(none found)'}`);
  console.log(`Discovered (content *.md): ${entries.length} | Generated new modules: ${created.length}`);
}

generate();
