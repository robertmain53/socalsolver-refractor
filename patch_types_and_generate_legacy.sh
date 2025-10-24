#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Patch Client.tsx to use typed Map#get and cast…"
node <<'NODE'
const fs=require('fs'); const p='src/components/CalculatorRenderer/Client.tsx';
if (!fs.existsSync(p)) { console.log('Skip: Client.tsx not found'); process.exit(0); }
let s=fs.readFileSync(p,'utf8');

// Ensure we import the generated map (in case previous patches didn't)
if (!/formulas\.generated/.test(s)) {
  s = s.replace(/export function CalculatorClient/,
    "import { clientFormulas } from './formulas.generated';\n\nexport function CalculatorClient");
}

// Use Map#get and explicit function type (keeps TS happy even if map is empty)
s = s.replace(
/const outputs = useMemo\(\(\) => \{\s*const f = clientFormulas\.get\(meta\.key\);\s*return f \? f\(inputs\) : \{\};\s*\}, \[inputs, meta\.key\]\);\s*/m,
`const outputs = useMemo(() => {
  const f = clientFormulas.get(meta.key) as ((inputs: Record<string, any>) => Record<string, any>) | undefined;
  return f ? f(inputs) : {};
}, [inputs, meta.key]);\n`
);

fs.writeFileSync(p,s);
console.log("Patched:", p);
NODE

echo "[2/4] Update generator to type the exported Map and scan legacy/app-old too…"
node <<'NODE'
const fs=require('fs'); const p='scripts/generate_calculators.mjs';
if (!fs.existsSync(p)) { console.error('Missing scripts/generate_calculators.mjs'); process.exit(1); }
let s=fs.readFileSync(p,'utf8');

// 2a) Scan both app/ and app-old/
s = s.replace(
  /const appDir = path\.join\(base, 'app', locale\);[\s\S]*?if \(!fs\.existsSync\(appDir\)\) continue;/m,
  `const appDirs = [path.join(base, 'app', locale), path.join(base, 'app-old', locale)];
    const existing = appDirs.filter(d => fs.existsSync(d));
    if (existing.length === 0) continue;
    for (const appDir of existing) {`
);
// close the 'for (const appDir of existing)' loop right before we finished scanning (find the matching closing brace of that while stack loop). Easiest is to add an extra closing brace right before we return:
s = s.replace(/return results\.filter\(/, `} // end for appDir\n  return results.filter(`);

// 2b) Make the generated formulas map typed
s = s.replace(
  /export const clientFormulas = new Map\(\[/,
  "export const clientFormulas: Map<string, (inputs: Record<string, any>) => Record<string, any>> = new Map(["
);

fs.writeFileSync(p,s);
console.log("Patched:", p);
NODE

echo "[3/4] Generate calculators from legacy (looks in legacy/app-old and legacy/app)…"
GC_MODE=legacy GC_LEGACY_DIR=legacy node scripts/generate_calculators.mjs

echo "[4/4] Build project…"
npm run build
echo "Done. Start dev with: npm run dev"
