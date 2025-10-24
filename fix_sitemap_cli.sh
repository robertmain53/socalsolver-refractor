#!/usr/bin/env bash
set -euo pipefail

echo "[PATCH] Updating package.json scripts → use next-sitemap CLI"
node <<'NODE'
const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.postbuild = 'next-sitemap';
pkg.scripts.sitemap   = 'next-sitemap';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('[PATCH] package.json updated.');
NODE

if [ -f scripts/postbuild.js ]; then
  rm -f scripts/postbuild.js
  echo "[PATCH] Removed scripts/postbuild.js"
fi

echo "[PATCH] Done. Make sure SITE_URL is set in .env.local (e.g. https://refactor.socalsolver.com)"
