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
