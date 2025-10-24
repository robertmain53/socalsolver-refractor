import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// env
const LEGACY_DIR = process.env.GC_LEGACY_DIR || 'legacy';
const LOCALES    = ['en','it'];

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function titleCase(s){ return s.replace(/[-_]/g,' ').replace(/\s+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).trim(); }
function safeVar(s){ return s.replace(/[^a-zA-Z0-9_]/g,'_'); }
function safeKey(s){ return s.replace(/[^a-zA-Z0-9:_/-]/g,'-'); }
function safeFileSlug(slug){
  return slug
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9/.-]+/g,'-')  // keep a-z0-9 / . -
    .replace(/-+/g,'-')
    .replace(/(^-|-$)/g,'');
}
function guessCategoryFromSlug(slug){
  const parts = slug.split('/');
  return parts.length>1 ? (parts[parts.length-2]||'general') : 'general';
}

// scan both legacy/app/<locale>/** and legacy/app-old/<locale>/**
function scanLegacy(){
  const base = path.resolve(LEGACY_DIR);
  const out = [];
  for(const locale of LOCALES){
    const roots = [
      path.join(base,'app',locale),
      path.join(base,'app-old',locale),
    ].filter(d=>fs.existsSync(d));
    for(const root of roots){
      const stack=[root];
      while(stack.length){
        const dir=stack.pop();
        const ents=fs.readdirSync(dir,{withFileTypes:true});
        for(const e of ents){
          const p=path.join(dir,e.name);
          if(e.isDirectory()){ stack.push(p); continue; }
          if(/page\.(tsx|ts|js|jsx|mdx?)$/.test(p)){
            // slug is the folder just above page.*
            const rel = path.relative(root, path.dirname(p)); // e.g. "fisco/imu" or "tax/[slug]"
            // drop route groups and dynamic segments
            const cleaned = rel.split(path.sep).filter(seg => seg && !seg.startsWith('(') && !seg.startsWith('[')).join('/');
            if(!cleaned) continue;
            out.push({ locale, slug: cleaned.replace(/\\/g,'/'), file:p });
          }
        }
      }
    }
  }
  // de-dupe by key
  const seen=new Set();
  return out.filter(r=>{
    const k = `${r.locale}:${r.slug}`;
    if(seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// module text (no template literals)
function buildModule(locale, slug){
  const key         = locale + ':' + slug;
  const human       = titleCase(slug.split('/').pop() || slug);
  const mainKeyword = human;
  const category    = guessCategoryFromSlug(slug);
  const titleStr    = human + ' Calculator';
  const descStr     = 'Professional ' + mainKeyword + ' calculator with clear formulas, examples, and references.';
  const lines = [];
  lines.push("import type { CalculatorMeta, Formula } from '@/specs/calculator';");
  lines.push("");
  lines.push("export const formula: Formula = (inputs) => {");
  lines.push("  // TODO: implement real formula for \"" + human.replace(/"/g,'\\"') + "\"");
  lines.push("  const v = Number(inputs.value ?? 0);");
  lines.push("  return { result: v };");
  lines.push("};");
  lines.push("");
  lines.push("export const meta: CalculatorMeta = {");
  lines.push("  key: " + JSON.stringify(key) + ",");
  lines.push("  slug: " + JSON.stringify(slug) + ","); // ORIGINAL path, used by router
  lines.push("  category: " + JSON.stringify(category) + ",");
  lines.push("  locale: " + JSON.stringify(locale) + ",");
  lines.push("  title: " + JSON.stringify(titleStr) + ",");
  lines.push("  description: " + JSON.stringify(descStr) + ",");
  lines.push("  keywords: " + JSON.stringify([ mainKeyword.toLowerCase(), (mainKeyword.toLowerCase() + " calculator"), "online calculator" ]) + ",");
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
  lines.push("    { q: " + JSON.stringify("How do I use the " + mainKeyword + " calculator?") + ", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },");
  lines.push("    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }");
  lines.push("  ]");
  lines.push("};");
  return lines.join('\n');
}

function generate(){
  const entries = scanLegacy();
  const created = [];
  // write per-calculator file
  for(const {locale, slug} of entries){
    const fileSlug = safeFileSlug(slug); // for filename/import only
    const outDir   = path.join(__dirname,'..','src','lib','formulas',locale);
    ensureDir(outDir);
    const outFile  = path.join(outDir, fileSlug + '.ts');
    if(!fs.existsSync(outFile)){
      fs.writeFileSync(outFile, buildModule(locale, slug));
      created.push(outFile);
    }
  }

  // build static import maps
  const metasImports   = [];
  const formulasImports= [];
  const metasMapLines  = [];
  const formulasLines  = [];

  // Use entries order, unique keys
  const uniq = new Map();
  for(const e of entries){ const k=e.locale+':'+e.slug; if(!uniq.has(k)) uniq.set(k,e); }
  for(const e of uniq.values()){
    const key = e.locale + ':' + e.slug;
    const varName = 'm_' + safeVar(safeKey(key));
    const relImport = '@/lib/formulas/' + e.locale + '/' + safeFileSlug(e.slug);
    metasImports.push("import { meta as " + varName + " } from '" + relImport + "';");
    formulasImports.push("import { formula as " + varName + "_f } from '" + relImport + "';");
    metasMapLines.push("  ['" + key + "', " + varName + "],");
    formulasLines.push("  ['" + key + "', " + varName + "_f],");
  }

  const registryOut = path.join(__dirname,'..','src','lib','registry','generated.ts');
  const clientOut   = path.join(__dirname,'..','src','components','CalculatorRenderer','formulas.generated.ts');

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

  console.log('Created ' + created.length + ' calculators. Maps generated from legacy.');
}

generate();
