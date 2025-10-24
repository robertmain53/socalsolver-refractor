#!/usr/bin/env bash
set -euo pipefail

echo "[PATCH] Writing next-sitemap.config.js (ESM)…"
cat > next-sitemap.config.js <<'JS'
/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

// NOTE: This is ESM (export default) because next-sitemap's CLI loads config via import.
const config = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: 'public',
  exclude: ['/admin/*', '/status', '/api/*'],
  // Add hreflang alternates for en/it. Adjust if you add more locales.
  transform: async (cfg, path) => {
    const isHome = path === '/';
    // Remove leading locale for alternates
    const pathNoLocale = path.replace(/^\/(en|it)(?=\/|$)/, '');
    return {
      loc: path,
      changefreq: 'weekly',
      priority: isHome ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${cfg.siteUrl}/en${pathNoLocale}`, hreflang: 'en' },
        { href: `${cfg.siteUrl}/it${pathNoLocale}`, hreflang: 'it' },
        { href: cfg.siteUrl, hreflang: 'x-default' }
      ],
    };
  },
};

export default config;
JS

echo "[PATCH] Updating package.json scripts → use the .js config"
node <<'NODE'
const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.postbuild = 'next-sitemap --config next-sitemap.config.js';
pkg.scripts.sitemap   = 'next-sitemap --config next-sitemap.config.js';
fs.writeFileSync(p, JSON.stringify(pkg,null,2));
console.log('[PATCH] package.json updated.');
NODE

# Remove old CJS config if present (optional)
if [ -f next-sitemap.config.cjs ]; then
  rm -f next-sitemap.config.cjs
  echo "[PATCH] Removed legacy next-sitemap.config.cjs"
fi

echo "[PATCH] Ensure .env.local has SITE_URL set (e.g. https://refactor.socalsolver.com)"
