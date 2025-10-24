import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculateur TVA - Taux 20%, 10%, 5.5%"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "fr:epargne-et-investissements/calculateur-tva",
  slug: "epargne-et-investissements/calculateur-tva",
  category: "epargne-et-investissements",
  locale: "fr",
  title: "Calculateur TVA - Taux 20%, 10%, 5.5%",
  description: "Calculez TVA HT, TTC et montant TVA selon les taux français 20%, 10%, 5,5% et 2,1%.",
  keywords: ["[\"TVA\"]"],
  inputs: [
    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.01, default: 1 }
  ],
  outputs: [
    { id: 'result', label: 'Result', decimals: 4 }
  ],
  references: [
    { label: 'Methodology / Standard (placeholder)', url: 'https://example.com' }
  ],
  faq: [
    { q: "How do I use the Calculateur TVA - Taux 20%, 10%, 5.5% calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};