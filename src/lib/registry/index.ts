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
