#!/usr/bin/env bash
set -euo pipefail

log(){ printf "\033[1;34m[PATCH]\033[0m %s\n" "$*"; }

# 1) Update types: add CalculatorMeta (no formula)
cat > src/specs/calculator.ts <<'TS'
export type Unit = { id: string; label: string };

export type InputField = {
  id: string;
  label: string;
  type: 'number' | 'select' | 'range';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  tooltipMd?: string;
  default?: number | string;
  required?: boolean;
};

export type OutputField = {
  id: string;
  label: string;
  unit?: string;
  decimals?: number;
  explanationMd?: string;
};

export type Formula = (inputs: Record<string, number | string>) => Record<string, number | string>;

export type CalculatorMeta = {
  /** unique key used on client map, e.g. "en:convert-pressure" */
  key: string;
  slug: string;
  category: string;
  locale: 'en' | 'it' | string;
  title: string;
  description: string;
  keywords?: string[];
  inputs: InputField[];
  outputs: OutputField[];
  references?: { label: string; url: string }[];
  faq?: { q: string; aMd: string }[];
};
TS
log "types: specs/calculator.ts updated"

# 2) Update formulas to export meta + formula separately
cat > src/lib/formulas/convert-pressure.ts <<'TS'
import type { CalculatorMeta, Formula } from '@/specs/calculator';

/** Client formula (pure) */
export const formula: Formula = (inputs) => {
  const v = Number(inputs.value ?? 0);
  const from = String(inputs.from ?? 'Pa');
  const toPaFactor: Record<string, number> = {
    Pa: 1, bar: 1e5, psi: 6894.757293168, atm: 101325
  };
  const pa = v * (toPaFactor[from] ?? 1);
  return {
    Pa: pa,
    bar: pa / 1e5,
    psi: pa / 6894.757293168,
    atm: pa / 101325
  };
};

export const meta: CalculatorMeta = {
  key: 'en:convert-pressure',
  slug: 'convert-pressure',
  category: 'engineering/units',
  locale: 'en',
  title: 'Pressure Unit Converter (Pa, bar, psi, atm)',
  description: 'Fast, accurate pressure conversions for engineering work.',
  keywords: ['pressure','Pa','bar','psi','atm','converter'],
  inputs: [
    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.0001, default: 1 },
    { id: 'from', label: 'From unit', type: 'select', default: 'Pa',
      options: [{value:'Pa',label:'Pascal (Pa)'},{value:'bar',label:'bar'},{value:'psi',label:'psi'},{value:'atm',label:'atm'}] }
  ],
  outputs: [
    { id: 'Pa',  label: 'Pascal', unit:'Pa', decimals: 6 },
    { id: 'bar', label: 'bar', unit:'bar', decimals: 9 },
    { id: 'psi', label: 'psi', unit:'psi', decimals: 6 },
    { id: 'atm', label: 'atm', unit:'atm', decimals: 9 }
  ],
  references: [
    { label: 'NIST — Pressure Units', url: 'https://physics.nist.gov/cuu/Units/units.html' }
  ],
  faq: [
    { q: 'What is 1 bar in Pa?', aMd: '1 bar = 100,000 Pa.' },
    { q: 'What is standard atmospheric pressure?', aMd: '1 atm = 101,325 Pa ≈ 1.01325 bar.' }
  ]
};
TS
log "formulas: convert-pressure.ts updated (meta + formula)"

cat > src/lib/formulas/converti-pressione.ts <<'TS'
import type { CalculatorMeta, Formula } from '@/specs/calculator';

export const formula: Formula = (inputs) => {
  const v = Number(inputs.value ?? 0);
  const from = String(inputs.from ?? 'Pa');
  const toPaFactor: Record<string, number> = {
    Pa: 1, bar: 1e5, psi: 6894.757293168, atm: 101325
  };
  const pa = v * (toPaFactor[from] ?? 1);
  return {
    Pa: pa,
    bar: pa / 1e5,
    psi: pa / 6894.757293168,
    atm: pa / 101325
  };
};

export const meta: CalculatorMeta = {
  key: 'it:converti-pressione',
  slug: 'converti-pressione',
  category: 'ingegneria/unita',
  locale: 'it',
  title: 'Convertitore di Pressione (Pa, bar, psi, atm)',
  description: 'Conversioni di pressione rapide e accurate per uso tecnico.',
  keywords: ['pressione','Pa','bar','psi','atm','convertitore'],
  inputs: [
    { id: 'value', label: 'Valore', type: 'number', min: 0, step: 0.0001, default: 1 },
    { id: 'from', label: 'Unità di partenza', type: 'select', default: 'Pa',
      options: [{value:'Pa',label:'Pascal (Pa)'},{value:'bar',label:'bar'},{value:'psi',label:'psi'},{value:'atm',label:'atm'}] }
  ],
  outputs: [
    { id: 'Pa',  label: 'Pascal', unit:'Pa', decimals: 6 },
    { id: 'bar', label: 'bar', unit:'bar', decimals: 9 },
    { id: 'psi', label: 'psi', unit:'psi', decimals: 6 },
    { id: 'atm', label: 'atm', unit:'atm', decimals: 9 }
  ]
};
TS
log "formulas: converti-pressione.ts updated (meta + formula)"

