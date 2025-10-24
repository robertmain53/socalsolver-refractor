#!/usr/bin/env bash
set -euo pipefail

echo "[PATCH] Update generator: drop dynamic segments and mkdir nested dirs…"
node <<'NODE'
const fs=require('fs');const p='scripts/generate_calculators.mjs';
if(!fs.existsSync(p)){console.error('Missing '+p);process.exit(1);}
let s=fs.readFileSync(p,'utf8');

// 1) In scanLegacy(), after computing rel, filter out '(' or '[' segments
s = s.replace(
  /const rel = path\.relative\(root, path\.dirname\(p\)\); \/\/ e\.g\. "fisco\/imu"\s*if\(!rel .*?continue;\s*out\.push\(\{ locale, slug: rel\.replace/,
  `const rel = path.relative(root, path.dirname(p)); // e.g. "fisco/imu" or "tax/[slug]"
            // drop route groups and dynamic segments
            const cleaned = rel.split(path.sep).filter(seg => seg && !seg.startsWith('(') && !seg.startsWith('[')).join('/');
            if(!cleaned) continue;
            out.push({ locale, slug: cleaned.replace`
);

// 2) Ensure nested dirs are created for file path
s = s.replace(
  /const outFile\s*=\s*path\.join\(outDir,\s*fileSlug\s*\+\s*'\.ts'\);\s*if\(!fs\.existsSync\(outFile\)\)\s*\{\s*fs\.writeFileSync\(outFile, metaModuleText\(locale, slug\)\);/,
  `const outFile = path.join(outDir, fileSlug + '.ts');
    const outDirNested = require('path').dirname(outFile);
    if (!fs.existsSync(outDirNested)) fs.mkdirSync(outDirNested, { recursive: true });
    if(!fs.existsSync(outFile)){
      fs.writeFileSync(outFile, metaModuleText(locale, slug));`
);

fs.writeFileSync(p,s);
console.log('[OK] Patched', p);
NODE

echo "[RUN] Generate from legacy (scans legacy/app and legacy/app-old)…"
GC_LEGACY_DIR=legacy node scripts/generate_calculators.mjs

echo "[BUILD] Building…"
npm run build
