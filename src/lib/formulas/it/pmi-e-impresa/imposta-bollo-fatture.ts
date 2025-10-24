import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calcolo Imposta di Bollo su Fatture Elettroniche"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:pmi-e-impresa/imposta-bollo-fatture",
  slug: "pmi-e-impresa/imposta-bollo-fatture",
  category: "pmi-e-impresa",
  locale: "it",
  title: "Calcolo Imposta di Bollo su Fatture Elettroniche",
  description: "Calcola quando applicare marca da bollo 2€ su fatture elettroniche oltre 77,47€ senza IVA.",
  keywords: ["[\"bollo fatture\"]"],
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
    { q: "How do I use the Calcolo Imposta di Bollo su Fatture Elettroniche calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};