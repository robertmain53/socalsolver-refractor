import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calcolo Costo Revisione Auto Motorizzazione"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:veicoli-e-trasporti/costo-revisione-auto",
  slug: "veicoli-e-trasporti/costo-revisione-auto",
  category: "veicoli-e-trasporti",
  locale: "it",
  title: "Calcolo Costo Revisione Auto Motorizzazione",
  description: "Calcola costo revisione auto presso Motorizzazione o centri privati autorizzati. Scadenze e tariffe.",
  keywords: ["[\"revisione auto\"]"],
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
    { q: "How do I use the Calcolo Costo Revisione Auto Motorizzazione calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};