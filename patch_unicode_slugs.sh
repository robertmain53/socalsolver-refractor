#!/usr/bin/env bash
set -euo pipefail

echo "[1/3] Patch generator to normalize slugs for filenames/imports…"
node <<'NODE'
const fs=require('fs'); const p='scripts/generate_calculators.mjs';
if(!fs.existsSync(p)){ console.error('Missing scripts/generate_calculators.mjs'); process.exit(1); }
let s=fs.readFileSync(p,'utf8');

// add safeFileSlug if missing
if(!/function safeFileSlug\(/.test(s)){
  s = s.replace(
    /function guessCategoryFromSlug[\s\S]*?\}\n/,
`function guessCategoryFromSlug(slug) {
  const parts = slug.split('/');
  return parts.length > 1 ? (parts[parts.length - 2] || 'general') : 'general';
}
function safeFileSlug(slug) {
  // strip accents, keep a-z0-9-/ and single dashes
  return slug
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')   // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9/.-]+/g,'-')                      // non allowed -> -
    .replace(/-+/g,'-')                                 // collapse --
    .replace(/(^-|-$)/g,'');                            // trim -
}
`
  );
}

// use fileSlug when writing files
s = s.replace(
  /const fname\s*=\s*String\(slug\)\.replace\(\[\\^\\w\/-\]\+\,'-'\);\s*const outDir([\s\S]*?)const outFile\s*=\s*path\.join\(outDir,\s*fname\s*\+\s*'\.ts'\);/,
  `const fileSlug = safeFileSlug(slug);
    const outDir$1
    const outFile = path.join(outDir, fileSlug + '.ts');`
);

// use fileSlug in import paths
s = s.replace(
  /const relImport= `@\/lib\/formulas\/\$\{v\.locale\}\/\$\{v\.slug\}`;/g,
  "const relImport= `@/lib/formulas/${v.locale}/${safeFileSlug(v.slug)}`;"
);

// also in the other loop variant (if any)
s = s.replace(
  /const relImport = '@\/lib\/formulas\/' \+ v\.locale \+ '\/' \+ v\.slug;/g,
  "const relImport = '@/lib/formulas/' + v.locale + '/' + safeFileSlug(v.slug);"
);

fs.writeFileSync(p,s);
console.log("Patched:", p);
NODE

echo "[2/3] Re-generate calculators/maps (legacy scan)…"
GC_MODE=legacy GC_LEGACY_DIR=legacy node scripts/generate_calculators.mjs

echo "[3/3] Build…"
npm run build