# 3) Replace registry loader to return meta (no function)
cat > src/lib/registry/index.ts <<'TS'
import type { CalculatorMeta } from '@/specs/calculator';
import { meta as enPressure } from '@/lib/formulas/convert-pressure';
import { meta as itPressione } from '@/lib/formulas/converti-pressione';

const metas: Record<string, CalculatorMeta> = {
  [enPressure.key]: enPressure,
  [itPressione.key]: itPressione,
};

export async function getCalculatorMeta(locale: string, slugPath: string) {
  const key = `${locale}:${slugPath}`;
  return metas[key] ?? null;
}

export function listKnownCalculators() {
  return Object.values(metas).map(m => ({ locale: m.locale, slug: m.slug }));
}
TS
log "registry: now serves meta only"

# 4) Update Client component to import formulas locally (static map)
cat > src/components/CalculatorRenderer/Client.tsx <<'TSX'
'use client';

import { useMemo, useState } from 'react';
import type { CalculatorMeta } from '@/specs/calculator';
import { formula as pressureFormula } from '@/lib/formulas/convert-pressure';
import { formula as pressioneFormula } from '@/lib/formulas/converti-pressione';

const clientFormulas: Record<string, (inputs: Record<string, any>) => Record<string, any>> = {
  'en:convert-pressure': pressureFormula,
  'it:converti-pressione': pressioneFormula,
};

export function CalculatorClient({ meta }: { meta: CalculatorMeta }) {
  const [inputs, setInputs] = useState<Record<string, any>>(
    Object.fromEntries(meta.inputs.map(i => [i.id, i.default ?? '']))
  );

  const outputs = useMemo(() => {
    const f = clientFormulas[meta.key];
    return f ? f(inputs) : {};
  }, [inputs, meta.key]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {meta.inputs.map((f) => (
          <div key={f.id} className="grid gap-1">
            <label htmlFor={f.id} className="font-medium">{f.label}</label>
            {f.type === 'number' && (
              <input
                id={f.id}
                inputMode="decimal"
                type="number"
                className="border rounded-md px-3 py-2"
                defaultValue={f.default as any}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(e) => setInputs((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))}
              />
            )}
            {f.type === 'range' && (
              <>
                <input
                  id={f.id}
                  type="range"
                  className="w-full"
                  defaultValue={f.default as any}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))}
                />
                <div className="text-sm text-gray-500" aria-live="polite">{String(inputs[f.id])} {f.unit || ''}</div>
              </>
            )}
            {f.type === 'select' && (
              <select
                id={f.id}
                className="border rounded-md px-3 py-2"
                defaultValue={f.default as any}
                onChange={(e) => setInputs((prev) => ({ ...prev, [f.id]: e.target.value }))}
              >
                {f.options?.map(o => <option key={o.value} value={String(o.value)}>{o.label}</option>)}
              </select>
            )}
            {f.tooltipMd && <p className="text-sm text-gray-500">{f.tooltipMd}</p>}
          </div>
        ))}
      </form>
      <section aria-live="polite" className="rounded-xl border p-4">
        {meta.outputs.map((o) => (
          <div key={o.id} className="flex justify-between py-1">
            <span>{o.label}</span>
            <output id={o.id} aria-live="polite">
              {typeof outputs[o.id] === 'number'
                ? (outputs[o.id] as number).toFixed(o.decimals ?? 4)
                : String(outputs[o.id] ?? '')}
              {o.unit ? ` ${o.unit}` : ''}
            </output>
          </div>
        ))}
      </section>
    </div>
  );
}
TSX
log "client renderer: now uses client-side formula map"

# 5) Patch page.tsx to fetch meta and pass it (no function)
cat > src/app/[locale]/[...slug]/page.tsx <<'TSX'
import { getCalculatorMeta } from '@/lib/registry';
import { CalculatorClient } from '@/components/CalculatorRenderer/Client';
import { buildJsonLd } from '@/lib/seo/jsonld';
import React from 'react';

type RouteParams = { locale: string; slug: string[] };

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { locale, slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : '';

  const meta = await getCalculatorMeta(locale, slugPath);

  if (!meta) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-gray-600">This calculator does not exist.</p>
      </main>
    );
  }

  const jsonLd = buildJsonLd(meta as any);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex gap-2">
          <li><a href={`/${locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li>{meta.category}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold">{meta.title}</h1>
      <p className="text-gray-600">{meta.description}</p>
      <CalculatorClient meta={meta} />
      {meta?.faq?.length ? (
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">FAQ</h2>
          <div className="space-y-3">
            {meta.faq.map((f, idx) => (
              <details key={idx} className="border rounded-md p-3">
                <summary className="font-medium">{f.q}</summary>
                <div className="mt-2 text-gray-700">{f.aMd}</div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
TSX
log "page.tsx patched to use meta only"

# 6) Update JSON-LD builder to accept meta (no function)
cat > src/lib/seo/jsonld.ts <<'TS'
import type { CalculatorMeta } from '@/specs/calculator';

export function buildJsonLd(meta: CalculatorMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "applicationCategory": "Calculator",
    "name": meta.title,
    "description": meta.description,
    "inLanguage": meta.locale,
    "operatingSystem": "All",
    "about": meta.keywords || []
  };
}
TS
log "jsonld builder updated"

echo
log "Done. Now run: npm run dev"
