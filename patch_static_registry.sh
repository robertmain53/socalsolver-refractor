#!/usr/bin/env bash
set -euo pipefail

FILE="src/lib/registry/index.ts"
[ -f "$FILE" ] || { echo "File not found: $FILE"; exit 1; }

cat > "$FILE" <<'TS'
import type { CalculatorSpec } from '@/specs/calculator';

// IMPORTANT: Turbopack/Next 16 needs statically analyzable imports.
// We define a map of known calculators → lazy import functions.

// Add new calculators here:
const loaders: Record<string, () => Promise<{ spec: CalculatorSpec }>> = {
  'en:convert-pressure': () => import('@/lib/formulas/convert-pressure'),
  'it:converti-pressione': () => import('@/lib/formulas/converti-pressione'),
};

export async function getCalculatorSpec(locale: string, slugPath: string) {
  const key = `${locale}:${slugPath}`;
  const load = loaders[key];
  if (!load) return null; // unknown route
  const mod = await load();
  return mod.spec;
}

// Optional helpers if you later want to iterate:
export function listKnownCalculators() {
  return Object.keys(loaders).map(k => {
    const [locale, slug] = k.split(':');
    return { locale, slug };
  });
}
TS

echo "Patched: $FILE"
