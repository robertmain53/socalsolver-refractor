import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calcolo Ravvedimento Operoso e Sanzioni"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:pmi-e-impresa/ravvedimento-operoso-f24",
  slug: "pmi-e-impresa/ravvedimento-operoso-f24",
  category: "pmi-e-impresa",
  locale: "it",
  title: "Calcolo Ravvedimento Operoso e Sanzioni",
  description: "Calcola ravvedimento operoso per pagamenti tardivi: sanzioni ridotte e interessi legali.",
  keywords: ["[\"ravvedimento operoso\"]"],
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
    { q: "How do I use the Calcolo Ravvedimento Operoso e Sanzioni calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};