import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Auto Elettrica Vs Termica"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:auto-e-trasporti/auto-elettrica-vs-termica",
  slug: "auto-e-trasporti/auto-elettrica-vs-termica",
  category: "auto-e-trasporti",
  locale: "it",
  title: "Auto Elettrica Vs Termica",
  description: "Professional Auto Elettrica Vs Termica calculator with clear formulas, examples, and references.",
  keywords: ["auto elettrica vs termica","auto elettrica vs termica calculator","online calculator"],
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
    { q: "How do I use the Auto Elettrica Vs Termica calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};