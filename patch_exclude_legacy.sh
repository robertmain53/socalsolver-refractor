#!/usr/bin/env bash
set -euo pipefail
echo "[PATCH] Updating tsconfig.json include/exclude…"

node <<'NODE'
const fs=require('fs');
const path='tsconfig.json';
const ts=JSON.parse(fs.readFileSync(path,'utf8'));
ts.compilerOptions=ts.compilerOptions||{};
ts.include = ["next-env.d.ts","src/**/*"];
ts.exclude = ["node_modules",".next","legacy","legacy/**","legacy/**/*"];
// keep what we already set earlier:
ts.compilerOptions.baseUrl = ts.compilerOptions.baseUrl || ".";
ts.compilerOptions.paths = ts.compilerOptions.paths || {"@/*":["./src/*"]};
ts.compilerOptions.resolveJsonModule = true;
ts.compilerOptions.esModuleInterop = ts.compilerOptions.esModuleInterop ?? true;
ts.compilerOptions.strictNullChecks = ts.compilerOptions.strictNullChecks ?? true;
ts.compilerOptions.noUncheckedIndexedAccess = ts.compilerOptions.noUncheckedIndexedAccess ?? true;
fs.writeFileSync(path, JSON.stringify(ts,null,2));
console.log("[PATCH] tsconfig.json updated.");
NODE

echo "[PATCH] Ensuring ESLint ignores legacy/…"
# create or append to .eslintignore
touch .eslintignore
grep -qxF 'legacy/' .eslintignore || echo 'legacy/' >> .eslintignore
grep -qxF 'legacy/**' .eslintignore || echo 'legacy/**' >> .eslintignore
echo "[PATCH] Done."
