#!/usr/bin/env bash
set -euo pipefail

ROOT="src/lib/formulas"
[ -d "$ROOT" ] || { echo "No $ROOT directory found"; exit 1; }

echo "[1/3] Normalizing filenames under $ROOT …"
node <<'NODE'
const fs = require('fs');
const path = require('path');

function safeFileSlug(slug) {
  return slug
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9/.-]+/g, '-')   // only a-z 0-9 - . /
    .replace(/-+/g, '-')              // collapse --
    .replace(/(^-|-$)/g, '');         // trim -
}

const root = 'src/lib/formulas';
if (!fs.existsSync(root)) process.exit(0);

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && p.endsWith('.ts')) {
      const base = path.basename(p, '.ts'); // original filename (slug)
      const safe = safeFileSlug(base);
      if (safe !== base) {
        const dest = path.join(path.dirname(p), safe + '.ts');
        if (!fs.existsSync(dest)) {
          fs.renameSync(p, dest);
          console.log('Renamed:', p, '->', dest);
        } else {
          // if the ascii version already exists, keep it and remove the unicode one
          fs.unlinkSync(p);
          console.log('Removed duplicate (unicode):', p);
        }
      }
    }
  }
}
walk(root);
NODE

echo "[2/3] Regenerating import maps (legacy scan)…"
GC_MODE=legacy GC_LEGACY_DIR=legacy node scripts/generate_calculators.mjs

echo "[3/3] Building…"
npm run build
