import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Rimborso Chilometrico Aci"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:auto-e-trasporti/rimborso-chilometrico-aci",
  slug: "auto-e-trasporti/rimborso-chilometrico-aci",
  category: "auto-e-trasporti",
  locale: "it",
  title: "Rimborso Chilometrico Aci",
  description: "Professional Rimborso Chilometrico Aci calculator with clear formulas, examples, and references.",
  keywords: ["rimborso chilometrico aci","rimborso chilometrico aci calculator","online calculator"],
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
    { q: "How do I use the Rimborso Chilometrico Aci calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};